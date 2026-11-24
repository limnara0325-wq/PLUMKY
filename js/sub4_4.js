"use strict";

// 02 FAQ 아코디언
// 질문을 열면 다른 답변을 닫아 시안처럼 하나의 답변만 표시합니다.
function initQnaFaq() {
  const items = [...document.querySelectorAll(".qna-faq-item")];

  // 새로 펼친 질문을 제외한 나머지 질문을 접습니다.
  function handleFaqToggle(event) {
    if (!event.currentTarget.open) return;
    items.forEach((item) => {
      if (item !== event.currentTarget) item.open = false;
    });
  }

  items.forEach((item) => item.addEventListener("toggle", handleFaqToggle));
}

initQnaFaq();

// 03 INQUIRY BOARD 예시 데이터 검색과 페이지 이동
// HTML의 첫 여섯 문의와 추가 예시 문의를 검색하고 한 페이지에 여섯 건씩 표시합니다.
function initQnaBoard() {
  const body = document.getElementById("qna-board-body");
  const search = document.getElementById("qna-search");
  const pagination = document.getElementById("qna-pagination");
  const message = document.getElementById("qna-board-message");
  const dialog = document.getElementById("qna-detail");
  if (!body || !search || !pagination || !message || !dialog) return;

  const pageSize = 6;
  const initialRows = [...body.rows];
  const rowTemplate = initialRows[0].cloneNode(true);
  const inquiries = initialRows.map((row) => {
    const button = row.querySelector(".qna-inquiry-button");
    return {
      number: row.cells[0].textContent.trim(),
      title: button.querySelector(".qna-inquiry-title").textContent.trim(),
      author: row.cells[3].textContent.trim(),
      date: row.querySelector("time").dateTime,
      private: button.dataset.private === "true",
      question: "주문한 상품의 배송 현황은 어디에서 확인할 수 있나요?",
      answer: "안녕하세요, PLUMKY입니다. 주문 내역에서 배송 현황과 운송장 정보를 확인하실 수 있습니다. 자세한 확인이 필요하시면 주문번호와 함께 고객센터로 문의해 주세요."
    };
  });

  // 추가 페이지를 구성하는 공개·비공개 예시 문의입니다.
  const sampleTitles = [
    "버터플라이 케이스 호환 문의드립니다.", "라일락 케이스 재입고 문의드립니다.",
    "배송 현황 문의드립니다.", "쿠폰 사용 방법 문의드립니다.",
    "참 키링 연결 방법 문의드립니다.", "주문 옵션 변경 문의드립니다."
  ];
  const sampleAuthors = ["JI****", "김***", "YU****", "정***", "MI****", "박***"];
  const publicAnswers = [
    ["립 제품과 케이스는 서로 호환되나요?", "네, 플럼키 립제품과 케이스는 호환 가능합니다."],
    ["라일락 케이스의 재입고 소식을 확인하고 싶어요.", "재입고 소식은 공식몰의 상품 안내와 공지사항을 확인해 주세요."],
    ["주문한 상품의 배송 현황은 어디에서 확인하나요?", "주문 내역에서 배송 현황을 확인하실 수 있습니다. 개별 주문 확인은 고객센터로 문의해 주세요."],
    ["받은 쿠폰은 어디에서 사용하나요?", "주문·결제 화면에서 사용 가능한 쿠폰을 선택해 주세요. 쿠폰별 사용 조건과 유효기간을 함께 확인해 주세요."],
    ["케이스에 참 키링을 연결할 수 있나요?", "참의 연결 고리를 열어 케이스의 키링 고리에 연결해 주세요. 연결 후 고리가 완전히 닫혔는지 확인해 주세요."],
    ["주문한 옵션을 변경하고 싶어요.", "주문번호와 변경을 원하시는 옵션을 고객센터로 알려 주세요. 주문 진행 상태를 확인한 뒤 안내해 드립니다."]
  ];

  for (let index = 0; index < 30; index += 1) {
    const type = index % sampleTitles.length;
    inquiries.push({
      number: String(10900 - index),
      title: sampleTitles[type],
      author: sampleAuthors[type],
      date: `2026-10-${String(31 - index).padStart(2, "0")}`,
      private: index % 3 !== 0,
      question: publicAnswers[type][0],
      answer: publicAnswers[type][1]
    });
  }

  let filtered = inquiries;
  let currentPage = 1;
  let lastOpener = null;

  // 예시 문의 한 건의 내용을 안전하게 텍스트로 채운 행을 만듭니다.
  function createInquiryRow(inquiry) {
    const row = rowTemplate.cloneNode(true);
    row.cells[0].textContent = inquiry.number;
    row.cells[3].textContent = inquiry.author;
    const time = row.querySelector("time");
    time.dateTime = inquiry.date;
    time.textContent = inquiry.date;
    const button = row.querySelector(".qna-inquiry-button");
    button.dataset.number = inquiry.number;
    button.dataset.private = String(inquiry.private);
    button.setAttribute("aria-label", `${inquiry.title} (${inquiry.private ? "비밀글, " : ""}${inquiry.author}, ${inquiry.date})`);
    button.querySelector(".qna-inquiry-title").textContent = inquiry.title;
    button.querySelector(".qna-inquiry-lock").hidden = !inquiry.private;
    return row;
  }

  // 페이지 번호와 이전·다음 이동 버튼을 생성합니다.
  function createPageButton(label, page, step = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.page = String(page);
    button.setAttribute("aria-controls", "qna-board-body");
    if (step) {
      button.className = "qna-page-step";
      button.setAttribute("aria-label", label);
      button.disabled = page < 1 || page > Math.ceil(filtered.length / pageSize);
    } else {
      button.textContent = label;
      button.setAttribute("aria-label", `${page}페이지`);
      if (page === currentPage) button.setAttribute("aria-current", "page");
    }
    return button;
  }

  // 검색 결과의 현재 페이지를 표시하고 페이지 버튼과 안내를 갱신합니다.
  function renderBoard(announce = false) {
    const start = (currentPage - 1) * pageSize;
    body.replaceChildren(...filtered.slice(start, start + pageSize).map(createInquiryRow));
    const pageCount = Math.ceil(filtered.length / pageSize);
    const buttons = [];
    if (pageCount > 0) {
      buttons.push(createPageButton("이전 페이지", currentPage - 1, true));
      for (let page = 1; page <= pageCount; page += 1) {
        buttons.push(createPageButton(String(page), page));
      }
      buttons.push(createPageButton("다음 페이지", currentPage + 1, true));
    }
    pagination.replaceChildren(...buttons);
    pagination.hidden = pageCount === 0;
    message.hidden = !announce && filtered.length > 0;
    message.textContent = filtered.length
      ? `총 ${filtered.length}건의 문의 · ${currentPage} / ${pageCount}페이지`
      : "검색 결과가 없습니다. 다른 검색어를 입력해 주세요.";
  }

  // 선택한 검색 조건으로 전체 문의를 필터링하고 첫 페이지로 이동합니다.
  function handleBoardSearch(event) {
    event.preventDefault();
    const form = new FormData(search);
    const field = form.get("field");
    const keyword = String(form.get("keyword") || "").trim().toLocaleLowerCase("ko");
    filtered = inquiries.filter((inquiry) => inquiry[field].toLocaleLowerCase("ko").includes(keyword));
    currentPage = 1;
    renderBoard(true);
  }

  // 클릭한 페이지를 표시하고 교체된 현재 페이지 버튼에 초점을 유지합니다.
  function handlePageClick(event) {
    const button = event.target.closest("button[data-page]");
    if (!button || button.disabled) return;
    currentPage = Number(button.dataset.page);
    renderBoard(true);
    pagination.querySelector('[aria-current="page"]')?.focus();
  }

  // 공개 문의의 본문과 답변 또는 비밀글 안내를 대화상자로 표시합니다.
  function handleInquiryClick(event) {
    const button = event.target.closest(".qna-inquiry-button");
    if (!button) return;
    const inquiry = inquiries.find((item) => item.number === button.dataset.number);
    if (!inquiry) return;
    lastOpener = button;
    document.getElementById("qna-detail-title").textContent = inquiry.private ? "비밀글입니다" : inquiry.title;
    document.getElementById("qna-detail-question").textContent = inquiry.private
      ? "이 문의는 작성자만 확인할 수 있는 비밀글입니다."
      : `Q. ${inquiry.question}`;
    document.getElementById("qna-detail-answer").textContent = inquiry.private
      ? "문의가 필요하시면 아래 고객센터로 연락해 주세요.\nnara0062@naver.com · 051-1995-0809"
      : `A. ${inquiry.answer}`;
    dialog.showModal();
  }

  // 대화상자를 닫으면 문의를 열었던 버튼으로 초점을 돌립니다.
  function handleInquiryClose() {
    lastOpener?.focus();
    lastOpener = null;
  }

  // 대화상자 바깥 영역을 클릭하면 문의 상세를 닫습니다.
  function handleInquiryBackdrop(event) {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }

  search.addEventListener("submit", handleBoardSearch);
  pagination.addEventListener("click", handlePageClick);
  body.addEventListener("click", handleInquiryClick);
  dialog.addEventListener("close", handleInquiryClose);
  dialog.addEventListener("click", handleInquiryBackdrop);
  renderBoard();
}

