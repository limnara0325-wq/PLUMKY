"use strict";

// 공통 헤더
// 공통 헤더의 드롭다운과 장바구니·전체 메뉴를 초기화합니다.
function initCommonHeader() {
  // 헤더
  const header = document.querySelector(".common-header");
  
  if (header) {
    const dropdowns = [...header.querySelectorAll("[data-common-header-dropdown]")];
    const dialogs = [...document.querySelectorAll(".common-header-dialog")];
    let dialogOpener = null;
    let activeDialog = null;
  
    // 메뉴의 열림 상태와 접근성 속성을 함께 변경합니다.
    function setDropdown(item, isOpen) {
      item.querySelector(".common-header-nav-link").setAttribute("aria-expanded", String(isOpen));
      item.querySelector(".common-header-dropdown").hidden = !isOpen;
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
      if (!item.querySelector(".common-header-dropdown").contains(document.activeElement)) {
        setDropdown(item, false);
      }
    }
  
    // 메뉴 버튼을 클릭하면 해당 드롭다운을 열거나 닫습니다.
    function handleDropdownToggle(event) {
      const item = event.currentTarget.closest("[data-common-header-dropdown]");
      const isOpen = event.currentTarget.getAttribute("aria-expanded") === "true";
      const isMouseClick = event.detail > 0 && window.matchMedia("(hover: hover)").matches;
      closeDropdowns(item);
      setDropdown(item, isMouseClick || !isOpen);
    }
  
    // 아래쪽 방향키로 드롭다운의 첫 번째 링크로 이동합니다.
    function handleDropdownKeydown(event) {
      if (event.key !== "ArrowDown" || !event.target.matches(".common-header-nav-link")) return;
      event.preventDefault();
      const item = event.currentTarget;
      closeDropdowns(item);
      setDropdown(item, true);
      item.querySelector(".common-header-dropdown a").focus();
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
      document.body.classList.remove("common-header-dialog-open");
      dialogOpener?.focus();
      dialogOpener = null;
    }
  
    // 헤더 버튼으로 장바구니와 전체 메뉴 대화상자를 제어합니다.
    function handleHeaderClick(event) {
      const opener = event.target.closest("[data-common-header-dialog]");
      const closer = event.target.closest("[data-common-header-close]");
  
      if (opener) {
        const dialog = document.getElementById(opener.dataset.commonHeaderDialog);
        if (!dialog || dialog.open) return;
        if (!opener.closest(".common-header-dialog")) dialogOpener = opener;
        activeDialog = dialog;
        dialogs.forEach((item) => {
          if (item.open) item.close();
        });
        closeDropdowns();
        dialog.showModal();
        document.body.classList.add("common-header-dialog-open");
      } else if (closer) {
        closer.closest(".common-header-dialog").close();
      } else if (event.target.closest(".common-header-side-menu a")) {
        event.target.closest(".common-header-dialog").close();
      } else if (!event.target.closest("[data-common-header-dropdown]")) {
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
      const activeDropdown = document.activeElement?.closest("[data-common-header-dropdown]");
      closeDropdowns();
      activeDropdown?.querySelector(".common-header-nav-link").focus();
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
      item.querySelector(".common-header-nav-link").addEventListener("click", handleDropdownToggle);
    });
  
    dialogs.forEach((dialog) => {
      dialog.addEventListener("close", handleDialogClose);
      dialog.addEventListener("click", handleDialogBackdrop);
    });
  
    document.addEventListener("click", handleHeaderClick);
    document.addEventListener("keydown", handleHeaderEscape);
    window.matchMedia("(max-width: 1024px)").addEventListener("change", handleHeaderBreakpoint);
  }
  
  
}

initCommonHeader();

// 햄버거 메뉴 SHOP 기본 접힘
// 메인과 서브 페이지에서 전체 메뉴를 열 때마다 SHOP 하위 메뉴를 접습니다.
function initCollapsedShopMenu() {
  const menus = document.querySelectorAll(".header-side-menu, .common-header-side-menu");

  // SHOP의 접힘 상태를 초기화하고 다른 메뉴의 상태는 유지합니다.
  function collapseShop(menu) {
    const shop = menu.querySelector("details");
    if (shop) shop.open = false;
  }

  // 전체 메뉴가 표시되기 전에 SHOP을 접습니다.
  function handleMenuOpen(event) {
    const opener = event.target.closest("[data-header-dialog], [data-common-header-dialog]");
    if (!opener) return;
    const menu = document.getElementById(opener.dataset.headerDialog || opener.dataset.commonHeaderDialog);
    if (menu?.matches(".header-side-menu, .common-header-side-menu")) collapseShop(menu);
  }

  menus.forEach(collapseShop);
  document.addEventListener("click", handleMenuOpen, true);
}

initCollapsedShopMenu();

