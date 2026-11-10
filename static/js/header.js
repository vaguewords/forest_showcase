$(function () {

    /* ==========================================================
       공통: Focus Trap 유틸 함수
    ========================================================== */

    function trapFocus(container) {
      const focusable = container.find('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
      const first = focusable.first();
      const last = focusable.last();

      container.on("keydown.focusTrap", function(e) {
        if (e.key !== "Tab") return;

        // Shift + Tab
        if (e.shiftKey) {
          if (document.activeElement === first[0]) {
            e.preventDefault();
            last.focus();
          }
        }
        // Tab
        else {
          if (document.activeElement === last[0]) {
            e.preventDefault();
            first.focus();
          }
        }
      });
    }

    function releaseFocus(container) {
      container.off("keydown.focusTrap");
    }



   /* ==========================================================
     PC LNB — 유사 메가메뉴 구조
  ========================================================== */

  const $pcLnb = $(".lnb-list");
  const $pcBg = $(".bg-lnb");
  const $allSub = $(".lnb-list .sub-list");
  const $all1depth = $(".lnb-list > li > .lnb-trigger");


  // 공통 닫기
  function closePCMenu() {
    $pcLnb.removeClass("on");
    $pcBg.hide().height(0); // 높이 초기화
    $allSub.hide().attr("aria-hidden", "true").height('');
    $all1depth.attr("aria-expanded", "false");
  }

  function equalizeSubMenuHeight() {
    let maxHeight = 0;
    let $allSubLists = $(".sub-list");

    // 먼저 모든 서브메뉴 중 최대 높이 찾기
    $allSubLists.each(function() {
      let $this = $(this);
      let isHidden = $this.is(":hidden");

      if (isHidden) {
        // 숨겨진 메뉴라도 높이를 계산하기 위해 잠시 보여줌
        $this.css({ position: "absolute", visibility: "hidden", display: "block" });
      }

      let thisHeight = $this.outerHeight(true);
      if (thisHeight > maxHeight) maxHeight = thisHeight;

      if (isHidden) {
        // 원래 상태로 되돌리기
        $this.css({ position: "", visibility: "", display: "" });
      }
    });

    // 모든 서브메뉴에 최대 높이 적용
    $allSubLists.height(maxHeight);
  }


  function updateBgHeight() {
    let maxHeight = 0;

    $allSub.each(function () {
      let $this = $(this);
      let isHidden = $this.is(":hidden");

      // hidden이면 잠시 보여서 높이 측정
      if (isHidden) {
        $this.css({ position: "absolute", visibility: "hidden", display: "block" });
      }

      let thisHeight = $this.outerHeight(true); // padding, margin 포함
      if (thisHeight > maxHeight) maxHeight = thisHeight;

      if (isHidden) {
        $this.css({ position: "", visibility: "", display: "" });
      }
    });

    $pcBg.height(maxHeight + 20);
  }

  // PC: Hover (모든 서브메뉴 동시에 열림)
  $(".lnb-list > li").mouseenter(function () {

    $pcLnb.addClass("on");

    // 활성화된 메뉴만 true
    $all1depth.attr("aria-expanded", "true");
    $(this).children("a").attr("aria-expanded", "true");

    // 모든 서브메뉴를 동시에 연다 (유사 메가메뉴)
    $allSub.show().attr("aria-hidden", "false");
    equalizeSubMenuHeight();
    updateBgHeight(); // ★ 추가
    $pcBg.show();
  });

  // PC: mouseleave
  $(".lnb-list > li").mouseleave(function () {
    closePCMenu();
  });

  // PC: Focus In (키보드 접근성, 모든 메뉴 열림)
  $(".lnb-list > li").focusin(function () {

    $pcLnb.addClass("on");

    // 활성화된 메뉴만 aria-expanded
    $all1depth.attr("aria-expanded", "true");
    $(this).children("a").attr("aria-expanded", "true");

    // 모든 서브메뉴 열기
    $allSub.show().attr("aria-hidden", "false");
    updateBgHeight(); // ★ 추가
    $pcBg.show();
  });

  // PC: 마지막 메뉴 focus out시 닫기
  $(".lnb-list > li:last-child .sub-list li:last-child > a").focusout(function () {
    closePCMenu();
  });

  // PC: 외부 클릭 닫기
  $(document).mouseup(function (e) {
    if ($pcLnb.has(e.target).length === 0 && !$pcLnb.is(e.target)) {
      closePCMenu();
    }
  });

  // PC: ESC 닫기
  $(document).keydown(function (e) {
    if (e.key === "Escape") {
      closePCMenu();
    }
  });



    /* ==========================================================
       모바일 LNB
    ========================================================== */

    const $mobileZone = $(".mobile-lnb-zone");
    const $mobileModal = $(".mobile-modal");

    function closeMobileMenu() {
      $mobileModal.fadeOut(150);
      $mobileZone.animate({ left: "-100%" }, 200);

      $("html").removeClass("openGnb");
      $mobileZone.attr("inert", "");

      $btnMobile.attr("aria-expanded", "false");
      $mobileMenu.attr("aria-hidden", "true");

      // ❗ 초기화 제거 → 상태 유지됨
    }

    const $btnMobile = $(".hamburger-button");
    const $mobileMenu = $("#mobile-lnb");

    function openMobileMenu() {
      $mobileModal.fadeIn(150);
      $mobileZone.animate({ left: 0 }, 200);

      $("html").addClass("openGnb");
      $mobileZone.removeAttr("inert");

      $btnMobile.attr("aria-expanded", "true");
      $mobileMenu.attr("aria-hidden", "false");

      trapFocus($mobileZone);

      // 👉 혹시 DOM 변경 대비 재적용
      if (window.applyMobileActive) {
        window.applyMobileActive();
      }
    }

    // 열기
    $(".btn-lnb").click(function () {
      openMobileMenu();
    });

    // 닫기 버튼
    $(".mobile-lnb-close").click(function () {
      closeMobileMenu();
    });

    // 외부 클릭 닫기
    $(document).click(function (e) {
      if (!$(e.target).closest(".mobile-lnb-zone").length &&
          !$(e.target).closest(".btn-lnb").length) {
        closeMobileMenu();
      }
    });

    // ESC 닫기
    $(document).keydown(function (e) {
      if (e.key === "Escape") {
        closeMobileMenu();
      }
    });

    // Depth 메뉴 토글
  // 모바일 LNB Depth 메뉴 통합 토글
  $(function () {

    // Depth2 토글
    $(".mobile-lnb-list > li .trigger").click(function (e) {
      const $li = $(this).parent();
      const $depth2 = $li.find(".depth2").first();

      if ($li.hasClass("on")) {
        // 닫기
        $li.removeClass("on");
        $depth2.slideUp(150).attr("aria-hidden", "true");
        $(this).attr("aria-expanded", "false");
        // 포함된 depth3 닫기
        $depth2.find(".depth3").slideUp(150).attr("aria-hidden", "true").parent().removeClass("on");
        $depth2.find(".depth3").siblings("a").attr("aria-expanded", "false");
      } else {
        // 다른 depth2 닫기
        $(".mobile-lnb-list > li.on")
          .removeClass("on")
          .find(".depth2").slideUp(150).attr("aria-hidden", "true")
          .find(".depth3").slideUp(150).attr("aria-hidden", "true").parent().removeClass("on");
        $(".mobile-lnb-list > li.on").find(".depth3").siblings("a").attr("aria-expanded", "false");

        // 열기
        $li.addClass("on");
        $depth2.slideDown(150).attr("aria-hidden", "false");
        $(this).attr("aria-expanded", "true");
      }
    });

    // Depth3 토글
    $(".mobile-lnb-list ul.depth2 li > a, .mobile-lnb-list ul.depth2 li > button").click(function (e) {
      const $depth3 = $(this).siblings(".depth3");
      if ($depth3.length === 0) return; // depth3가 없으면 종료

      e.preventDefault(); // 링크 이동 방지

      if ($depth3.is(":visible")) {
        $depth3.slideUp(150).attr("aria-hidden", "true");
        $(this).attr("aria-expanded", "false");
        $(this).parent().removeClass("on");
      } else {
        // 같은 depth2 내 다른 depth3 닫기
        $(this).closest("ul.depth2").find(".depth3:visible").slideUp(150).attr("aria-hidden", "true").parent().removeClass("on");
        $(this).closest("ul.depth2").find(".depth3").siblings("a, button").attr("aria-expanded", "false");

        $depth3.slideDown(150).attr("aria-hidden", "false");
        $(this).attr("aria-expanded", "true");
        $(this).parent().addClass("on");
      }
    });

  });




    /* ==========================================================
       검색창 placeholder 반응형
    ========================================================== */
    function updatePlaceholder() {
      const input = document.getElementById("search-input");

      if (!input) return;

      input.placeholder =
        window.innerWidth <= 340 ? "검색어 입력" : "검색어를 입력해주세요.";
    }

    updatePlaceholder();
    window.addEventListener("resize", updatePlaceholder);

  });
  (function () {
    const currentPath = window.location.pathname.split("/").pop();

    if (!currentPath) return;

    const $allLinks = $("nav a[href]");

    let $currentLink = $();

    // 1. 정확히 일치하는 링크 찾기
    $allLinks.each(function () {
      const href = $(this).attr("href");

      if (!href) return;

      const file = href.split("/").pop();

      if (file === currentPath) {
        $currentLink = $(this);
        return false; // break
      }
    });

    if (!$currentLink.length) {
      console.log("❌ URL 매칭 실패:", currentPath);
      return;
    }

    console.log("✅ URL 매칭:", currentPath);


    /* =========================
       현재 메뉴 active
    ========================= */
    $currentLink.addClass("is-current");
    $currentLink.closest("li").addClass("is-current");

    /* =========================
       PC 처리
    ========================= */
    const $pcSub = $currentLink.closest(".sub-list");

    if ($pcSub.length) {
      const $pcLi = $pcSub.closest("li");
      const $pcBtn = $pcLi.children(".lnb-trigger");

      $pcLi.addClass("is-current");
      $pcBtn.addClass("is-current");
    }

    /* =========================
       모바일 처리
    ========================= */
    const $depth3 = $currentLink.closest(".depth3");

    if ($depth3.length) {
      const $depth2Li = $depth3.parent();
      const $depth2 = $depth2Li.closest(".depth2");
      const $depth1Li = $depth2.closest("li");

      // depth3
      $depth3.show().attr("aria-hidden", "false");
      $depth2Li.addClass("on");
      $depth2Li.children("button, a").attr("aria-expanded", "true");

      // depth2
      $depth2.show().attr("aria-hidden", "false");
      $depth1Li.addClass("on");
      $depth1Li.children(".trigger").attr("aria-expanded", "true");

    } else {
      // depth2만 있는 경우
      const $depth2 = $currentLink.closest(".depth2");

      if ($depth2.length) {
        const $depth1Li = $depth2.closest("li");

        $depth2.show().attr("aria-hidden", "false");
        $depth1Li.addClass("on");
        $depth1Li.children(".trigger").attr("aria-expanded", "true");
      }
    }

  })();
