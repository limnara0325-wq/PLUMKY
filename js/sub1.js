"use strict";

// SHOP 페이지 전용 기능

// SHOP 텍스트 스크롤 등장 애니메이션
// SHOP 제목, 카테고리, 제품 문구가 화면에 들어오면 아래에서 위로 나타나게 합니다.
function initShopTextReveal() {
  const texts = document.querySelectorAll(
    ".shop-title, .shop-categories a, .shop-best-heading, .shop-best-info > *"
  );
  if (!texts.length || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 화면에 들어온 텍스트의 등장 효과를 한 번 실행합니다.
  function revealShopTexts(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }

  const observer = new IntersectionObserver(revealShopTexts, {
    threshold: 0.15,
    rootMargin: "0px 0px -24px 0px",
  });

  // 같은 영역의 문구에 짧은 시차를 주고 화면 진입을 관찰합니다.
  texts.forEach((text) => {
    const siblings = [...text.parentElement.children];
    const order = text.matches(".shop-categories a, .shop-best-info > *")
      ? siblings.indexOf(text) : 0;
    text.style.setProperty("--shop-text-delay", `${order * 80}ms`);
    text.classList.add("shop-text-reveal");
    observer.observe(text);
  });
}

initShopTextReveal();

// SHOP HOLIDAY 오른쪽에서 왼쪽으로 등장
// Holiday 제목과 제품 영역이 화면에 들어오면 오른쪽에서 왼쪽으로 나타나게 합니다.
function initShopHolidayReveal() {
  const section = document.querySelector(".shop-holiday");
  if (!section || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 이동하지 않는 섹션을 기준으로 제목과 이미지·가격을 함께 표시합니다.
  function revealHolidaySection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
        entry.target.classList.add("is-visible");
      } else if (!entry.isIntersecting) {
        entry.target.classList.remove("is-visible");
      }
    });
  }

  const observer = new IntersectionObserver(revealHolidaySection, {
    threshold: 0.1,
    rootMargin: "0px 0px -24px 0px",
  });
  section.classList.add("is-reveal-ready");
  observer.observe(section);
}

initShopHolidayReveal();

// SHOP HOLIDAY 가로 스와이퍼
// Holiday 제품을 오른쪽 화살표, 드래그, 터치, 방향키로 넘길 수 있게 합니다.
function initShopHolidaySlider() {
  const container = document.querySelector(".shop-holiday-swiper");
  if (!container || typeof window.Swiper !== "function") return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const slider = new window.Swiper(container, {
    slidesPerView: "auto",
    spaceBetween: 10,
    speed: reducedMotion.matches ? 0 : 600,
    grabCursor: true,
    threshold: 8,
    rewind: true,
    watchOverflow: true,
    keyboard: { enabled: true, onlyInViewport: true },
    navigation: { nextEl: ".shop-holiday-next" },
    a11y: {
      nextSlideMessage: "다음 Holiday 제품",
      slideLabelMessage: "{{slidesLength}}개 중 {{index}}번째 제품",
    },
    breakpoints: {
      0: { spaceBetween: 12 },
      601: { spaceBetween: 16 },
      1025: { spaceBetween: 10 },
    },
  });

  // 모션 줄이기 설정이 바뀌면 슬라이드 이동 시간을 갱신합니다.
  function updateHolidayMotion() {
    slider.params.speed = reducedMotion.matches ? 0 : 600;
  }

  reducedMotion.addEventListener("change", updateHolidayMotion);
}

initShopHolidaySlider();

// SHOP HOLIDAY 관심상품
// 하트를 누르면 해당 제품의 관심상품 선택 상태를 전환합니다.
function initShopHolidayFavorites() {
  const section = document.querySelector(".shop-holiday");
  if (!section) return;

  // 클릭한 하트 버튼의 선택 상태와 접근성 속성을 함께 변경합니다.
  function toggleHolidayFavorite(event) {
    const button = event.target.closest(".shop-holiday-like");
    if (!button) return;
    const selected = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!selected));
  }

  section.addEventListener("click", toggleHolidayFavorite);
}

initShopHolidayFavorites();


// SHOP LIPS 왼쪽에서 오른쪽으로 등장
// Lips 제목과 제품 영역이 화면에 들어오면 왼쪽에서 오른쪽으로 나타나게 합니다.
function initShopLipsReveal() {
  const section = document.querySelector(".shop-lips");
  if (!section || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 이동하지 않는 섹션을 기준으로 제목과 이미지·가격을 함께 표시합니다.
  function revealLipsSection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
        entry.target.classList.add("is-visible");
      } else if (!entry.isIntersecting) {
        entry.target.classList.remove("is-visible");
      }
    });
  }

  const observer = new IntersectionObserver(revealLipsSection, {
    threshold: 0.1,
    rootMargin: "0px 0px -24px 0px",
  });
  section.classList.add("is-reveal-ready");
  observer.observe(section);
}

