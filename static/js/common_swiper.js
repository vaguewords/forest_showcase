document.addEventListener("DOMContentLoaded", function () {

  const defaultOptions = {
    keyboard: { enabled: true, onlyInViewport: true, pageUpDown: true },
    a11y: {
      enabled: true,
      prevSlideMessage: '이전 슬라이드로 이동',
      nextSlideMessage: '다음 슬라이드로 이동',
      containerMessage: '슬라이드 영역',
      slideRole: 'group',
    },
    roundLengths: true,
  };

  /* ---------------------------------------
   * 1️⃣ 갤러리 그룹 수집
   * -------------------------------------*/
  const galleryMap = {};

  document.querySelectorAll('[data-gallery]').forEach(wrapper => {

    const id = wrapper.dataset.gallery;
    const mainEl = wrapper.querySelector('.gallery-main');
    const thumbsEl = wrapper.querySelector('.gallery-thumbs');

    if (!mainEl || !thumbsEl) return;

    const slideCount = mainEl.querySelectorAll('.swiper-slide').length;
    const isVertical = thumbsEl.classList.contains('thumbs-vertical');

    galleryMap[id] = {
      mainEl,
      thumbsEl,
      slideCount,
      isVertical,
      thumbsSwiper: null,
    };
  });

  /* ---------------------------------------
   * 2️⃣ thumbs Swiper 먼저 생성
   * -------------------------------------*/
// ==========================
// thumbsSwiper 초기화 (버튼 포함)
// ==========================
Object.keys(galleryMap).forEach(id => {

  const group = galleryMap[id];
  const { thumbsEl, slideCount, isVertical } = group;

  // slidesPerView 기본값
  let thumbsSlidesPerView = 5;

  // split-* 클래스 체크
  const splitClass = Array.from(thumbsEl.classList).find(cls => cls.startsWith('split-'));
  if (splitClass) {
    const parsed = parseInt(splitClass.replace('split-', ''), 10);
    if (!isNaN(parsed)) thumbsSlidesPerView = parsed;
  }

  // 버튼 영역
  const thumbsButtonArea = thumbsEl.querySelector('.common-swiper-button-area');
  const thumbsPrev = thumbsButtonArea ? thumbsButtonArea.querySelector('.prev') : null;
  const thumbsNext = thumbsButtonArea ? thumbsButtonArea.querySelector('.next') : null;

  // thumbsSwiper 생성
  group.thumbsSwiper = new Swiper(thumbsEl, {
    direction: isVertical ? 'vertical' : 'horizontal',

    breakpoints: {
      0: { direction: 'horizontal' },
      769: { direction: isVertical ? 'vertical' : 'horizontal' }
    },

    slidesPerView: Math.min(thumbsSlidesPerView, slideCount),
    spaceBetween: 8,

    watchSlidesProgress: true,
    watchSlidesVisibility: true,

    freeMode: true,
    watchOverflow: true,
    loop: false,

    navigation: (thumbsPrev && thumbsNext) ? {
      prevEl: thumbsPrev,
      nextEl: thumbsNext
    } : false,

    slidesPerGroup: 1,

    on: {
      init(swiper) {
        swiper.slides.forEach((slide, index) => {
          slide.setAttribute('tabindex', '0');

          slide.addEventListener('focus', () => {
            const mainSwiper = swiper.el
              .closest('[data-gallery]')
              .querySelector('.gallery-main').swiper;

            if (mainSwiper) {
              mainSwiper.slideToLoop
                ? mainSwiper.slideToLoop(index)
                : mainSwiper.slideTo(index);
            }
          });
        });
      }
    }
  });
});


  /* ---------------------------------------
   * 3️⃣ 모든 common-swiper 초기화
   * -------------------------------------*/
  document.querySelectorAll('.common-swiper').forEach(container => {

    /* thumbs 전용은 여기서 제외 */
    if (container.classList.contains('gallery-thumbs')) return;

    /* slidesPerView 설정 */
    let slidesPerView = parseInt(container.dataset.slidesPerView, 10);

    if (!slidesPerView) {
      const splitClass = Array.from(container.classList)
        .find(cls => cls.startsWith('split-'));

      if (splitClass) {
        const parsed = parseInt(splitClass.replace('split-', ''), 10);
        slidesPerView = !isNaN(parsed) ? parsed : 1;
      } else {
        slidesPerView = 1;
      }
    }

    const slideCount = container.querySelectorAll('.swiper-slide').length;

    /* autoplay 안전 처리 */
    let autoplay = false;
    if (container.classList.contains('autoplay-true') && slideCount > 1) {
      autoplay = { delay: 3000, disableOnInteraction: false };
    }

    /* loop 안전 처리 */
    let loop = container.classList.contains('loop-true');
    if (slideCount <= 1) {
      loop = false;
    }

    const crossfade = container.classList.contains('crossfade-true');
    const effect = container.dataset.swiperEffect || 'slide';

    const breakpoints = {
      0: { slidesPerView: 1, spaceBetween: 10 },
      640: { slidesPerView: Math.min(slidesPerView, 2), spaceBetween: 10 },
      1024: { slidesPerView: slidesPerView, spaceBetween: 15 },
    };

    const paginationEl = container.querySelector('.swiper-pagination');
    const buttonArea = container.querySelector('.common-swiper-button-area');

    let paginationType = 'fraction';
    if (container.classList.contains('pagination-bullets')) paginationType = 'bullets';
    if (container.classList.contains('pagination-progress')) paginationType = 'progressbar';
    if (container.classList.contains('pagination-none')) paginationType = null;

    /* ---------------------------------------
     * thumbs 연결
     * -------------------------------------*/
    let thumbsOption = undefined;

    const galleryWrapper = container.closest('[data-gallery]');
    if (galleryWrapper) {

      const id = galleryWrapper.dataset.gallery;
      const group = galleryMap[id];

      if (group && group.slideCount > 1) {
        thumbsOption = { swiper: group.thumbsSwiper };
      }
    }

    /* ---------------------------------------
     * Swiper 생성
     * -------------------------------------*/
    const swiper = new Swiper(container, {
      ...defaultOptions,
      slidesPerView,
      slidesPerGroup: 1,
      spaceBetween: 15,
      breakpoints,
      autoplay,
      loop,
      effect,
      fadeEffect: { crossFade: crossfade },
      //thumbs: thumbsOption,

      pagination: paginationType
        ? { el: paginationEl, type: paginationType, clickable: true }
        : false,

      navigation: buttonArea
        ? {
            nextEl: buttonArea.querySelector('.next'),
            prevEl: buttonArea.querySelector('.prev'),
          }
        : false,
    });

    /* ✅ loop + thumbs 동기화 보정 */
    if (thumbsOption) {
      const thumbsSwiper = thumbsOption.swiper;

      // 👉 메인 → 썸네일
      swiper.on('slideChange', () => {
        const i = swiper.realIndex;

        thumbsSwiper.slideTo(i, 300);

        // 항상 1칸 단위 이동 보장
        thumbsSwiper.updateSlidesClasses();
      });

      // 👉 썸네일 → 메인 (클릭 + focus 둘 다 대응)
      thumbsSwiper.slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
          swiper.slideToLoop
            ? swiper.slideToLoop(index)
            : swiper.slideTo(index);
        });

        slide.addEventListener('focus', () => {
          swiper.slideToLoop
            ? swiper.slideToLoop(index)
            : swiper.slideTo(index);
        });
      });
    }

    /* ✅ Lazy background */
    const applyBg = slide => {
      if (slide && slide.dataset.bg) {
        slide.style.backgroundImage = `url(${slide.dataset.bg})`;
        slide.removeAttribute('data-bg');
      }
    };

    applyBg(swiper.slides[swiper.activeIndex]);

    swiper.on('slideChangeTransitionStart', () => {
      applyBg(swiper.slides[swiper.activeIndex]);
      applyBg(swiper.slides[swiper.activeIndex + 1]);
    });


    /* ---------------------------------------
     * autoplay 버튼
     * -------------------------------------*/
    const playBtn = buttonArea.querySelector('.play');
    const stopBtn = buttonArea.querySelector('.stop');

    if (buttonArea) {
      const playBtn = buttonArea.querySelector('.play');
      const stopBtn = buttonArea.querySelector('.stop');

      if (playBtn && stopBtn && swiper.autoplay) {

        const updateAutoplayButtons = () => {
          if (swiper.autoplay.running) {
            playBtn.style.display = 'none';
            stopBtn.style.display = 'inline-block';
          } else {
            playBtn.style.display = 'inline-block';
            stopBtn.style.display = 'none';
          }
        };

        // 🔥 최초 상태 동기화
        updateAutoplayButtons();

        stopBtn.addEventListener('click', () => {
          swiper.autoplay.stop();
          updateAutoplayButtons();
        });

        playBtn.addEventListener('click', () => {
          swiper.autoplay.start();
          updateAutoplayButtons();
        });

        // 🔥 autoplay 내부 상태 변경 감지
        swiper.on('autoplayStart', updateAutoplayButtons);
        swiper.on('autoplayStop', updateAutoplayButtons);
      }
    }


    swiper.update();
  });
});
