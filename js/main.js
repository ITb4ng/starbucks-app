// badge 컨트롤 gsap
const badgeEl = document.querySelector('aside .badges');

if (badgeEl && typeof gsap !== 'undefined' && typeof _ !== 'undefined') {
  window.addEventListener('scroll', _.throttle(function () {
    if (window.scrollY > 500) {
      gsap.to(badgeEl, 0.6, {
        opacity: 0,
        display: 'none'
      });
    } else {
      gsap.to(badgeEl, 0.6, {
        opacity: 1,
        display: 'block'
      });
    }
  }, 300));
}

/** Hero fade sequence **/
const heroFadeMediaQuery = window.matchMedia('(max-width: 950px)');
const heroFadeEls = Array.from(document.querySelectorAll('.visual [data-hero-fade]'));

function getHeroFadeOrder(fadeEl) {
  const orderValue = heroFadeMediaQuery.matches
    ? fadeEl.dataset.fadeMobileOrder
    : fadeEl.dataset.fadeDesktopOrder;

  return Number(orderValue || 999);
}

function isHeroFadeVisible(fadeEl) {
  const fadeElStyle = window.getComputedStyle(fadeEl);
  return fadeElStyle.display !== 'none'
    && fadeElStyle.visibility !== 'hidden'
    && fadeEl.getClientRects().length > 0;
}

function runHeroFadeSequence() {
  if (!heroFadeEls.length) {
    return;
  }

  gsap.killTweensOf(heroFadeEls);

  heroFadeEls.forEach(function (fadeEl) {
    gsap.set(fadeEl, {
      opacity: isHeroFadeVisible(fadeEl) ? 0 : 1
    });
  });

  heroFadeEls
    .filter(isHeroFadeVisible)
    .sort(function (prevEl, nextEl) {
      return getHeroFadeOrder(prevEl) - getHeroFadeOrder(nextEl);
    })
    .forEach(function (fadeEl, index) {
      gsap.to(fadeEl, 0.82, {
        delay: 0.16 + (index * 0.18),
        opacity: 1,
        ease: 'power2.out'
      });
    });
}

runHeroFadeSequence();

if (heroFadeMediaQuery.addEventListener) {
  heroFadeMediaQuery.addEventListener('change', runHeroFadeSequence);
} else if (heroFadeMediaQuery.addListener) {
  heroFadeMediaQuery.addListener(runHeroFadeSequence);
}

/** Hero / order choice CTA **/
const visualCampaignLinkEl = document.querySelector('.visual .btn_slogan a');
const orderChoiceEl = document.querySelector('#order_choice_layer');
const orderChoicePanelEl = orderChoiceEl ? orderChoiceEl.querySelector('.order-choice__panel') : null;
const orderChoiceCloseEls = orderChoiceEl ? orderChoiceEl.querySelectorAll('[data-order-close]') : [];
const orderChoiceActionEls = orderChoiceEl ? orderChoiceEl.querySelectorAll('.order-choice__button') : [];
const orderChoiceTriggerEls = document.querySelectorAll('[data-order-trigger]');
const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

let lastOrderTriggerEl = null;
let lockedScrollTop = 0;

if (visualCampaignLinkEl) {
  visualCampaignLinkEl.href = 'https://www.starbucks.co.kr/whats_new/campaign_view.do?pro_seq=3296';
  visualCampaignLinkEl.target = '_blank';
  visualCampaignLinkEl.rel = 'noopener noreferrer';
  visualCampaignLinkEl.textContent = '시즌 프로모션 보기';
  visualCampaignLinkEl.setAttribute('aria-label', '시즌 프로모션 페이지를 새 탭에서 열기');
}

function lockOrderChoiceScroll() {
  lockedScrollTop = window.scrollY;
  document.body.classList.add('order-choice-open');
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + lockedScrollTop + 'px';
  document.body.style.left = '0';
  document.body.style.width = '100%';
}

