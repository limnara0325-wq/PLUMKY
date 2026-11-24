"use strict";

// 02 REVIEW 전문 보기
// MORE 버튼으로 모든 리뷰의 제목과 본문을 펼치거나 접습니다.
function initReviewMore() {
  const grid = document.querySelector(".review-grid");
  const button = document.querySelector(".review-more");
  if (!grid || !button) return;

  // 리뷰 전문 표시 상태와 버튼의 접근성 안내를 함께 변경합니다.
  function toggleReviewText() {
    const expanded = grid.classList.toggle("is-expanded");
    button.setAttribute("aria-expanded", String(expanded));
    button.setAttribute("aria-label", expanded ? "리뷰 전문 접기" : "리뷰 전문 모두 펼치기");
    button.textContent = expanded ? "LESS" : "MORE";
  }

  button.addEventListener("click", toggleReviewText);
}

initReviewMore();

// SUB4_2 텍스트와 이미지 스크롤 등장 애니메이션
// 배경 영상을 제외한 콘텐츠를 화면에 들어올 때 한 번씩 아래에서 위로 표시합니다.
function initReviewReveal() {
  const page = document.querySelector(".community-page");
  if (!page || !("IntersectionObserver" in window)) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;

  const selectors = [
    ".common-header-nav-list", ".common-header-logo", ".common-header-tools",
    ".review-hero h1", ".review-community-nav", ".review-section-title",
    ".review-card", ".review-more",
    ".footer-home", ".footer-links a", ".footer-social a",
    ".site-footer h2", ".site-footer address", ".footer-metal-item",
    "dialog h2", "dialog p", "dialog a", "dialog button",
    "dialog summary", "dialog label", "dialog img"
  ];
  const candidates = Array.from(page.querySelectorAll(selectors.join(",")));
  const targets = candidates.filter((element) =>
    !element.matches("video, .common-header-sr-only")
    && !candidates.some((parent) => parent !== element && parent.contains(element))
  );

  // 표시한 요소의 관찰을 종료해 스크롤을 되돌려도 다시 숨기지 않습니다.
  function revealElement(element) {
    element.classList.add("is-review-revealed");
    observer.unobserve(element);
  }

  // 화면에 진입한 콘텐츠의 등장 애니메이션을 실행합니다.
  function handleReviewReveal(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) revealElement(entry.target);
    });
  }

  const observer = new IntersectionObserver(handleReviewReveal, {
    threshold: 0.08,
    rootMargin: "0px 0px -24px 0px"
  });

  targets.forEach((element) => {
    element.classList.add("review-reveal");
    observer.observe(element);
  });

  // 키보드 초점이 들어온 콘텐츠는 즉시 표시합니다.
  function handleReviewRevealFocus(event) {
    const element = event.target.closest(".review-reveal");
    if (element) revealElement(element);
  }

  // 모션 줄이기 설정이 켜지면 관찰을 종료하고 모든 콘텐츠를 표시합니다.
  function handleReviewMotionChange(event) {
    if (!event.matches) return;
    observer.disconnect();
    targets.forEach(revealElement);
  }

  page.addEventListener("focusin", handleReviewRevealFocus);
  reducedMotion.addEventListener("change", handleReviewMotionChange);
}

initReviewReveal();
