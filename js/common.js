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
