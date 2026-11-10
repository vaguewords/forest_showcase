const items = document.querySelectorAll(".accordion-item");

/* 상태 업데이트 */
function updateAccordionState() {
  const openItem = document.querySelector(".accordion-item-open");

  items.forEach((item) => {
    item.classList.remove(
      "accordion-item-open",
      "accordion-item--before-open",
      "accordion-item--after-open",
      "accordion-item--dimmed"
    );

    const label = item.querySelector(".accordion-toggle-label");
    const button = item.querySelector(".accordion-toggle");

    // 현재 대상이 open인지 판단
    const isOpen = (item === openItem);

    if (label) {
      label.textContent = isOpen ? "내용 닫기" : "자세히 보기";
    }

    if (button) {
      button.setAttribute("aria-expanded", isOpen);
    }

    if (!openItem) return;

    if (item === openItem) {
      item.classList.add("accordion-item-open");
    } else {
      item.classList.add("accordion-item--dimmed");

      const itemsArray = Array.from(items);
      const currentIndex = itemsArray.indexOf(item);
      const openIndex = itemsArray.indexOf(openItem);

      if (currentIndex < openIndex) {
        item.classList.add("accordion-item--before-open");
      } else {
        item.classList.add("accordion-item--after-open");
      }
    }
  });
}

/* 열고 닫기 토글 */
function toggleAccordion(item) {
  const isOpen = item.classList.contains("accordion-item-open");

  if (!isOpen) {
    // 다른 item 닫기
    items.forEach((other) => {
      if (other !== item) {
        other.classList.remove("accordion-item-open");

        const btn = other.querySelector(".accordion-toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });

    item.classList.add("accordion-item-open");

  } else {
    item.classList.remove("accordion-item-open");
  }

  updateAccordionState();
}

/* 이벤트 바인딩 */
items.forEach((item) => {
  const button = item.querySelector(".accordion-toggle");

  button.addEventListener("click", (e) => {
    e.preventDefault();
    toggleAccordion(item);
  });
});

/* 첫 번째 아코디언 자동 열기 */
// if (items.length > 0) {
//   items[0].classList.add("accordion-item-open");

//   const btn = items[0].querySelector(".accordion-toggle");
//   btn.setAttribute("aria-expanded", "true");

//   updateAccordionState();
// }
