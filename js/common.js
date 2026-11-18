"use strict";

// 헤더
const header = document.querySelector(".site-header");

if (header) {
  const dropdowns = [...header.querySelectorAll("[data-header-dropdown]")];
  const dialogs = [...document.querySelectorAll(".header-dialog")];
  let dialogOpener = null;
  let activeDialog = null;

  // 메뉴의 열림 상태와 접근성 속성을 함께 변경합니다.
  function setDropdown(item, isOpen) {
    item.querySelector(".header-nav-link").setAttribute("aria-expanded", String(isOpen));
    item.querySelector(".header-dropdown").hidden = !isOpen;
  }

  // 지정한 메뉴 외에 열려 있는 드롭다운을 닫습니다.
  function closeDropdowns(except = null) {
    dropdowns.forEach((item) => {
      if (item !== except) setDropdown(item, false);
    });
  }

  // 포인터를 올린 메뉴를 펼치고 다른 메뉴는 닫습니다.
  function handleDropdownEnter(event) {
    if (!window.matchMedia("(hover: hover)").matches) return;
    closeDropdowns(event.currentTarget);
    setDropdown(event.currentTarget, true);
  }

  // 메뉴 밖으로 포인터가 나가면 키보드로 탐색 중인 메뉴를 제외하고 닫습니다.
  function handleDropdownLeave(event) {
    const item = event.currentTarget;
    if (!item.querySelector(".header-dropdown").contains(document.activeElement)) {
      setDropdown(item, false);
    }
  }

  // 메뉴 버튼을 클릭하면 해당 드롭다운을 열거나 닫습니다.
  function handleDropdownToggle(event) {
    const item = event.currentTarget.closest("[data-header-dropdown]");
    const isOpen = event.currentTarget.getAttribute("aria-expanded") === "true";
    const isMouseClick = event.detail > 0 && window.matchMedia("(hover: hover)").matches;
    closeDropdowns(item);
    setDropdown(item, isMouseClick || !isOpen);
  }

  // 아래쪽 방향키로 드롭다운의 첫 번째 링크로 이동합니다.
  function handleDropdownKeydown(event) {
    if (event.key !== "ArrowDown" || !event.target.matches(".header-nav-link")) return;
    event.preventDefault();
    const item = event.currentTarget;
    closeDropdowns(item);
    setDropdown(item, true);
    item.querySelector(".header-dropdown a").focus();
  }

  // 키보드 초점이 메뉴 밖으로 이동하면 드롭다운을 닫습니다.
  function handleDropdownFocusout(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDropdown(event.currentTarget, false);
    }
  }

  // 대화상자를 닫은 뒤 스크롤과 원래 버튼의 초점을 복원합니다.
  function handleDialogClose(event) {
    if (event.currentTarget !== activeDialog) return;
    activeDialog = null;
    document.body.classList.remove("header-dialog-open");
    dialogOpener?.focus();
    dialogOpener = null;
  }

  // 헤더 버튼으로 검색, 장바구니, 전체 메뉴 대화상자를 제어합니다.
  function handleHeaderClick(event) {
    const opener = event.target.closest("[data-header-dialog]");
    const closer = event.target.closest("[data-header-close]");

    if (opener) {
      const dialog = document.getElementById(opener.dataset.headerDialog);
      if (!dialog || dialog.open) return;
      if (!opener.closest(".header-dialog")) dialogOpener = opener;
      activeDialog = dialog;
      dialogs.forEach((item) => {
        if (item.open) item.close();
      });
      closeDropdowns();
      dialog.showModal();
      document.body.classList.add("header-dialog-open");
    } else if (closer) {
      closer.closest(".header-dialog").close();
    } else if (event.target.closest(".header-side-menu a")) {
      event.target.closest(".header-dialog").close();
    } else if (!event.target.closest("[data-header-dropdown]")) {
      closeDropdowns();
    }
  }

  // 대화상자 바깥 배경을 클릭하면 닫습니다.
  function handleDialogBackdrop(event) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) event.currentTarget.close();
  }

  // Escape 키로 드롭다운을 닫고 메뉴 버튼으로 초점을 돌립니다.
  function handleHeaderEscape(event) {
    if (event.key !== "Escape") return;
    const activeDropdown = document.activeElement?.closest("[data-header-dropdown]");
    closeDropdowns();
    activeDropdown?.querySelector(".header-nav-link").focus();
  }

  // 태블릿 화면으로 바뀌면 데스크톱 드롭다운 상태를 초기화합니다.
  function handleHeaderBreakpoint(event) {
    if (event.matches) closeDropdowns();
  }

  dropdowns.forEach((item) => {
    item.addEventListener("pointerenter", handleDropdownEnter);
    item.addEventListener("pointerleave", handleDropdownLeave);
    item.addEventListener("focusout", handleDropdownFocusout);
    item.addEventListener("keydown", handleDropdownKeydown);
    item.querySelector(".header-nav-link").addEventListener("click", handleDropdownToggle);
  });

  dialogs.forEach((dialog) => {
    dialog.addEventListener("close", handleDialogClose);
    dialog.addEventListener("click", handleDialogBackdrop);
  });

  document.addEventListener("click", handleHeaderClick);
  document.addEventListener("keydown", handleHeaderEscape);
  window.matchMedia("(max-width: 1024px)").addEventListener("change", handleHeaderBreakpoint);
}

