var lastFocusedElement;

// 오늘 하루 보지 않기 팝업 자동 실행
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal[data-popup-key]').forEach(modal => {
    const popupKey = modal.dataset.popupKey;
    const isHidden = localStorage.getItem(popupKey) === 'true';

    if (!isHidden) {
      // 자동 노출 (트리거 버튼 없이 showModal 실행)
      showModal(modal);
    }
  });
});

// 모든 모달 트리거 버튼
document.querySelectorAll('.modal-show').forEach(button => {
  button.addEventListener('click', () => {
    const modalId = button.dataset.modal;
    const modal = document.getElementById(modalId);
    if (modal) {showModal(modal, button);
      const chart = echarts.init(document.getElementsByClassName('modal-chart-item'));

      setTimeout(() => {
        chart.resize();
      }, 0);
    }
  });
});

function showModal(modal, triggerBtn) {
  removeModal();

  if (triggerBtn) lastFocusedElement = triggerBtn;

  modal.classList.add('modal-visible');

  // 포커스 가능한 요소
  const focusableElementsString =
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

  const focusableElements = Array.from(modal.querySelectorAll(focusableElementsString));
  const firstTabStop = focusableElements[0];
  /*260429 추가*/const modalClose = modal.querySelector('.modal-close');/*260429*/
  const lastTabStop = focusableElements[focusableElements.length - 1];

  /*260429 수정*/
  // if (firstTabStop) firstTabStop.focus();
  if (modalClose) modalClose.focus();
  /*260429 수정*/

  // 키보드 이벤트
  modal.addEventListener('keydown', function handler(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstTabStop) {
        e.preventDefault();
        lastTabStop.focus();
      } else if (!e.shiftKey && document.activeElement === lastTabStop) {
        e.preventDefault();
        firstTabStop.focus();
      }
    } else if (e.key === 'Escape') {
      removeModal(modal);
      modal.removeEventListener('keydown', handler);
    }
  });

  // 배경 클릭
  modal.addEventListener('click', e => {
    if (e.target === modal) removeModal(modal);
  });

  // 닫기 버튼
  modal.querySelectorAll('.modal-close, .modal-confirm').forEach(btn => {
    btn.addEventListener('click', () => removeModal(modal));
  });
}

function removeModal(modal) {
  const visibleModal = modal || document.querySelector('.modal.modal-visible');

  if (!visibleModal) return;

  // 오늘 하루 보지 않기 처리
  const popupKey = visibleModal.dataset.popupKey;
  const checkbox = visibleModal.querySelector('#dont-show-again');

  if (popupKey && checkbox && checkbox.checked) {
    localStorage.setItem(popupKey, 'true');
  }

  // 모달 닫기
  visibleModal.classList.remove('modal-visible');

  // 포커스 복귀
  if (lastFocusedElement) lastFocusedElement.focus();
}

window.showModal = showModal;
window.removeModal = removeModal;