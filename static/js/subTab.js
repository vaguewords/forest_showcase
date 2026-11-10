$(function(){
    // 탭 초기화
    if($('.select_tab').length > 0){
        initTabs();
    }
});

// -----------------------------
// 1. 서브 탭 메뉴 초기화
// -----------------------------
function initTabs(){
    var $tab = $('.select_tab');

    // 리사이즈 이벤트
    $(window).resize(function() {
        clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function() {
            $(window).trigger('resizeEnd');
        },100);
    }).resize();

    $(window).on('resizeEnd', function() {
        $tab.each(function(){
            if($(window).width() < 1025){
                $(this).addClass('mobileTab');
            } else{
                $(this).removeClass('mobileTab').find('> ul').removeAttr('style');
            }
        });
    });

    // 모바일 selectedTab 생성
    $tab.each(function(){
        var $link = $(this).find('> ul > li.on > a');
        var $selectedTab = $('<a>').text($link.addClass('selected').text()).prop("id","selectedTab");
        $(this).find('> ul').before($selectedTab);
    });

// 모바일 selectedTab 클릭
$(document).on('click', '#selectedTab', function(e){
    e.preventDefault();

    var $tab = $(this);
    var $tabBox = $tab.next('ul');

    $tabBox.slideToggle(200, function(){
        if ($tabBox.is(':visible')) {
            $tab.addClass('on');
        } else {
            $tab.removeClass('on');
        }
    });
});

    // 탭 클릭 이벤트 (모바일 + 높이 동기화)
    $(".select_tab ul li a").on('click', function(e){
        var $thisTab = $(this);

        if($(window).width() < 1025){
            $('#selectedTab')
                .text($thisTab.text())
                .removeClass('on');   // 👈 on 제거

            $('.mobileTab > ul').slideUp();
        }
    });
}
