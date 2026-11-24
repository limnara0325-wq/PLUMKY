"use strict";

// Case 제품 관심상품
// 하트 버튼을 누르면 해당 제품의 관심상품 선택 상태를 전환합니다.
function initCaseProductFavorites() {
  const products = document.querySelector(".case-products");
  if (!products) return;

  // 클릭한 관심상품 버튼의 선택 상태와 접근성 속성을 함께 변경합니다.
  function toggleCaseProductFavorite(event) {
    const button = event.target.closest(".case-product-like");
    if (!button) return;
    const selected = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!selected));
  }

  products.addEventListener("click", toggleCaseProductFavorite);
}

initCaseProductFavorites();

// Case 텍스트와 이미지 아래에서 등장
// 새로고침할 때 등장 효과를 준비하고 화면에 들어온 콘텐츠를 한 번씩 표시합니다.
function initCaseReveal() {
  const page = document.querySelector(".case-page");
  if (!page || !("IntersectionObserver" in window)) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;

  const elements = [...page.querySelectorAll([
    ".common-header-nav-list > li",
    ".common-header-logo",
    ".common-header-tools > *",
    ".case-visual-image",
    ".case-visual-title",
    ".case-visual-categories > a",
    ".case-products-title",
    ".case-product-card",
    ".footer-home",
    ".footer-links",
    ".footer-social",
    ".footer-contact",
    ".footer-company",
    ".footer-metal",
  ].join(","))];

  // 메인 비주얼은 이미지 다음에 글자를 표시하고 나머지 콘텐츠는 짧은 간격으로 표시합니다.
  function revealVisibleElements(entries) {
    let visibleIndex = 0;
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      let delay = Math.min(visibleIndex, 4) * 80;
      if (entry.target.matches(".case-visual-image")) {
        delay = 0;
      } else if (entry.target.matches(".case-visual-title")) {
        delay = 120;
      } else if (entry.target.matches(".case-visual-categories > a")) {
        const categoryIndex = [...entry.target.parentElement.children].indexOf(entry.target);
        delay = 180 + categoryIndex * 30;
      }
      entry.target.style.setProperty("--case-reveal-delay", `${delay}ms`);
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
      visibleIndex += 1;
    });
  }

  const observer = new IntersectionObserver(revealVisibleElements, { threshold: 0.08 });
  elements.forEach((element) => {
    element.classList.add("case-reveal");
    observer.observe(element);
  });

  // 키보드 초점을 받은 콘텐츠는 대기 없이 즉시 표시합니다.
  function revealFocusedElement(event) {
    const element = event.target.closest(".case-reveal");
    if (!element) return;
    element.style.setProperty("--case-reveal-delay", "0ms");
    element.classList.add("is-visible");
    observer.unobserve(element);
  }

  // 사용자가 모션 줄이기를 켜면 대기 중인 콘텐츠를 모두 표시합니다.
  function updateRevealMotion(event) {
    if (!event.matches) return;
    observer.disconnect();
    elements.forEach((element) => element.classList.add("is-visible"));
  }

  page.addEventListener("focusin", revealFocusedElement);
  reducedMotion.addEventListener("change", updateRevealMotion);
}

initCaseReveal();
