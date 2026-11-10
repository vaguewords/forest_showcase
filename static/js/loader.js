        // 페이지 로딩이 끝나면 로딩 화면 숨기기
        window.onload = function() {
            // 로딩 애니메이션 숨기기
            const loadingOverlay = document.getElementById('loading');
            loadingOverlay.style.display = 'none';

            // 실제 콘텐츠 표시
            const content = document.getElementById('content');
            content.style.display = 'block';
        };