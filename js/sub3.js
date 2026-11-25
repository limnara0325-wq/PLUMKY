"use strict";

// SUB3 텍스트 및 이미지 스크롤 등장 애니메이션
// 화면에 들어온 텍스트와 이미지를 아래에서 위로 한 번씩 표시합니다.
function initSub3Reveal() {
  if (!document.querySelector(".sub3-page") || !("IntersectionObserver" in window)) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;

  const selectors = [
    "#sub3 h1", "#sub3 h2", "#sub3 h3", "#sub3 p", "#sub3 img", "#sub3 svg[role='img']",
    ".sub3-page > .common-header .common-header-nav-list",
    ".sub3-page > .common-header .common-header-logo",
    ".sub3-page > .common-header .common-header-tools",
    ".sub3-page .site-footer h2", ".sub3-page .site-footer address",
    ".sub3-page .footer-links a", ".sub3-page .footer-social a",
    ".sub3-page .site-footer svg[role='img']", ".sub3-page .site-footer img"
  ];
  const targets = [...document.querySelectorAll(selectors.join(","))].filter((element) => {
    // 03 배너의 배경 사진은 등장 애니메이션에서 제외합니다.
    if (element.matches(".brand-style-background")) return false;
    // 01 배경은 고정하고 BRAND 제목과 문구 이미지만 순서대로 등장시킵니다.
    if (element.closest(".brand-hero")) {
      return element.matches(".brand-hero-title, .brand-hero-word, .brand-hero-description img");
    }
    return !element.classList.contains("common-header-sr-only")
      && !(element.matches("p") && element.querySelector("img"));
  });

  // 표시된 요소의 관찰을 종료하여 스크롤을 반복해도 다시 숨기지 않습니다.
  function revealElement(element) {
    element.classList.add("is-sub3-revealed");
    observer.unobserve(element);
  }

  // 화면에 진입한 요소의 등장 애니메이션을 시작합니다.
  function handleReveal(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) revealElement(entry.target);
    });
  }

  const observer = new IntersectionObserver(handleReveal, {
    threshold: 0.08,
    rootMargin: "0px 0px -24px 0px"
  });

  targets.forEach((element) => {
    element.classList.add("sub3-reveal");
    observer.observe(element);
  });

  // 키보드로 접근한 링크와 버튼은 스크롤 위치에 관계없이 즉시 표시합니다.
  function handleRevealFocus(event) {
    const element = event.target.closest(".sub3-reveal");
    if (element) revealElement(element);
  }

  // 사용자가 모션 줄이기를 켜면 모든 요소를 표시하고 관찰을 종료합니다.
  function handleMotionChange(event) {
    if (!event.matches) return;
    observer.disconnect();
    targets.forEach((element) => element.classList.add("is-sub3-revealed"));
  }

  document.addEventListener("focusin", handleRevealFocus);
  reducedMotion.addEventListener("change", handleMotionChange);
}

initSub3Reveal();
