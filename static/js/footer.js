// document.addEventListener('DOMContentLoaded', function () {
//   const goBtn = document.getElementById('goBtn');
//   const select = document.getElementById('citySiteLink');

//   if (!goBtn || !select) return;

//   goBtn.addEventListener('click', function () {
//     const uri = select.value;
//     if (uri) window.open(uri, '_blank', 'noopener');
//   });
// });


// document.getElementById('citySiteLink').addEventListener('change', function(e) {
//   if (e.target.value === '') {
//     this.selectedIndex = 0; // 선택 막기
//   }
// });



$(document).on('click', '#goBtn', function() {
    const uri = $('#citySiteLink').val();
    if (uri) window.open(uri, '_blank', 'noopener');
});

// footer banner swiper
var swiper = new Swiper(".family-site-swiper", {
    loop: false,
  keyboard: {
  enabled: true,
  onlyInViewport: false,
  },
  a11y: {
    enabled: true,  // 접근성 활성화
    prevSlideMessage: '이전 슬라이드로 이동',  // 이전 슬라이드로 이동할 때 메시지
    nextSlideMessage: '다음 슬라이드로 이동',  // 다음 슬라이드로 이동할 때 메시지
  },
  on: {
    slideChangeTransitionEnd: function () {
      // 자동 루프가 실행 중인 상태에서는 포커스 이동하지 않도록 함
      if (!swiper.autoplay.running) {
        // 슬라이드를 수동으로 탐색한 경우만 포커스를 이동시킴
        if (swiper.isEnd) {
          // 마지막 슬라이드에서 포커스 이동
          setTimeout(function() {
            document.querySelector('#citySiteLink').focus();
          }, 100);  // 포커스 이동을 지연시켜서 전환 끝난 후에 적용
        }
      }
    },
  },
  autoplay: false,
  // {
  // delay: 2000,
  // disableOnInteraction: false,
  // },
  breakpoints: {
  480: {slidesPerView: 2,},
  640: {slidesPerView: 3,},
  992: {slidesPerView: 4,},
  },
  spaceBetween: 15,
  navigation: {
  nextEl: ".swiper-button.next",
  prevEl: ".swiper-button.prev",
  },
});

document.querySelector('.swiper-button.stop').setAttribute('tabindex', '0');
document.querySelector('.swiper-button.play').setAttribute('tabindex', '0');

// Stop 버튼 클릭 시 자동 슬라이드 일시정지
document.querySelector('.swiper-button.stop').addEventListener('click', function () {
swiper.autoplay.stop(); // autoplay 멈추기
document.querySelector('.swiper-button.play').style.display = 'inline-block'; // Play 버튼 보이기
document.querySelector('.swiper-button.stop').style.display = 'none'; // Stop 버튼 숨기기
});

// Play 버튼 클릭 시 자동 슬라이드 재시작
document.querySelector('.swiper-button.play').addEventListener('click', function () {
swiper.autoplay.start(); // autoplay 재시작
document.querySelector('.swiper-button.play').style.display = 'none'; // Play 버튼 숨기기
document.querySelector('.swiper-button.stop').style.display = 'inline-block'; // Stop 버튼 보이기
});

// 처음에는 Stop 버튼만 보이도록 설정
// document.querySelector('.swiper-button.play').style.display = 'none';
// document.querySelector('.swiper-button.stop').style.display = 'inline-block';
document.querySelector('.swiper-button.play').style.display = 'inline-blocknone';
document.querySelector('.swiper-button.stop').style.display = 'none';