initShopLipsReveal();

// SHOP LIPS 가로 스와이퍼
// Lips 제품을 왼쪽 화살표, 드래그, 터치, 방향키로 넘길 수 있게 합니다.
function initShopLipsSlider() {
  const container = document.querySelector(".shop-lips-swiper");
  if (!container || typeof window.Swiper !== "function") return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const slider = new window.Swiper(container, {
    slidesPerView: "auto",
    initialSlide: container.querySelectorAll(".shop-lips-card").length - 1,
    spaceBetween: 10,
    speed: reducedMotion.matches ? 0 : 600,
    grabCursor: true,
    threshold: 8,
    rewind: true,
    watchOverflow: true,
    keyboard: { enabled: true, onlyInViewport: true },
    navigation: { prevEl: ".shop-lips-prev" },
    a11y: {
      prevSlideMessage: "이전 LIPS 제품",
      slideLabelMessage: "{{slidesLength}}개 중 {{index}}번째 제품",
    },
    breakpoints: {
      0: { spaceBetween: 12 },
      601: { spaceBetween: 16 },
      1025: { spaceBetween: 10 },
    },
  });

  // 모션 줄이기 설정이 바뀌면 슬라이드 이동 시간을 갱신합니다.
  function updateLipsMotion() {
    slider.params.speed = reducedMotion.matches ? 0 : 600;
  }

  reducedMotion.addEventListener("change", updateLipsMotion);
}

initShopLipsSlider();

// SHOP LIPS 관심상품
// 하트를 누르면 해당 제품의 관심상품 선택 상태를 전환합니다.
function initShopLipsFavorites() {
  const section = document.querySelector(".shop-lips");
  if (!section) return;

  // 클릭한 하트 버튼의 선택 상태와 접근성 속성을 함께 변경합니다.
  function toggleLipsFavorite(event) {
    const button = event.target.closest(".shop-lips-like");
    if (!button) return;
    const selected = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!selected));
  }

  section.addEventListener("click", toggleLipsFavorite);
}

initShopLipsFavorites();


// SHOP CASE 오른쪽에서 왼쪽으로 등장
// Case 제목과 제품 영역이 화면에 들어오면 오른쪽에서 왼쪽으로 나타나게 합니다.
function initShopCaseReveal() {
  const section = document.querySelector(".shop-case");
  if (!section || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 이동하지 않는 섹션을 기준으로 제목과 이미지·가격을 함께 표시합니다.
  function revealCaseSection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
        entry.target.classList.add("is-visible");
      } else if (!entry.isIntersecting) {
        entry.target.classList.remove("is-visible");
      }
    });
  }

  const observer = new IntersectionObserver(revealCaseSection, {
    threshold: 0.1,
    rootMargin: "0px 0px -24px 0px",
  });
  section.classList.add("is-reveal-ready");
  observer.observe(section);
}

initShopCaseReveal();

// SHOP CASE 가로 스와이퍼
// Case 제품을 오른쪽 화살표, 드래그, 터치, 방향키로 넘길 수 있게 합니다.
function initShopCaseSlider() {
  const container = document.querySelector(".shop-case-swiper");
  if (!container || typeof window.Swiper !== "function") return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const slider = new window.Swiper(container, {
    slidesPerView: "auto",
    spaceBetween: 10,
    speed: reducedMotion.matches ? 0 : 600,
    grabCursor: true,
    threshold: 8,
    rewind: true,
    watchOverflow: true,
    keyboard: { enabled: true, onlyInViewport: true },
    navigation: { nextEl: ".shop-case-next" },
    a11y: {
      nextSlideMessage: "다음 Case 제품",
      slideLabelMessage: "{{slidesLength}}개 중 {{index}}번째 제품",
    },
    breakpoints: {
      0: { spaceBetween: 12 },
      601: { spaceBetween: 16 },
      1025: { spaceBetween: 10 },
    },
  });

  // 모션 줄이기 설정이 바뀌면 슬라이드 이동 시간을 갱신합니다.
  function updateCaseMotion() {
    slider.params.speed = reducedMotion.matches ? 0 : 600;
  }

  reducedMotion.addEventListener("change", updateCaseMotion);
}

initShopCaseSlider();

// SHOP CASE 관심상품
// 하트를 누르면 해당 제품의 관심상품 선택 상태를 전환합니다.
function initShopCaseFavorites() {
  const section = document.querySelector(".shop-case");
  if (!section) return;

  // 클릭한 하트 버튼의 선택 상태와 접근성 속성을 함께 변경합니다.
  function toggleCaseFavorite(event) {
    const button = event.target.closest(".shop-case-like");
    if (!button) return;
    const selected = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!selected));
  }

  section.addEventListener("click", toggleCaseFavorite);
}

