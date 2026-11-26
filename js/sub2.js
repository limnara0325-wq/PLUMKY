// SUB2 전용 기능
"use strict";

// 헤더와 푸터의 공통 동작은 common.js에서 초기화합니다.

// CUSTOM 영상 배너
// 모션 감소 설정에 맞춰 배경 영상의 자동 재생을 제어합니다.
function initCustomHero() {
  const video = document.querySelector(".custom-hero-video");
  if (!video) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  video.muted = true;

  // 모션 감소를 요청한 사용자의 자동 재생을 중지합니다.
  async function applyMotionPreference() {
    video.autoplay = !reducedMotion.matches;
    if (reducedMotion.matches) video.pause();
    else {
      try {
        await video.play();
      } catch {
        // 브라우저가 자동 재생을 제한하면 정지 상태를 유지합니다.
      }
    }
  }

  reducedMotion.addEventListener("change", applyMotionPreference);
  applyMotionPreference();
}

initCustomHero();

// CUSTOMIZE 제목 등장 애니메이션
// 커스터마이징 제목이 화면에 들어오면 한 번만 위로 올라오며 표시합니다.
function initCustomTitleReveal() {
  const title = document.querySelector(".custom-builder-heading h2");
  if (!title || !("IntersectionObserver" in window)
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 제목이 보이는 시점에 등장 효과를 시작하고 관찰을 종료합니다.
  function revealCustomTitle(entries, observer) {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    title.classList.remove("is-reveal-pending");
    title.classList.add("is-revealed");
    observer.unobserve(title);
  }

  const observer = new IntersectionObserver(revealCustomTitle, { threshold: 0.2 });
  title.classList.add("is-reveal-pending");
  observer.observe(title);
}

initCustomTitleReveal();

// CUSTOMIZE 상품 카탈로그와 SVG 배치 좌표
const customCatalog = {
  lips: [
    { id: "lip-plu", name: "플러미 글레이즈 틴트 01 플루", image: "sub2_image/lip%20%20(5).png", card: "main_image/02_1.PLU.jpg", price: 10900 },
    { id: "lip-mouvy", name: "플러미 글레이즈 틴트 02 모비", image: "sub2_image/lip%20%20(3).png", card: "main_image/02_2.MOV.jpg", price: 10900 },
    { id: "lip-berry", name: "플러미 글레이즈 틴트 03 베리", image: "sub2_image/lip%20%20(4).png", card: "main_image/02_3.BERRY.jpg", price: 10900 },
    { id: "lip-rosy", name: "플러미 글레이즈 틴트 04 로지", image: "sub2_image/lip%20%20(2).png", card: "main_image/02_4.ROSY.jpg", price: 10900 },
    { id: "lip-peony", name: "플러미 글레이즈 틴트 05 피오니", image: "sub2_image/lip%20%20(1).png", card: "main_image/02_5.PIONY.jpg", price: 10900 }
  ],
  case: [
    // 참은 오른쪽 체인 세 곳과 아래쪽 날개 고리 두 곳에만 연결합니다.
    { id: "case-silver", name: "버터플라이 케이스 실버", image: "sub2_image/case%20silver.png", card: "main_image/03_1.siver_hove.jpg", price: 10300, position: { x: -284, y: 7, width: 1032, height: 770.56 }, anchors: [[165, 535], [422, 535], [488, 320], [488, 415], [490, 497]] },
    { id: "case-lilac", name: "버터플라이 케이스 라이트퍼플", image: "sub2_image/case%20lap.png", card: "main_image/03_2.lail.jpg", price: 10300, position: { x: 40, y: 166, width: 522.08, height: 522.08 }, anchors: [[170, 536], [424, 535], [490, 320], [493, 418], [494, 497]] },
    { id: "case-purple", name: "버터플라이 케이스 딥퍼플", image: "sub2_image/case_deep.png", card: "main_image/03_3deep_p.jpg", price: 10300, position: { x: -341, y: 4, width: 1083.6, height: 809.088 }, anchors: [[166, 531], [432, 534], [493, 309], [497, 401], [500, 490]] },
    { id: "case-blue", name: "버터플라이 케이스 라이트블루", image: "sub2_image/case%20bule%20.png", card: "main_image/03_4_bule.jpg", price: 10300, position: { x: -207, y: 5, width: 1032, height: 770.56 }, anchors: [[177, 529], [431, 529], [488, 320], [493, 416], [494, 496]] },
    { id: "case-pink", name: "버터플라이 케이스 라이트핑크", image: "sub2_image/pink.png", card: "main_image/03_5.pink.jpg", price: 10300, position: { x: 55, y: 185, width: 502, height: 502 }, anchors: [[166, 543], [425, 541], [480, 320], [482, 416], [484, 501]] }
  ],
  charm: [
    { id: "charm-butterfly", name: "버터플라이 메탈 참 키링", english: "BUTTERFLY CHARM", image: "sub2_image/charmpng%20(2).png", card: "sub1_image/07_%20(2).jpg", price: 7600, crop: [170, 0, 740, 1448], ring: [0.5, 0.04] },
    { id: "charm-cherry", name: "체리쉬 메탈 참 키링", english: "CHERRISH CHARM", image: "sub2_image/charmpng%20(7).png", card: "sub1_image/07_%20(7).jpg", price: 7600, crop: [170, 0, 740, 1448], ring: [0.5, 0.04] },
    { id: "charm-heart", name: "하트 메탈 참 키링", english: "HEART CHARM", image: "sub2_image/charmpng%20(1).png", card: "sub1_image/07_%20(1).jpg", price: 7600, crop: [170, 0, 740, 1448], ring: [0.5, 0.04] },
    { id: "charm-star", name: "스타 메탈 참 키링", english: "STAR CHARM", image: "sub2_image/charmpng%20(6).png", card: "sub1_image/07_%20(6).jpg", price: 7600, crop: [140, 0, 800, 1448], ring: [0.5, 0.04] },
    { id: "charm-ribbon", name: "리본 메탈 참 키링", english: "RIBBON CHARM", image: "sub2_image/charmpng%20(4).png", card: "sub1_image/07_%20(4).jpg", price: 7600, crop: [600, 0, 480, 937], ring: [0.5, 0.04] },
    { id: "charm-key", name: "키 메탈 참 키링", english: "KEY CHARM", image: "sub2_image/charmpng%20(8).png", card: "sub1_image/07_%20(8).jpg", price: 7600, crop: [170, 0, 600, 1678], ring: [0.5, 0.04] },
    { id: "charm-moon", name: "문 메탈 참 키링", english: "MOON CHARM", image: "sub2_image/charmpng%20(5).png", card: "sub1_image/07_%20(5).jpg", price: 7600, crop: [130, 0, 780, 1536], ring: [0.5, 0.04] },
    { id: "charm-lock", name: "락 메탈 참 키링", english: "LOCK CHARM", image: "sub2_image/charmpng%20(3).png", card: "sub1_image/07_%20(3).jpg", price: 7600, crop: [130, 0, 780, 1536], ring: [0.5, 0.04] }
  ]
};

// CUSTOMIZE 실시간 조합
// 상품 카드, SVG 레이어, 단계 이동과 장바구니 전달 데이터를 초기화합니다.
function initCustomizer() {
  const builder = document.querySelector(".custom-builder");
  if (!builder) return;
  const svgNamespace = "http://www.w3.org/2000/svg";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = { lips: null, case: null, charms: [] };
  const products = new Map();
  const canvases = [...builder.querySelectorAll("[data-custom-canvas]")];
  const status = builder.querySelector("[data-custom-status]");
  const selectionList = builder.querySelector("[data-custom-selection]");

  // 가격을 원화 문자열로 표시합니다.
  function formatPrice(price) {
    return `${price.toLocaleString("ko-KR")}원`;
  }

  // SVG 요소에 속성을 지정해 생성합니다.
  function createSvgElement(tag, attributes = {}) {
    const element = document.createElementNS(svgNamespace, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    return element;
  }

  // 실제 상품 사진과 접근성 선택 상태를 가진 카드를 만듭니다.
  function createProductCards() {
    Object.entries(customCatalog).forEach(([category, items]) => {
      const grid = builder.querySelector(`[data-custom-products="${category}"]`);
      items.forEach((item) => {
        products.set(item.id, { ...item, category });
        const button = document.createElement("button");
        button.type = "button";
        button.className = "custom-product-card";
        button.dataset.customProduct = item.id;
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-label", `${item.name} 선택`);
        const photo = document.createElement("span");
        photo.className = "custom-product-photo";
        const image = document.createElement("img");
        image.src = item.card;
        image.alt = item.name;
        image.loading = "lazy";
        image.draggable = false;
        photo.append(image);
        const name = document.createElement("span");
        name.className = "custom-product-name";
        if (item.english) {
          const english = document.createElement("span");
          english.textContent = item.english;
          name.append(english);
        }
        name.append(document.createTextNode(item.name));
        const price = document.createElement("span");
        price.className = "custom-product-price";
        price.textContent = formatPrice(item.price);
        button.append(photo, name, price);
        grid.append(button);
      });
    });
  }

  // 선택 순서에 따라 케이스의 연결 지점과 원본 비율을 유지하는 참 좌표를 계산합니다.
  function charmPosition(entry) {
    const item = products.get(entry.id);
    const anchor = state.case ? products.get(state.case).anchors[entry.slot] : null;
    if (!anchor) return null;
    // 연결 고리는 유지하면서 참의 표시 크기를 키웁니다.
    const charmHeights = { "charm-moon": 238.05, "charm-heart": 238.05, "charm-lock": 238.05, "charm-star": 238.05 };
    const height = charmHeights[item.id] ?? 180;
    const width = height * item.crop[2] / item.crop[3];
    return { slot: entry.slot, anchor: [...anchor], x: anchor[0] - width * item.ring[0], y: anchor[1] - height * item.ring[1], width, height };
  }

  // 장바구니나 외부 연동에 전달할 조합 데이터를 새 객체로 반환합니다.
  function getConfiguration() {
    const items = [];
    if (state.lips) items.push({ ...products.get(state.lips), position: { x: 245, y: 125, width: 110, height: 450 } });
    if (state.case) items.push({ ...products.get(state.case) });
    state.charms.forEach((entry) => items.push({ ...products.get(entry.id), position: charmPosition(entry) }));
    return JSON.parse(JSON.stringify({ version: 1, coordinateSystem: { width: 600, height: 700, viewBox: [-75, -87.5, 750, 875] }, currency: "KRW", quantity: 1, items, total: items.reduce((sum, item) => sum + item.price, 0), complete: Boolean(state.lips && state.case) }));
  }

  // 참만 골라 해제해도 다른 참의 배치 위치는 유지합니다.
  function toggleProduct(id) {
    const item = products.get(id);
    if (!item) return;
    if (item.category !== "lips" && !state.lips) {
      status.textContent = "먼저 립 컬러를 선택해 주세요.";
      goToStep("custom-lips");
      return;
    }
    if (item.category === "charm" && !state.case) {
      status.textContent = "참을 달기 전에 케이스를 선택해 주세요.";
      goToStep("custom-case");
      return;
    }
    if (item.category === "charm") {
      const index = state.charms.findIndex((entry) => entry.id === id);
      if (index >= 0) state.charms.splice(index, 1);
      else {
        const occupied = new Set(state.charms.map((entry) => entry.slot));
        const slot = products.get(state.case).anchors.findIndex((anchor, position) => !occupied.has(position));
        if (slot < 0) {
          status.textContent = "연결 고리 5곳이 모두 찼습니다. 기존 참을 해제한 뒤 선택해 주세요.";
          return;
        }
        state.charms.push({ id, slot });
      }
    } else state[item.category] = id;
    status.textContent = `${item.name} 선택이 반영되었습니다.`;
    updateCustomization();
  }

  // 선택 목록에서 지정한 상품만 제거하고 조합을 갱신합니다.
  function removeProduct(id) {
    const item = products.get(id);
    if (!item) return;
    if (item.category === "charm") state.charms = state.charms.filter((entry) => entry.id !== id);
    else state[item.category] = null;
    status.textContent = `${item.name} 선택을 해제했습니다.`;
    updateCustomization();
    const nextControl = selectionList.querySelector("button") || document.getElementById("custom-result-title");
    nextControl.focus({ preventScroll: true });
  }

  // 참의 투명 여백을 SVG 뷰포트로 정렬하며 원본 이미지 비율을 보존합니다.
  function createProductLayer(item) {
    const group = createSvgElement("g", { class: "custom-product-layer", "data-layer-id": item.id, "aria-hidden": "true" });
    const position = item.position;
    if (item.category === "charm") {
      const crop = item.crop;
      const viewport = createSvgElement("svg", { x: position.x, y: position.y, width: position.width, height: position.height, viewBox: crop.join(" "), preserveAspectRatio: "xMidYMid meet", overflow: "visible" });
      const dimensions = { "charm-ribbon": [1678, 937], "charm-key": [937, 1678], "charm-moon": [1024, 1536], "charm-lock": [1024, 1536] };
      const [width, height] = dimensions[item.id] || [1086, 1448];
      const image = createSvgElement("image", { href: item.image, width, height });
      viewport.append(image);
      group.append(viewport);
    } else group.append(createSvgElement("image", { href: item.image, ...position, preserveAspectRatio: "xMidYMid meet" }));
    return group;
  }

  // 제거 애니메이션이 끝난 해당 레이어만 삭제합니다.
  function retireLayer(layer) {
    if (layer.classList.contains("is-leaving")) return;
    if (reducedMotion.matches) { layer.remove(); return; }
    layer.classList.add("is-leaving");
    layer.addEventListener("animationend", () => layer.remove(), { once: true });
    window.setTimeout(() => layer.remove(), 450);
  }

  // 두 미리보기의 변경된 상품만 갱신해 기존 참의 등장 효과가 반복되지 않게 합니다.
  function updateScenes(configuration) {
    const visibleItems = state.lips ? configuration.items.filter((item) => item.category !== "charm" || state.case) : [];
    canvases.forEach((canvas) => {
      const desired = new Set(visibleItems.map((item) => item.id));
      [...canvas.querySelectorAll("[data-layer-id]")].forEach((layer) => {
        if (!desired.has(layer.dataset.layerId)) retireLayer(layer);
      });
      visibleItems.forEach((item) => {
        let layer = [...canvas.querySelectorAll("[data-layer-id]")].find((child) => child.dataset.layerId === item.id && !child.classList.contains("is-leaving"));
        if (!layer) {
          layer = createProductLayer(item);
          canvas.querySelector(`[data-layer-category="${item.category}"]`).append(layer);
        }
        else if (item.category === "charm") {
          const viewport = layer.querySelector("svg");
          ["x", "y", "width", "height"].forEach((key) => viewport.setAttribute(key, item.position[key]));
        }
      });
      canvas.closest("[data-custom-scene]").classList.toggle("has-product", Boolean(state.lips));
      canvas.setAttribute("aria-label", visibleItems.length ? `선택한 조합: ${visibleItems.map((item) => item.name).join(", ")}` : "립 컬러를 선택하면 상품이 표시됩니다.");
    });
  }

  // 선택 상태와 가격, 제거 가능한 목록 및 전달 이벤트를 함께 갱신합니다.
  function updateCustomization() {
    const configuration = getConfiguration();
    const selected = new Set(configuration.items.map((item) => item.id));
    builder.querySelector("[data-custom-charm-help]").textContent = state.charms.length === 5
      ? "고리 5곳이 모두 찼어요. 다른 참을 고르려면 선택한 참을 먼저 해제해 주세요."
      : `지정된 고리에 최대 5개까지 달 수 있어요. 다시 누르면 해제돼요. (${state.charms.length}/5)`;
    builder.querySelectorAll("[data-custom-product]").forEach((button) => {
      const active = selected.has(button.dataset.customProduct);
      button.setAttribute("aria-pressed", String(active));
    });
    builder.querySelectorAll("[data-custom-total]").forEach((element) => { element.textContent = formatPrice(configuration.total); });
    builder.querySelector("[data-custom-count]").textContent = `${configuration.items.length} ITEMS`;
    builder.querySelector("[data-custom-cart]").disabled = !configuration.complete;
    selectionList.replaceChildren();
    configuration.items.forEach((item) => {
      const row = document.createElement("li");
      const text = document.createElement("span");
      text.textContent = `${item.name} · ${formatPrice(item.price)}`;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "custom-remove-item";
      remove.dataset.customRemove = item.id;
      remove.textContent = "×";
      remove.setAttribute("aria-label", `${item.name} 제거`);
      row.append(text, remove);
      selectionList.append(row);
    });
    updateScenes(configuration);
    builder.dispatchEvent(new CustomEvent("plumky:customization-change", { bubbles: true, detail: configuration }));
  }

  // 필요한 선택을 확인한 뒤 다음 섹션으로 자연스럽게 스크롤합니다.
  function goToStep(id, requires) {
    if (requires && !state.lips) { status.textContent = "립 컬러를 먼저 선택해 주세요."; id = "custom-lips"; }
    else if (requires === "case" && !state.case) { status.textContent = "케이스를 먼저 선택해 주세요."; id = "custom-case"; }
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth", block: "start" });
    target.querySelector("h3")?.focus({ preventScroll: true });
  }

  // 최종 조합을 로컬 장바구니에 담고 외부 연동용 이벤트를 전달합니다.
  function addToCart() {
    const configuration = getConfiguration();
    if (!configuration.complete) return;
    status.textContent = "선택한 조합을 장바구니에 담았습니다.";
    builder.dispatchEvent(new CustomEvent("plumky:add-to-cart", { bubbles: true, detail: configuration }));
    document.querySelector('.common-header-tools [data-common-header-dialog="common-header-cart"]').click();
  }

  // 상품 선택, 개별 제거, 단계 이동과 장바구니 버튼을 처리합니다.
  function handleCustomizerClick(event) {
    const product = event.target.closest("[data-custom-product]");
    const remove = event.target.closest("[data-custom-remove]");
    const navigation = event.target.closest("[data-custom-go]");
    if (product) toggleProduct(product.dataset.customProduct);
    else if (remove) removeProduct(remove.dataset.customRemove);
    else if (navigation) { event.preventDefault(); goToStep(navigation.dataset.customGo, navigation.dataset.customRequires); }
    else if (event.target.closest("[data-custom-cart]")) addToCart();
  }

  createProductCards();
  canvases.forEach((canvas) => {
    ["lips", "case", "charm"].forEach((category) => canvas.append(createSvgElement("g", { "data-layer-category": category })));
  });
  builder.addEventListener("click", handleCustomizerClick);
  window.plumkyCustomizer = Object.freeze({ getConfiguration });
  updateCustomization();
}

initCustomizer();