function unlockOrderChoiceScroll() {
  const documentElementStyle = document.documentElement.style;
  const prevScrollBehavior = documentElementStyle.scrollBehavior;

  documentElementStyle.scrollBehavior = 'auto';
  document.body.classList.remove('order-choice-open');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.width = '';
  window.scrollTo(0, lockedScrollTop);

  window.requestAnimationFrame(function () {
    documentElementStyle.scrollBehavior = prevScrollBehavior;
  });
}

function getOrderChoiceFocusableEls() {
  if (!orderChoicePanelEl) {
    return [];
  }

  return Array.from(orderChoicePanelEl.querySelectorAll(focusableSelector)).filter(function (el) {
    return !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true';
  });
}

function openOrderChoice(triggerEl) {
  if (!orderChoiceEl || !orderChoicePanelEl) {
    return;
  }

  lastOrderTriggerEl = triggerEl || null;
  orderChoiceEl.classList.add('is-open');
  orderChoiceEl.setAttribute('aria-hidden', 'false');
  lockOrderChoiceScroll();

  if (triggerEl) {
    triggerEl.setAttribute('aria-expanded', 'true');
  }

  window.requestAnimationFrame(function () {
    const focusTarget = orderChoicePanelEl.querySelector('.order-choice__close') || orderChoicePanelEl;
    focusTarget.focus();
  });
}

function closeOrderChoice() {
  if (!orderChoiceEl || !orderChoicePanelEl) {
    return;
  }

  orderChoiceEl.classList.remove('is-open');
  orderChoiceEl.setAttribute('aria-hidden', 'true');
  unlockOrderChoiceScroll();

  if (lastOrderTriggerEl) {
    lastOrderTriggerEl.setAttribute('aria-expanded', 'false');
    lastOrderTriggerEl.focus();
    lastOrderTriggerEl = null;
  }
}

function handleOrderChoiceKeydown(event) {
  if (!orderChoiceEl || !orderChoiceEl.classList.contains('is-open')) {
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    closeOrderChoice();
    return;
  }

  if (event.key !== 'Tab') {
    return;
  }

  const focusableEls = getOrderChoiceFocusableEls();
  if (!focusableEls.length) {
    return;
  }

  const firstEl = focusableEls[0];
  const lastEl = focusableEls[focusableEls.length - 1];

  if (event.shiftKey && document.activeElement === firstEl) {
    event.preventDefault();
    lastEl.focus();
  } else if (!event.shiftKey && document.activeElement === lastEl) {
    event.preventDefault();
    firstEl.focus();
  }
}

if (orderChoiceEl && orderChoicePanelEl && orderChoiceTriggerEls.length) {
  orderChoiceTriggerEls.forEach(function (triggerEl) {
    triggerEl.setAttribute('aria-expanded', 'false');

    triggerEl.addEventListener('click', function (event) {
      event.preventDefault();
      openOrderChoice(triggerEl);
    });
  });

  orderChoiceCloseEls.forEach(function (closeEl) {
    closeEl.addEventListener('click', closeOrderChoice);
  });

  orderChoiceActionEls.forEach(function (actionEl) {
    actionEl.addEventListener('click', function () {
      closeOrderChoice();
    });
  });

  document.addEventListener('keydown', handleOrderChoiceKeydown);
}

// promotion Swiper 공지사항
/** What's New Swiper **/
const whatsNewSectionEl = document.querySelector('.whats-new');
const whatsNewPaginationEl = whatsNewSectionEl ? whatsNewSectionEl.querySelector('.whats-new__pagination') : null;
const whatsNewSlideEls = whatsNewSectionEl ? whatsNewSectionEl.querySelectorAll('.whats-new__swiper .whats-new__slide') : [];