// 헤더 문구 스크롤 애니메이션
// 화면에 들어오는 헤더 문구를 아래에서 위로 한 번씩 나타나게 준비합니다.
function initHeaderSloganReveal() {
  const slogans = document.querySelectorAll(".header-slogan");
  if (!slogans.length || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 문구가 화면에 들어오면 애니메이션을 실행하고 관찰을 종료합니다.
  function revealSlogans(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }

  const observer = new IntersectionObserver(revealSlogans, {
    threshold: 0.15,
    rootMargin: "0px 0px -24px 0px",
  });

  // 각 문구의 시작 위치를 설정한 뒤 화면 진입 여부를 관찰합니다.
  slogans.forEach((slogan) => {
    slogan.classList.add("is-reveal-ready");
    observer.observe(slogan);
  });
}

initHeaderSloganReveal();

// PRODUCT LIPS 슬라이더
// 오른쪽 제품 영역에만 마우스 드래그와 터치 스와이프를 적용합니다.
function initLipsSlider() {
  const container = document.querySelector(".lips-swiper");
  if (!container || typeof window.Swiper !== "function") return;
  const section = container.closest(".lips-section");
  const mobile = window.matchMedia("(max-width: 600px)");
  const tablet = window.matchMedia("(max-width: 1024px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 화면 크기에 맞는 카드 수와 카드 사이 여백을 계산합니다.
  function getLipsLayout() {
    return {
      slidesPerView: mobile.matches ? 1 : 2,
      spaceBetween: mobile.matches ? 16 : tablet.matches ? 24 : window.innerWidth * 51 / 1920,
    };
  }

  // 페이지 선택 버튼에 키보드로 접근할 수 있는 이름을 지정합니다.
  function renderLipsBullet(index, className) {
    return `<button type="button" class="${className}" aria-label="${index + 1}번째 제품 보기"></button>`;
  }

  const slider = new window.Swiper(container, {
    ...getLipsLayout(),
    loop: true,
    speed: reducedMotion.matches ? 0 : 550,
    grabCursor: true,
    simulateTouch: true,
    threshold: 8,
    watchOverflow: true,
    keyboard: { enabled: true, onlyInViewport: true },
    navigation: {
      prevEl: section.querySelector(".lips-prev"),
      nextEl: section.querySelector(".lips-next"),
    },
    pagination: {
      el: section.querySelector(".lips-pagination"),
      clickable: true,
      renderBullet: renderLipsBullet,
    },
    a11y: {
      prevSlideMessage: "이전 제품",
      nextSlideMessage: "다음 제품",
      slideLabelMessage: "{{slidesLength}}개 중 {{index}}번째 제품",
      paginationBulletMessage: "{{index}}번째 제품 보기",
    },
  });

  // 화면을 바꾸면 카드 수와 여백을 다시 적용합니다.
  function updateLipsLayout() {
    Object.assign(slider.params, getLipsLayout());
    slider.params.speed = reducedMotion.matches ? 0 : 550;
    slider.update();
  }

  window.addEventListener("resize", updateLipsLayout);
  reducedMotion.addEventListener("change", updateLipsLayout);
}

initLipsSlider();

// PRODUCT LIPS 제목 스크롤 애니메이션
// PRODUCT와 LIPS 제목이 화면에 들어오면 아래에서 위로 나타나게 준비합니다.
function initLipsTitleReveal() {
  const titles = document.querySelectorAll(".lips-intro h2, .lips-heading");
  if (!titles.length || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 화면에 들어온 제목의 애니메이션을 한 번 실행합니다.
  function revealLipsTitles(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }

  const observer = new IntersectionObserver(revealLipsTitles, {
    threshold: 0.15,
    rootMargin: "0px 0px -24px 0px",
  });

  // 제목마다 애니메이션 시작 상태를 지정하고 화면 진입을 관찰합니다.
  titles.forEach((title) => {
    title.classList.add("lips-title-reveal");
    observer.observe(title);
  });
}

initLipsTitleReveal();

// LIPS 제품 영역 스크롤 애니메이션
// LIPS 제품 영역이 화면에 들어오면 CASE와 반대로 왼쪽에서 오른쪽으로 진입시킵니다.
function initLipsProductReveal() {
  const products = document.querySelector(".lips-slider-reveal");
  if (!products || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 제품 영역이 화면에 들어오면 진입 효과를 한 번 실행합니다.
  function revealLipsProducts(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }

  const observer = new IntersectionObserver(revealLipsProducts, {
    threshold: 0.1,
    rootMargin: "0px 0px -24px 0px",
  });
  products.classList.add("is-reveal-ready");
  observer.observe(products);
}

initLipsProductReveal();

// PRODUCT CASE 슬라이더
// 케이스를 01부터 오른쪽에서 왼쪽으로 배치하고 드래그와 터치 이동을 적용합니다.
function initCaseSlider() {
  const container = document.querySelector(".case-swiper");
  if (!container || typeof window.Swiper !== "function") return;
  const section = container.closest(".case-section");
  const mobile = window.matchMedia("(max-width: 600px)");
  const tablet = window.matchMedia("(max-width: 1024px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 화면 너비에 맞춰 케이스 표시 개수와 간격을 계산합니다.
  function getCaseLayout() {
    return {
      slidesPerView: mobile.matches ? 1 : 2,
      spaceBetween: mobile.matches ? 16 : tablet.matches ? 24 : window.innerWidth * 50 / 1920,
    };
  }

  // 케이스 슬라이드 위치를 선택하는 페이지 버튼을 만듭니다.
  function renderCaseBullet(index, className) {
    return `<button type="button" class="${className}" aria-label="${index + 1}번째 케이스 보기"></button>`;
  }

  const slider = new window.Swiper(container, {
    ...getCaseLayout(),
    direction: "horizontal",
    initialSlide: 0,
    loop: false,
    rewind: false,
    speed: reducedMotion.matches ? 0 : 550,
    grabCursor: true,
    simulateTouch: true,
    threshold: 8,
    watchOverflow: true,
    keyboard: { enabled: true, onlyInViewport: true },
    navigation: {
      prevEl: section.querySelector(".case-prev"),
      nextEl: section.querySelector(".case-next"),
    },
    pagination: {
      el: section.querySelector(".case-pagination"),
      clickable: true,
      renderBullet: renderCaseBullet,
    },
    a11y: {
      prevSlideMessage: "이전 케이스",
      nextSlideMessage: "다음 케이스",
      slideLabelMessage: "{{slidesLength}}개 중 {{index}}번째 케이스",
      paginationBulletMessage: "{{index}}번째 케이스 보기",
    },
  });

  // 화면 크기와 모션 설정이 바뀌면 케이스 슬라이더를 갱신합니다.
  function updateCaseLayout() {
    Object.assign(slider.params, getCaseLayout());
    slider.params.speed = reducedMotion.matches ? 0 : 550;
    slider.update();
  }

  window.addEventListener("resize", updateCaseLayout);
  reducedMotion.addEventListener("change", updateCaseLayout);
}

initCaseSlider();

// CASE 제품과 제목 스크롤 애니메이션
// CASE 제목은 아래에서 위로, 제품 영역은 오른쪽에서 왼쪽으로 진입하도록 준비합니다.
function initCaseProductReveal() {
  const elements = document.querySelectorAll(".case-slider-reveal, .case-heading");
  if (!elements.length || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 각 요소가 화면에 들어오면 해당 진입 효과를 한 번 실행합니다.
  function revealCaseProducts(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }

  const observer = new IntersectionObserver(revealCaseProducts, {
    threshold: 0.1,
    rootMargin: "0px 0px -24px 0px",
  });
  // 제목과 제품을 각각 관찰하여 서로 다른 방향의 애니메이션을 실행합니다.
  elements.forEach((element) => {
    element.classList.add("is-reveal-ready");
    observer.observe(element);
  });
}

initCaseProductReveal();

// CUSTOMIZING 제목·문구·MORE 버튼 스크롤 애니메이션
// 커스터마이징 제목과 문구, MORE 버튼이 화면에 들어올 때 아래에서 위로 나타나게 준비합니다.
function initCustomTitleReveal() {
  const texts = document.querySelectorAll(".custom-title, .custom-lead, .custom-description, .custom-more");
  if (!texts.length || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 각 요소가 화면에 들어오면 등장 효과를 한 번 실행합니다.
  function revealCustomTitle(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }

  const observer = new IntersectionObserver(revealCustomTitle, {
    threshold: 0.15,
    rootMargin: "0px 0px -24px 0px",
  });
  // 제목과 문구, 버튼을 각각 관찰하여 화면 진입 시점에 맞춰 나타냅니다.
  texts.forEach((text) => {
    text.classList.add("is-reveal-ready");
    observer.observe(text);
  });
}

initCustomTitleReveal();

// HOLIDAY EDITION 소개·제품·구매 버튼 스크롤 애니메이션
// 홀리데이 소개 이미지와 제품 영역, 구매 버튼이 화면에 들어오면 아래에서 위로 나타나게 준비합니다.
function initHolidayIntroReveal() {
  const texts = document.querySelectorAll(".holiday-intro-image, .holiday-products, .holiday-buy");
  if (!texts.length || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 화면에 들어온 요소의 등장 효과를 한 번 실행합니다.
  function revealHolidayTexts(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }

  const observer = new IntersectionObserver(revealHolidayTexts, {
    threshold: 0.15,
    rootMargin: "0px",
  });

  // 소개 이미지와 제품 영역, 버튼을 각각 관찰하여 화면 진입 시점에 맞춰 나타냅니다.
  texts.forEach((text) => {
    text.classList.add("is-reveal-ready");
    observer.observe(text);
  });
}

initHolidayIntroReveal();

// BRAND 스크롤 등장 애니메이션
// 브랜드 제목과 소개 문구, MORE 버튼을 화면 진입 시 아래에서 위로 나타나게 준비합니다.
function initBrandReveal() {
  const elements = document.querySelectorAll(".brand-title, .brand-slogan, .brand-description, .brand-more");
  if (!elements.length || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 화면에 들어온 브랜드 요소의 등장 효과를 한 번 실행합니다.
  function revealBrandElements(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }

  const observer = new IntersectionObserver(revealBrandElements, {
    threshold: 0.15,
    rootMargin: "0px",
  });

  // 각 브랜드 요소를 따로 관찰하여 화면에 들어오는 순서대로 나타냅니다.
  elements.forEach((element) => {
    element.classList.add("brand-reveal-ready");
    observer.observe(element);
  });
}

initBrandReveal();

// GALLERY 중앙 강조 무한 슬라이더
// 가운데 사진을 가장 크게 표시하고 사진 5장을 양방향으로 계속 넘길 수 있게 준비합니다.
function initGallerySlider() {
  const container = document.querySelector(".gallery-swiper");
  if (!container || container.swiper || typeof window.Swiper !== "function") return;
  const section = container.closest(".gallery-section");
  const wrapper = container.querySelector(".swiper-wrapper");
  const photos = [...wrapper.querySelectorAll(".gallery-slide")];
  if (photos.length < 2) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 다섯 장이 함께 보이는 PC에서도 무한 루프에 필요한 사진 수를 확보합니다.
  photos.forEach((photo) => {
    const copy = photo.cloneNode(true);
    copy.setAttribute("data-gallery-copy", "true");
    wrapper.append(copy);
  });

  // 사진의 축소된 실제 너비를 기준으로 인접 사진 사이의 간격을 일정하게 맞춥니다.
  function positionGalleryPhotos(swiper) {
    if (!swiper.slides.length || !swiper.slidesGrid.length) return;
    const gap = Math.min(40, Math.max(16, swiper.width / 48));
    const items = swiper.slides.map((slide, index) => {
      const width = swiper.slidesSizesGrid[index] || slide.offsetWidth;
      const center = swiper.slidesGrid[index] + swiper.translate;
      const progress = center / width;
      const scale = Math.max(0.6, 1 - 0.2 * Math.abs(progress));
      return { slide, width, center, progress, scale, visibleWidth: width * scale };
    });
    let anchor = 0;
    items.forEach((item, index) => {
      if (item.center <= 0) anchor = index;
    });
    const centers = [];
    centers[anchor] = items[anchor].progress * (items[anchor].width * 0.9 + gap);

    for (let index = anchor + 1; index < items.length; index++) {
      centers[index] = centers[index - 1]
        + (items[index - 1].visibleWidth + items[index].visibleWidth) / 2 + gap;
    }
    for (let index = anchor - 1; index >= 0; index--) {
      centers[index] = centers[index + 1]
        - (items[index + 1].visibleWidth + items[index].visibleWidth) / 2 - gap;
    }

    // 중앙에 가까운 다섯 장만 표시하여 반복본이 화면 가장자리에 추가로 보이지 않게 합니다.
    const visiblePhotos = new Set(items
      .map((item, index) => ({ index, distance: Math.abs(item.progress) }))
      .sort((first, second) => first.distance - second.distance)
      .slice(0, 5)
      .map((item) => item.index));

    // 사진 크기와 중심 위치를 함께 보정해 드래그 중에도 동일한 여백을 유지합니다.
    items.forEach((item, index) => {
      const offset = centers[index] - item.center;
      const photo = item.slide.querySelector(".gallery-photo");
      photo.style.transform = `translateX(${offset}px) scale(${item.scale})`;
      photo.style.visibility = visiblePhotos.has(index) ? "visible" : "hidden";
      item.slide.style.zIndex = String(100 - Math.round(Math.abs(item.progress) * 10));
    });
  }

  // 사진의 크기·위치 전환 시간을 Swiper 이동 시간과 동기화합니다.
  function setGalleryTransition(swiper, duration) {
    swiper.slides.forEach((slide) => {
      slide.querySelector(".gallery-photo").style.transitionDuration = `${duration}ms`;
    });
  }

  let hoveredPhoto = null;

  // 사진의 실제 표시 영역을 기준으로 마우스 아래에 있는 이미지에만 확대 효과를 적용합니다.
  function handleGalleryHover(event) {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    if (event.buttons) {
      clearGalleryHover();
      return;
    }
    const photo = [...wrapper.querySelectorAll(".gallery-photo")].find((frame) => {
      if (frame.style.visibility === "hidden") return false;
      const bounds = frame.getBoundingClientRect();
      return event.clientX >= bounds.left && event.clientX <= bounds.right
        && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    }) || null;
    if (photo === hoveredPhoto) return;
    clearGalleryHover();
    hoveredPhoto = photo;
    hoveredPhoto?.classList.add("is-gallery-hovered");
  }

  // 마우스가 벗어나거나 슬라이드가 바뀌면 사진 확대를 해제합니다.
  function clearGalleryHover() {
    hoveredPhoto?.classList.remove("is-gallery-hovered");
    hoveredPhoto = null;
  }

  const slider = new window.Swiper(container, {
    slidesPerView: "auto",
    centeredSlides: true,
    initialSlide: 2,
    spaceBetween: 0,
    loop: true,
    loopAdditionalSlides: 2,
    loopAddBlankSlides: false,
    watchSlidesProgress: true,
    on: {
      init: positionGalleryPhotos,
      setTranslate: positionGalleryPhotos,
      loopFix: positionGalleryPhotos,
      setTransition: setGalleryTransition,
      slideChange: clearGalleryHover,
    },
    speed: reducedMotion.matches ? 0 : 650,
    grabCursor: true,
    simulateTouch: true,
    threshold: 8,
    keyboard: { enabled: true, onlyInViewport: true },
    navigation: {
      prevEl: section.querySelector(".gallery-prev"),
      nextEl: section.querySelector(".gallery-next"),
    },
    a11y: {
      prevSlideMessage: "이전 갤러리 사진",
      nextSlideMessage: "다음 갤러리 사진",
      slideLabelMessage: "갤러리 사진",
    },
  });

  container.addEventListener("pointermove", handleGalleryHover);
  container.addEventListener("pointerup", handleGalleryHover);
  container.addEventListener("pointerleave", clearGalleryHover);

  // 사용자의 모션 설정 변경을 갤러리 전환 속도에 반영합니다.
  function updateGalleryMotion() {
    slider.params.speed = reducedMotion.matches ? 0 : 650;
  }

  reducedMotion.addEventListener("change", updateGalleryMotion);
}

// 슬라이더 초기화와 별개로 갤러리 등장 효과를 먼저 준비합니다.
initGalleryReveal();
initGallerySlider();

// GALLERY 로고와 사진 스크롤 애니메이션
// 갤러리 로고와 사진 영역, MORE 버튼이 화면에 들어오면 아래에서 위로 나타나게 준비합니다.
function initGalleryReveal() {
  const elements = document.querySelectorAll(".gallery-title, .gallery-stage, .gallery-more");
  if (!elements.length || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 갤러리 요소가 화면에 들어오면 재생하고 완전히 벗어나면 다음 진입을 준비합니다.
  function revealGalleryElements(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
        entry.target.classList.add("is-visible");
      } else if (!entry.isIntersecting) {
        entry.target.classList.remove("is-visible");
      }
    });
  }

  const observer = new IntersectionObserver(revealGalleryElements, {
    threshold: 0.1,
    rootMargin: "0px",
  });

  // 로고와 사진 영역을 각각 관찰하여 등장 효과와 슬라이드 이동이 겹치지 않게 합니다.
  elements.forEach((element) => {
    element.classList.add("gallery-reveal-ready");
    observer.observe(element);
  });
}

// FOOTER 메탈 심볼·로고 입체 효과
// 푸터 안의 마우스 위치에 따라 메탈 이미지를 제자리에서 입체적으로 기울입니다.
function initFooterMetalTilt() {
  const footer = document.querySelector(".site-footer");
  if (!footer) return;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frameId = null;
  let tiltX = 0;
  let tiltY = 0;

  // 한 화면 프레임에 한 번씩 회전값을 반영해 마우스 움직임을 부드럽게 처리합니다.
  function renderFooterTilt() {
    footer.style.setProperty("--footer-tilt-x", `${tiltX.toFixed(2)}deg`);
    footer.style.setProperty("--footer-tilt-y", `${tiltY.toFixed(2)}deg`);
    frameId = null;
  }

  // 마우스 좌표를 제한된 회전 각도로 변환하고 이미지 위치는 유지합니다.
  function handleFooterPointerMove(event) {
    if (!finePointer.matches || reducedMotion.matches || event.pointerType !== "mouse") return;
    const bounds = footer.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    tiltX = -y * 8;
    tiltY = x * 10;
    footer.classList.add("is-tilting");
    if (frameId === null) frameId = window.requestAnimationFrame(renderFooterTilt);
  }

  // 마우스가 벗어나거나 모션 설정이 바뀌면 로고를 부드럽게 정면으로 되돌립니다.
  function resetFooterTilt() {
    if (frameId !== null) window.cancelAnimationFrame(frameId);
    frameId = null;
    tiltX = 0;
    tiltY = 0;
    footer.classList.remove("is-tilting");
    footer.style.setProperty("--footer-tilt-x", "0deg");
    footer.style.setProperty("--footer-tilt-y", "0deg");
  }

  footer.addEventListener("pointermove", handleFooterPointerMove);
  footer.addEventListener("pointerleave", resetFooterTilt);
  footer.addEventListener("pointercancel", resetFooterTilt);
  window.addEventListener("blur", resetFooterTilt);
  finePointer.addEventListener("change", resetFooterTilt);
  reducedMotion.addEventListener("change", resetFooterTilt);
}

initFooterMetalTilt();