initQnaBoard();

// SUB4_4 텍스트와 이미지 스크롤 등장 애니메이션
// 배경 이미지를 제외한 콘텐츠를 화면 진입 시 한 번씩 아래에서 위로 표시합니다.
function initQnaReveal() {
  const page = document.querySelector(".qna-page");
  if (!page || !("IntersectionObserver" in window)) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;
  const targets = [...page.querySelectorAll([
    ".common-header-nav-list", ".common-header-logo", ".common-header-tools",
    ".qna-hero h1", ".qna-community-nav", ".qna-section-title", ".qna-faq", ".qna-board",
    ".footer-home", ".footer-links", ".footer-social", ".footer-details", ".footer-metal-item"
  ].join(","))];

  // 한 번 나타난 콘텐츠는 관찰을 종료하고 표시 상태를 유지합니다.
  function revealElement(element) {
    element.classList.add("is-qna-revealed");
    observer.unobserve(element);
  }

  // 화면에 들어온 콘텐츠에 등장 효과를 실행합니다.
  function handleQnaReveal(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) revealElement(entry.target);
    });
  }

  const observer = new IntersectionObserver(handleQnaReveal, {
    threshold: 0.01,
    rootMargin: "0px 0px -24px 0px"
  });
  targets.forEach((element) => {
    element.classList.add("qna-reveal");
    observer.observe(element);
  });

  // 키보드 초점이 들어온 콘텐츠를 즉시 표시합니다.
  function handleQnaFocus(event) {
    const target = event.target.closest(".qna-reveal");
    if (target) revealElement(target);
  }

  // 모션 줄이기를 켜면 모든 콘텐츠를 즉시 표시합니다.
  function handleQnaMotionChange(event) {
    if (!event.matches) return;
    targets.forEach(revealElement);
    observer.disconnect();
  }

  page.addEventListener("focusin", handleQnaFocus);
  reducedMotion.addEventListener("change", handleQnaMotionChange);
}

initQnaReveal();
