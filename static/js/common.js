// 1. 스크롤 초기화
$(document).on('click', '.btn-scroll', function() {
	$('html, body').animate({scrollTop:0}, 500);
});
$(document).on('scroll', window, function(){
	if ($(window).scrollTop()>100) {
		$('.btn-scroll').css({'display':'block'});
	}else{
		$('.btn-scroll').css({'display':'none'});
	}
	if($(window).scrollTop() >= ($(document).height() - $(".family-site-area").height() - $(window).height() - 50)){
		$(".btn-scroll").addClass("end");
		$('.btn-scroll').css({
			bottom: $(".family-site-area").height() - 47,
		});
	}else{
		$(".btn-scroll").removeClass("end");
		$(".btn-scroll").css({
			bottom: "65px",
		});
	}
});

// 2. 좋아요
/**
document.querySelectorAll('.btn-like').forEach(button => {
  button.addEventListener('click', () => {
    const icon = button.querySelector('.fa-heart');
    const countEl = button.querySelector('.like-count');

    const isPressed = button.getAttribute('aria-pressed') === 'true';
    const currentCount = parseInt(countEl.textContent, 10);

    // 상태 반전
    button.setAttribute('aria-pressed', !isPressed);

    // 아이콘 변경
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');

    // 숫자 증감
    countEl.textContent = isPressed
      ? currentCount - 1   // 이미 눌린 상태 → 취소 → 감소
      : currentCount + 1;  // 안 눌린 상태 → 좋아요 → 증가

countEl.textContent = newCount;
button.setAttribute('aria-label', `좋아요 ${newCount}개`);

  });
});
 */

// 3. 스크랩

document.querySelectorAll('.scrap').forEach(button => {
	button.addEventListener('click', (e) => {
	  e.preventDefault();
	  button.classList.toggle('active');
	  button.setAttribute('aria-pressed', button.classList.contains('active'));
	});
  });

// 4. 접근성 20260428
$(document).ready(function() {
	$("#calendar .fc-scrollgrid-sync-table").each(function() {
		if ($(this).find("caption").length === 0) {
			$(this).prepend("<caption>예약일자 선택 달력으로 예약가능한 날짜의 정보를 제공합니다.</caption>");
		}
	});
});