function getWhatsNewTotalSlides(swiper) {
  if (whatsNewSectionEl) {
    const originalSlideEls = whatsNewSectionEl.querySelectorAll('.whats-new__swiper .whats-new__slide:not(.swiper-slide-duplicate)');
    if (originalSlideEls.length) {
      return originalSlideEls.length;
    }
  }

  if (whatsNewSlideEls.length) {
    return whatsNewSlideEls.length;
  }

  return swiper && swiper.slides ? swiper.slides.length : 0;
}

function updateWhatsNewPagination(swiper) {
  if (!whatsNewPaginationEl) {
    return;
  }

  const totalSlides = getWhatsNewTotalSlides(swiper);
  const currentSlide = totalSlides
    ? ((swiper.realIndex % totalSlides) + totalSlides) % totalSlides + 1
    : 0;

  whatsNewPaginationEl.textContent = currentSlide + '/' + totalSlides;
}

if (whatsNewSectionEl && typeof Swiper !== 'undefined') {
  const whatsNewSwiper = new Swiper('.whats-new .swiper-container', {
    loop: true,
    slidesPerView: 'auto',
    spaceBetween: 16,
    centeredSlides: false,
    grabCursor: true,
    observer: true,
    observeParents: true,
    on: {
      init: function () {
        updateWhatsNewPagination(this);
      },
      slideChange: function () {
        updateWhatsNewPagination(this);
      }
    }
  });

  updateWhatsNewPagination(whatsNewSwiper);
}

if (document.querySelector('.notice-line .swiper-container') && typeof Swiper !== 'undefined') {
  new Swiper('.notice-line .swiper-container', {
    direction: 'vertical',
    autoplay: true,
    loop: true
  });
}

// promotion Swiper 시즌 프로모션 슬라이더
if (document.querySelector('.promotion .swiper-container') && typeof Swiper !== 'undefined') {
  new Swiper('.promotion .swiper-container', {
    autoplay: {
      delay: 3000,
      disableOnInteraction: true
    },
    loop: true,
    slidesPerView: 3,
    spaceBetween: 10,
    centeredSlides: true,
    pagination: {
      el: '.promotion .swiper-pagination',
      clickable: true,
      type: 'bullets'
    },
    navigation: {
      prevEl: '.promotion .swiper-prev',
      nextEl: '.promotion .swiper-next'
    }
  });
}

/** Promotion 슬라이드 토글 기능 **/
const noticeEl = document.querySelector('.notice');
const toggleMenuEl = noticeEl ? noticeEl.querySelector('.menu-toggler') : null;
const promotionEl = document.querySelector('.promotion');
const promotionToggleBtn = document.querySelector('.toggle-promotion');
let isHidePromotion = false;

if (promotionEl && promotionToggleBtn) {
  promotionToggleBtn.addEventListener('click', function () {
    isHidePromotion = !isHidePromotion;
    if (toggleMenuEl) {
      toggleMenuEl.setAttribute('aria-expanded', String(!isHidePromotion));
    }
    promotionEl.setAttribute('aria-hidden', String(isHidePromotion));
    if (isHidePromotion) {
      promotionEl.classList.remove('hide');
    } else {
      promotionEl.classList.add('hide');
    }
  });
}

if (noticeEl && toggleMenuEl) {
  toggleMenuEl.addEventListener('click', function () {
    if (noticeEl.classList.contains('menuing')) {
      hideNoticeProMenu();
    } else {
      showNoticeProMenu();
    }
  });
}

function showNoticeProMenu() {
  noticeEl.classList.add('menuing');
}

function hideNoticeProMenu() {
  noticeEl.classList.remove('menuing');
}

// event triggerHook
const spyEls = document.querySelectorAll('section.scroll-spy');
if (spyEls.length && typeof ScrollMagic !== 'undefined') {
  spyEls.forEach(function (spyEl) {
    new ScrollMagic.Scene({
      triggerElement: spyEl,
      triggerHook: 0.8
    })
      .setClassToggle(spyEl, 'show')
      .addTo(new ScrollMagic.Controller());
  });
}
