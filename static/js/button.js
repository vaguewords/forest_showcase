function adjustButtonWidth() {
    const buttons = document.querySelectorAll('.btn-area > *');
    let maxButtonWidth = 0;

    // flex의 영향을 임시로 배제하고 실제 width 측정
    buttons.forEach(button => {
    const originalWidth = button.style.width;
    button.style.width = 'auto'; // 고정 폭 제거
    button.style.flex = 'none';  // flex 규칙 무시
    const buttonWidth = button.offsetWidth;
    if (buttonWidth > maxButtonWidth) {
        maxButtonWidth = buttonWidth;
    }
    button.style.width = originalWidth; // 원래 flex 상태로 복구
    });

    // 동일 너비 적용
    buttons.forEach(button => {
    button.style.width = `${maxButtonWidth}px`;
    });
}

document.addEventListener('DOMContentLoaded', adjustButtonWidth);
window.addEventListener('resize', adjustButtonWidth); // 반응형 대응

function adjustLabelWidth() {
    const labels = document.querySelectorAll('.item-label');
    let maxLabelWidth = 0;

    // flex의 영향을 임시로 배제하고 실제 width 측정
    labels.forEach(label => {
    const originalWidth = label.style.width;
    label.style.width = 'auto'; // 고정 폭 제거
    label.style.flex = 'none';  // flex 규칙 무시
    const labelWidth = label.offsetWidth;
    if (labelWidth > maxLabelWidth) {
        maxLabelWidth = labelWidth;
    }
    label.style.width = originalWidth; // 원래 flex 상태로 복구
    });

    // 동일 너비 적용
    labels.forEach(label => {
    label.style.width = `${maxLabelWidth}px`;
    });
}

document.addEventListener('DOMContentLoaded', adjustLabelWidth);
window.addEventListener('resize', adjustLabelWidth); // 반응형 대응