// COMMUNITY 페이지 이동과 복원 시 등장 애니메이션 시작 시점 관리
// 초기 숨김 상태를 먼저 그린 뒤 관찰을 시작하고 캐시 복원이나 같은 페이지 이동 시 재실행합니다.
function initCommunityRevealLifecycle(page, targets, observer, revealClass, visibleClass) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let prepareFrame = 0;
  let observeFrame = 0;

  // 준비가 끝난 콘텐츠를 즉시 관찰해 화면 진입에 맞춰 표시합니다.
  function observeTargets() {
    targets.forEach((element) => observer.observe(element));
  }

  // 초기 스타일이 한 프레임 반영된 후 등장 관찰을 시작합니다.
  function prepareObservation() {
    page.classList.remove("community-reveal-preparing");
    observeFrame = window.requestAnimationFrame(observeTargets);
  }

  // 이전 예약을 취소하고 새 진입에 맞춰 숨김 상태와 관찰을 초기화합니다.
  function restartReveal() {
    window.cancelAnimationFrame(prepareFrame);
    window.cancelAnimationFrame(observeFrame);
    observer.disconnect();
    page.classList.add("community-reveal-preparing");
    targets.forEach((element) => {
      element.classList.add(revealClass);
      element.classList.toggle(visibleClass, reducedMotion.matches);
    });
    if (!reducedMotion.matches) {
      prepareFrame = window.requestAnimationFrame(prepareObservation);
    } else {
      page.classList.remove("community-reveal-preparing");
    }
  }

  // 브라우저의 뒤로 가기 캐시에서 복원된 페이지도 등장 효과를 다시 시작합니다.
  function handleCommunityPageShow(event) {
    if (event.persisted) restartReveal();
  }

  // 같은 주소의 카테고리를 다시 선택해도 등장 효과를 실행합니다.
  function handleCommunityNavigation(event) {
    const link = event.target.closest(".gallery-community-nav a, .review-community-nav a, .event-community-nav a, .qna-community-nav a");
    if (!link || event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin === window.location.origin
      && destination.pathname === window.location.pathname
      && destination.search === window.location.search
      && destination.hash === window.location.hash) restartReveal();
  }

  // 페이지를 떠날 때 실행 대기 중인 프레임을 취소합니다.
  function handleCommunityPageHide() {
    window.cancelAnimationFrame(prepareFrame);
    window.cancelAnimationFrame(observeFrame);
  }

  window.addEventListener("pageshow", handleCommunityPageShow);
  window.addEventListener("hashchange", restartReveal);
  window.addEventListener("pagehide", handleCommunityPageHide);
  page.addEventListener("click", handleCommunityNavigation);
  restartReveal();
}

