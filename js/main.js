  // <![CDATA[  <-- For SVG support
	if ('WebSocket' in window) {
		(function () {
			function refreshCSS() {
				var sheets = [].slice.call(document.getElementsByTagName("link"));
				var head = document.getElementsByTagName("head")[0];
				for (var i = 0; i < sheets.length; ++i) {
					var elem = sheets[i];
					var parent = elem.parentElement || head;
					parent.removeChild(elem);
					var rel = elem.rel;
					if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
						var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
						elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
					}
					parent.appendChild(elem);
				}
			}
			var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
			var address = protocol + window.location.host + window.location.pathname + '/ws';
			var socket = new WebSocket(address);
			socket.onmessage = function (msg) {
				if (msg.data == 'reload') window.location.reload();
				else if (msg.data == 'refreshcss') refreshCSS();
			};
			if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From')) {
				console.log('reload enabled.');
				sessionStorage.setItem('IsThisFirstTime_Log_From', true);
			}
		})();
	}
	else {
		console.error('Upgrade your browser. This Browser is NOT supported WebSocket');
	}
	// ]]>



// badge 컨트롤 gsap
const badgeEl = document.querySelector('aside .badges');

window.addEventListener('scroll', _.throttle(function () {
    
    if(window.scrollY > 500){
        gsap.to(badgeEl, .6, {
            opacity: 0,
            display: 'none'
        });
    }
    else {
        gsap.to(badgeEl, .6, {
            opacity: 1,
            display: 'block'
        });
    }  
}, 300));  

/** gsap 
 * library **/
const fadeEls = document.querySelectorAll('.visual .fade-in');
fadeEls.forEach(function (fadeEl, index) {
    gsap.to(fadeEl, 1, {
        delay: (index + 1) * .5,
        opacity: 1
    });
})
// promotion Swiper 공지사항
  new Swiper('.notice-line .swiper-container', { // 수직 공지사항 슬라이드
      direction: 'vertical', 
      autoplay: true, 
      loop: true 
    })
// promotion Swiper 시즌 프로모션 슬라이더
  new Swiper('.promotion .swiper-container', { // 수평 프로모션 슬라이드
    autoplay: { 
      delay: 3000,
      disableOnInteraction: true 
    /***모바일 스크롤스냅타입  false로 설정하면 스와이프 후 
     * 자동 재생이 비활성화 되지 않음 
     * true시 자동 재생 비활성화 **/
    },
    loop: true, 
    slidesPerView: 3, 
    spaceBetween: 10,
    centeredSlides: true, 
    pagination: { 
      el: '.promotion .swiper-pagination', 
      clickable: true,
      type:'bullets' 
    },
    navigation: { 
      prevEl: '.promotion .swiper-prev', 
      nextEl: '.promotion .swiper-next' 
    }
  })

  
  /** Promotion 슬라이드 토글 기능 **/
  const noticeEl = document.querySelector('.notice')
  const toggleMenuEl = noticeEl.querySelector('.menu-toggler')
  const promotionEl = document.querySelector('.promotion')
  const promotionToggleBtn = document.querySelector('.toggle-promotion')
  let isHidePromotion = false

  promotionToggleBtn.addEventListener('click', function () {
    isHidePromotion = !isHidePromotion // True
    if (isHidePromotion) {
      promotionEl.classList.remove('hide')
    } 
    else {
      promotionEl.classList.add('hide')
    }
  })
  
  // promotion 토글러 메뉴 가상 클래스 추가
  toggleMenuEl.addEventListener('click' , function() {
    if (noticeEl.classList.contains('menuing')){
      hideNoticeProMenu()
    }
    else {
      showNoticeProMenu()
    }
  })

  function showNoticeProMenu() {
    noticeEl.classList.add('menuing') // height 0;
  }
  function hideNoticeProMenu() {
    noticeEl.classList.remove('menuing') 
    /**display block; position 랠러티브 높이에 따라서 
     * 컨텐츠에 맞게 조정됨
     **/
  }

  // event triggerHook
  const spyEls = document.querySelectorAll('section.scroll-spy')
  spyEls.forEach(function (spyEl) {
    new ScrollMagic
      .Scene({ 
        triggerElement: spyEl,
        triggerHook: .8 // 화면의 80% 지점 
      })
      .setClassToggle(spyEl, 'show')
      .addTo(new ScrollMagic.Controller()) 
  })

