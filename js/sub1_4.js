"use strict";

// Charm 제품 관심상품
// 하트 버튼을 누르면 해당 제품의 관심상품 선택 상태를 전환합니다.
function initCharmProductFavorites() {
  const products = document.querySelector(".charm-products");
  if (!products) return;

  // 클릭한 관심상품 버튼의 선택 상태와 접근성 속성을 함께 변경합니다.
  function toggleCharmProductFavorite(event) {
    const button = event.target.closest(".charm-product-like");
    if (!button) return;
    const selected = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!selected));
  }

  products.addEventListener("click", toggleCharmProductFavorite);
}

initCharmProductFavorites();