// 공통 장바구니 상품 이미지와 구매하기
// 모든 페이지의 장바구니에 상품 내역과 이미지, 합계 및 구매하기 버튼을 표시합니다.
function initShoppingBag() {
  const dialog = document.querySelector(".common-header-cart, .header-cart");
  if (!dialog) return;
  const storageKey = "plumky-shopping-bag";
  const empty = dialog.querySelector(".common-header-cart-empty, .header-cart-empty");
  const count = dialog.querySelector("h2 span");
  const list = document.createElement("ul");
  const footer = document.createElement("div");
  const total = document.createElement("p");
  const totalAmount = document.createElement("strong");
  const buy = document.createElement("button");
  const notice = document.createElement("p");
  let entries = readCart();

  dialog.classList.add("shopping-bag");
  list.className = "shopping-bag-items";
  list.setAttribute("aria-label", "장바구니 상품");
  footer.className = "shopping-bag-footer";
  total.className = "shopping-bag-total";
  total.append("총 상품 금액", totalAmount);
  buy.type = "button";
  buy.className = "shopping-bag-buy";
  buy.textContent = "구매하기";
  notice.className = "shopping-bag-notice";
  notice.setAttribute("role", "status");
  footer.append(total, buy, notice);
  dialog.append(list, footer);

  // 저장된 상품 내역을 읽고 유효한 장바구니 항목만 복원합니다.
  function readCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.filter((entry) => entry && typeof entry.id === "string"
        && typeof entry.name === "string" && Number.isFinite(entry.price) && entry.price >= 0
        && Number.isSafeInteger(entry.quantity) && entry.quantity > 0
        && Array.isArray(entry.products) && entry.products.length > 0
        && entry.products.every((product) => product && typeof product.name === "string"
          && typeof product.image === "string" && Number.isFinite(product.price) && product.price >= 0));
    } catch {
      return [];
    }
  }

  // 상품 금액을 원화로 표시합니다.
  function formatPrice(price) {
    return `${price.toLocaleString("ko-KR")}원`;
  }

  // 담긴 상품의 수량을 반영한 합계를 계산합니다.
  function getTotal() {
    return entries.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);
  }

  // 상품 옆에 작은 이미지와 이름 및 개별 가격을 표시합니다.
  function createProductRow(product) {
    const row = document.createElement("li");
    const image = document.createElement("img");
    const info = document.createElement("div");
    const name = document.createElement("p");
    const price = document.createElement("p");
    row.className = "shopping-bag-product";
    image.src = product.image;
    image.alt = product.name;
    image.width = 64;
    image.height = 64;
    name.className = "shopping-bag-name";
    name.textContent = product.name;
    price.className = "shopping-bag-price";
    price.textContent = formatPrice(product.price);
    info.append(name, price);
    row.append(image, info);
    return row;
  }

  // 상품 유무에 따라 빈 안내와 하단 구매 영역을 전환하고 내역을 갱신합니다.
  function renderCart() {
    const hasItems = entries.length > 0;
    empty.hidden = hasItems;
    list.hidden = !hasItems;
    footer.hidden = !hasItems;
    notice.textContent = "";
    count.textContent = `(${entries.reduce((sum, entry) => sum + entry.quantity, 0)})`;
    totalAmount.textContent = formatPrice(getTotal());
    list.replaceChildren();
    entries.forEach((entry) => {
      const row = document.createElement("li");
      const products = document.createElement("ul");
      const actions = document.createElement("div");
      const quantity = document.createElement("span");
      const subtotal = document.createElement("strong");
      const remove = document.createElement("button");
      row.className = "shopping-bag-item";
      if (entry.custom) {
        const heading = document.createElement("p");
        heading.className = "shopping-bag-custom-title";
        heading.textContent = entry.name;
        row.append(heading);
      }
      entry.products.forEach((product) => products.append(createProductRow(product)));
      actions.className = "shopping-bag-item-actions";
      quantity.textContent = `수량 ${entry.quantity}개`;
      subtotal.textContent = formatPrice(entry.price * entry.quantity);
      remove.type = "button";
      remove.dataset.cartRemove = entry.id;
      remove.textContent = "삭제";
      remove.setAttribute("aria-label", `${entry.name} 장바구니에서 삭제`);
      actions.append(quantity, subtotal, remove);
      row.append(products, actions);
      list.append(row);
    });
  }

  // 변경된 내역을 저장하며 저장소가 제한되어도 현재 화면은 갱신합니다.
  function saveCart() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(entries));
    } catch {
      // 저장소를 사용할 수 없으면 현재 페이지에서 담은 내역을 유지합니다.
    }
    renderCart();
  }

  // 같은 상품을 다시 담으면 수량을 늘리고 새 상품은 목록에 추가합니다.
  function addEntry(entry) {
    const existing = entries.find((item) => item.id === entry.id);
    if (existing) existing.quantity += 1;
    else entries.push({ ...entry, quantity: 1 });
    saveCart();
  }

  // 상품 카드의 장바구니 버튼을 누르면 해당 사진과 판매가를 함께 담습니다.
  function handleProductAdd(event) {
    const button = event.target.closest('[data-common-header-dialog="common-header-cart"]');
    const card = button?.closest("article");
    if (!card || !card.closest("main")) return;
    const image = card.querySelector("img");
    const heading = card.querySelector("h3");
    const priceText = card.querySelector("strong");
    if (!image || !heading || !priceText) return;
    const price = Number(priceText.textContent.replace(/[^0-9]/g, ""));
    const product = { name: image.alt || heading.textContent.trim(), image: image.getAttribute("src"), price };
    addEntry({ id: `product:${product.image}:${price}`, name: product.name, price, products: [product] });
  }

  // 커스터마이징에서 전달한 조합의 각 상품 이미지와 가격을 함께 담습니다.
  function handleCustomAdd(event) {
    const configuration = event.detail;
    if (!configuration?.complete || !configuration.items?.length) return;
    const products = configuration.items.map((item) => ({ name: item.name, image: item.card || item.image, price: item.price }));
    addEntry({
      id: `custom:${JSON.stringify(configuration.items.map((item) => [item.id, item.position?.slot]))}`,
      name: "MADE BY YOU · 나만의 조합",
      price: configuration.total,
      custom: true,
      configuration,
      products
    });
  }

  // 선택한 상품을 삭제하고 다음 조작이 가능한 버튼으로 초점을 옮깁니다.
  function handleRemove(event) {
    const button = event.target.closest("[data-cart-remove]");
    if (!button) return;
    entries = entries.filter((entry) => entry.id !== button.dataset.cartRemove);
    saveCart();
    (list.querySelector("[data-cart-remove]") || (entries.length ? buy : dialog.querySelector("[data-common-header-close], [data-header-close]"))).focus();
  }

  // 주문할 상품 정보를 전달하고 결제 기능이 연결되지 않았으면 안내합니다.
  function handleCheckout() {
    if (!entries.length) return;
    const checkout = new CustomEvent("plumky:checkout", {
      bubbles: true,
      cancelable: true,
      detail: { items: JSON.parse(JSON.stringify(entries)), total: getTotal(), currency: "KRW" }
    });
    if (dialog.dispatchEvent(checkout)) notice.textContent = "결제 기능은 준비 중입니다. 담은 상품은 장바구니에 보관됩니다.";
  }

  // 다른 탭에서 변경된 장바구니도 현재 페이지에 반영합니다.
  function handleStorage(event) {
    if (event.key !== storageKey && event.key !== null) return;
    entries = readCart();
    renderCart();
  }

  document.addEventListener("click", handleProductAdd, true);
  document.addEventListener("plumky:add-to-cart", handleCustomAdd);
  list.addEventListener("click", handleRemove);
  buy.addEventListener("click", handleCheckout);
  window.addEventListener("storage", handleStorage);
  renderCart();
}

initShoppingBag();

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
