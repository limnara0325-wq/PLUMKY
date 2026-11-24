"use strict";

// SUB4_3 텍스트와 이미지 스크롤 등장 애니메이션
// 메인 배너 배경 이미지를 제외한 콘텐츠를 화면 진입 시 한 번씩 아래에서 위로 표시합니다.
function initEventReveal() {
  const page = document.querySelector(".event-page");
  if (!page || !("IntersectionObserver" in window)) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;

  const selectors = [
    ".common-header-nav-list", ".common-header-logo", ".common-header-tools",
    ".event-hero h1", ".event-community-nav", ".event-section-title",
    ".event-card",
    ".footer-home", ".footer-links a", ".footer-social a",
    ".site-footer h2", ".site-footer address", ".footer-metal-item",
    "dialog h2", "dialog p", "dialog a", "dialog button",
    "dialog summary", "dialog label", "dialog img"
  ];
  const candidates = Array.from(page.querySelectorAll(selectors.join(",")));
  const targets = candidates.filter((element) =>
    !element.matches(".event-hero-image, .common-header-sr-only")
    && !candidates.some((parent) => parent !== element && parent.contains(element))
  );

  // 한 번 표시한 요소의 관찰을 종료해 스크롤을 되돌려도 표시 상태를 유지합니다.
  function revealElement(element) {
    element.classList.add("is-event-revealed");
    observer.unobserve(element);
  }

  // 화면에 들어온 텍스트와 이미지에 등장 효과를 실행합니다.
  function handleEventReveal(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) revealElement(entry.target);
    });
  }

  const observer = new IntersectionObserver(handleEventReveal, {
    threshold: 0.08,
    rootMargin: "0px 0px -24px 0px"
  });

  targets.forEach((element) => {
    element.classList.add("event-reveal");
    observer.observe(element);
  });

  // 키보드 초점이 들어온 콘텐츠는 즉시 표시합니다.
  function handleEventRevealFocus(event) {
    const element = event.target.closest(".event-reveal");
    if (element) revealElement(element);
  }

  // 모션 줄이기 설정이 켜지면 관찰을 종료하고 모든 콘텐츠를 표시합니다.
  function handleEventMotionChange(event) {
    if (!event.matches) return;
    observer.disconnect();
    targets.forEach(revealElement);
  }

  page.addEventListener("focusin", handleEventRevealFocus);
  reducedMotion.addEventListener("change", handleEventMotionChange);
}

initEventReveal();