initShopCaseFavorites();

// SHOP 모델 배너 스크롤 패럴랙스
// 배너 틀을 유지하며 스크롤을 내릴수록 안쪽 사진을 위로 이동합니다.
function initShopBannerParallax() {
  const banner = document.querySelector(".shop-model-banner");
  if (!banner) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frameId = null;

  // 화면 안에서 배너가 이동한 비율을 사진의 수직 이동량으로 변환합니다.
  function renderBannerParallax() {
    frameId = null;
    if (reducedMotion.matches) return;
    const bounds = banner.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    if (!bounds.height || bounds.bottom < 0 || bounds.top > viewportHeight) return;
    const progress = Math.max(0, Math.min(1,
      (viewportHeight - bounds.top) / (viewportHeight + bounds.height)
    ));
    const offset = bounds.height * 0.15 * (1 - progress * 2);
    banner.style.setProperty("--shop-banner-offset", `${offset.toFixed(2)}px`);
  }

  // 스크롤과 화면 크기 변경을 한 화면 프레임에 한 번씩 반영합니다.
  function requestBannerParallax() {
    if (reducedMotion.matches || frameId !== null) return;
    frameId = window.requestAnimationFrame(renderBannerParallax);
  }

  // 모션 설정에 따라 패럴랙스를 켜거나 사진을 원래 상태로 복원합니다.
  function updateBannerParallaxMotion() {
    if (frameId !== null) window.cancelAnimationFrame(frameId);
    frameId = null;
    banner.classList.toggle("is-parallax", !reducedMotion.matches);
    if (reducedMotion.matches) {
      banner.style.removeProperty("--shop-banner-offset");
    } else {
      renderBannerParallax();
    }
  }

  window.addEventListener("scroll", requestBannerParallax, { passive: true });
  window.addEventListener("resize", requestBannerParallax);
  reducedMotion.addEventListener("change", updateBannerParallaxMotion);
  updateBannerParallaxMotion();
}

initShopBannerParallax();




// SHOP CHARM 왼쪽에서 오른쪽으로 등장
// Charm 제목과 제품 영역이 화면에 들어오면 왼쪽에서 오른쪽으로 나타나게 합니다.
function initShopCharmReveal() {
  const section = document.querySelector(".shop-charm");
  if (!section || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 이동하지 않는 섹션을 기준으로 제목과 이미지·가격을 함께 표시합니다.
  function revealCharmSection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
        entry.target.classList.add("is-visible");
      } else if (!entry.isIntersecting) {
        entry.target.classList.remove("is-visible");
      }
    });
  }

  const observer = new IntersectionObserver(revealCharmSection, {
    threshold: 0.1,
    rootMargin: "0px 0px -24px 0px",
  });
  section.classList.add("is-reveal-ready");
  observer.observe(section);
}

initShopCharmReveal();

// SHOP CHARM 가로 스와이퍼
// Charm 제품을 왼쪽 화살표, 드래그, 터치, 방향키로 넘길 수 있게 합니다.
function initShopCharmSlider() {
  const container = document.querySelector(".shop-charm-swiper");
  if (!container || typeof window.Swiper !== "function") return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const slider = new window.Swiper(container, {
    slidesPerView: "auto",
    initialSlide: container.querySelectorAll(".shop-charm-card").length - 1,
    spaceBetween: 10,
    speed: reducedMotion.matches ? 0 : 600,
    grabCursor: true,
    threshold: 8,
    rewind: true,
    watchOverflow: true,
    keyboard: { enabled: true, onlyInViewport: true },
    navigation: { prevEl: ".shop-charm-prev" },
    a11y: {
      prevSlideMessage: "이전 CHARM 제품",
      slideLabelMessage: "{{slidesLength}}개 중 {{index}}번째 제품",
    },
    breakpoints: {
      0: { spaceBetween: 12 },
      601: { spaceBetween: 16 },
      1025: { spaceBetween: 10 },
    },
  });

  // 모션 줄이기 설정이 바뀌면 슬라이드 이동 시간을 갱신합니다.
  function updateCharmMotion() {
    slider.params.speed = reducedMotion.matches ? 0 : 600;
  }

  reducedMotion.addEventListener("change", updateCharmMotion);
}

initShopCharmSlider();

// SHOP CHARM 관심상품
// 하트를 누르면 해당 제품의 관심상품 선택 상태를 전환합니다.
function initShopCharmFavorites() {
  const section = document.querySelector(".shop-charm");
  if (!section) return;

  // 클릭한 하트 버튼의 선택 상태와 접근성 속성을 함께 변경합니다.
  function toggleCharmFavorite(event) {
    const button = event.target.closest(".shop-charm-like");
    if (!button) return;
    const selected = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!selected));
  }

  section.addEventListener("click", toggleCharmFavorite);
}

initShopCharmFavorites();


