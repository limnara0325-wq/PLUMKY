"use strict";

// STYLE GALLERY 사진 확대 보기와 전체 사진 탐색
// 콜라주 사진과 MORE 버튼에서 같은 확대 사진 뷰어를 사용할 수 있도록 초기화합니다.
function initStyleGallery() {
  const gallery = document.querySelector(".style-gallery");
  const dialog = document.querySelector("#gallery-dialog");
  if (!gallery || !dialog) return;

  const cards = Array.from(gallery.querySelectorAll(".gallery-card"));
  const dialogImage = dialog.querySelector(".gallery-dialog-image");
  const dialogCategory = dialog.querySelector(".gallery-category");
  const dialogTitle = dialog.querySelector(".gallery-dialog-title");
  const dialogDescription = dialog.querySelector(".gallery-dialog-description");
  const dialogLink = dialog.querySelector(".gallery-dialog-link");
  const position = dialog.querySelector("[data-gallery-position]");
  let currentIndex = 0;
  let opener = null;

  // 선택한 사진의 원본과 설명, 상품 카테고리 링크를 뷰어에 표시합니다.
  function renderGalleryPhoto(index) {
    currentIndex = (index + cards.length) % cards.length;
    const card = cards[currentIndex];
    const image = card.querySelector("img");
    dialogImage.src = image.getAttribute("src");
    dialogImage.alt = image.alt;
    dialogImage.width = Number(image.getAttribute("width"));
    dialogImage.height = Number(image.getAttribute("height"));
    dialogCategory.textContent = card.dataset.category;
    dialogTitle.textContent = card.querySelector("h3").textContent;
    dialogDescription.textContent = card.dataset.description;
    dialogLink.href = card.dataset.shop;
    dialogLink.textContent = `${card.dataset.category} 컬렉션 보기`;
    position.textContent = `${currentIndex + 1} / ${cards.length}`;
  }

  // 선택한 사진 또는 MORE 버튼의 첫 사진부터 확대 보기를 엽니다.
  function openGalleryPhoto(event) {
    const button = event.target.closest(".gallery-open, [data-gallery-more]");
    if (!button) return;
    const card = button.closest(".gallery-card");
    opener = button;
    renderGalleryPhoto(card ? cards.indexOf(card) : 0);
    dialog.showModal();
    document.body.classList.add("gallery-dialog-open");
  }

  // 이전 사진으로 이동하며 첫 번째 사진에서는 마지막 사진을 표시합니다.
  function showPreviousPhoto() {
    renderGalleryPhoto(currentIndex - 1);
  }

  // 다음 사진으로 이동하며 마지막 사진에서는 첫 번째 사진을 표시합니다.
  function showNextPhoto() {
    renderGalleryPhoto(currentIndex + 1);
  }

  // 좌우 방향키를 사용해 확대 사진을 탐색합니다.
  function handleGalleryKeydown(event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPreviousPhoto();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showNextPhoto();
    }
  }

  // 닫기 버튼을 누르면 확대 대화상자를 닫습니다.
  function closeGalleryPhoto() {
    dialog.close();
  }

  // 확대 사진 바깥 배경을 클릭하면 대화상자를 닫습니다.
  function closeGalleryBackdrop(event) {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      dialog.close();
    }
  }

  // 대화상자가 닫히면 본문 스크롤과 원래 버튼의 키보드 초점을 복원합니다.
  function restoreGalleryFocus() {
    document.body.classList.remove("gallery-dialog-open");
    opener?.focus({ preventScroll: true });
    opener = null;
  }

  gallery.addEventListener("click", openGalleryPhoto);
  dialog.querySelector(".gallery-dialog-close").addEventListener("click", closeGalleryPhoto);
  dialog.querySelector("[data-gallery-previous]").addEventListener("click", showPreviousPhoto);
  dialog.querySelector("[data-gallery-next]").addEventListener("click", showNextPhoto);
  dialog.addEventListener("keydown", handleGalleryKeydown);
  dialog.addEventListener("click", closeGalleryBackdrop);
  dialog.addEventListener("close", restoreGalleryFocus);
}

initStyleGallery();

// SUB4_1 텍스트와 이미지 스크롤 등장 애니메이션
// 01 메인 배너 이미지를 제외한 콘텐츠를 화면 진입 시 아래에서 위로 표시합니다.
function initGalleryReveal() {
  const page = document.querySelector(".gallery-page");
  if (!page || !("IntersectionObserver" in window)) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;

  const selectors = [
    ".common-header-nav-list", ".common-header-logo", ".common-header-tools",
    ".gallery-hero h1", ".gallery-community-nav", ".gallery-title",
    ".gallery-card", ".gallery-more",
    ".footer-home", ".footer-links a", ".footer-social a",
    ".site-footer h2", ".site-footer address", ".footer-metal-item",
    "dialog h2", "dialog p", "dialog a", "dialog button",
    "dialog summary", "dialog label", "dialog img"
  ];
  const candidates = Array.from(page.querySelectorAll(selectors.join(",")));
  const targets = candidates.filter((element) =>
    !element.matches(".gallery-hero-image, .common-header-sr-only")
    && !candidates.some((parent) => parent !== element && parent.contains(element))
  );

  // 한 번 표시된 요소의 관찰을 종료합니다.
  function revealElement(element) {
    element.classList.add("is-gallery-revealed");
    observer.unobserve(element);
  }

  // 화면에 들어온 텍스트와 이미지의 등장 효과를 실행합니다.
  function handleGalleryReveal(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) revealElement(entry.target);
    });
  }

  const observer = new IntersectionObserver(handleGalleryReveal, {
    threshold: 0.01,
    rootMargin: "0px 0px 32px 0px"
  });

  initCommunityRevealLifecycle(page, targets, observer, "gallery-reveal", "is-gallery-revealed");

  // 키보드 초점이 들어온 콘텐츠는 즉시 표시합니다.
  function handleGalleryRevealFocus(event) {
    const element = event.target.closest(".gallery-reveal");
    if (element) revealElement(element);
  }

  // 모션 줄이기 설정이 켜지면 모든 콘텐츠를 표시합니다.
  function handleGalleryMotionChange(event) {
    if (!event.matches) return;
    observer.disconnect();
    targets.forEach(revealElement);
  }

  page.addEventListener("focusin", handleGalleryRevealFocus);
  reducedMotion.addEventListener("change", handleGalleryMotionChange);
}

initGalleryReveal();
