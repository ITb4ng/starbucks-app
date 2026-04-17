(function () {
const badgeEl = document.querySelector('aside .badges');
const pageHeaderEl = document.querySelector('header');
const pageMainEl = document.querySelector('main');
const skipLinksEl = document.querySelector('.skip-links');
const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isFocusableVisible(el) {
    if (!el) {
        return false;
    }

    const styles = window.getComputedStyle(el);
    return styles.display !== 'none'
        && styles.visibility !== 'hidden'
        && el.getClientRects().length > 0;
}

function getFocusableEls(containerEl) {
    if (!containerEl) {
        return [];
    }

    return Array.from(containerEl.querySelectorAll(focusableSelector)).filter(function (el) {
        return !el.hasAttribute('disabled') && !el.inert && isFocusableVisible(el);
    });
}

function focusElement(el) {
    if (!el) {
        return;
    }

    try {
        el.focus({ preventScroll: true });
    } catch (error) {
        el.focus();
    }
}

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

const heroFadeMediaQuery = window.matchMedia('(max-width: 950px)');
const reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const visualSectionEl = document.querySelector('.visual');
const heroFadeEls = Array.from(document.querySelectorAll('.visual [data-hero-fade]'));

const heroFadeStartDelay = 0.4;
const heroFadeStepDelay = 0.25;
const heroFadeDuration = 0.82;

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

function setHeroFadeFocusableState(fadeEl, isEnabled) {
    const focusableEls = fadeEl.querySelectorAll(focusableSelector);

    Array.from(focusableEls).forEach(function (focusableEl) {
        if (isEnabled) {
            if (focusableEl.hasAttribute('data-hero-tabindex')) {
                const previousTabIndex = focusableEl.getAttribute('data-hero-tabindex');

                if (previousTabIndex === '') {
                    focusableEl.removeAttribute('tabindex');
                } else {
                    focusableEl.setAttribute('tabindex', previousTabIndex);
                }

                focusableEl.removeAttribute('data-hero-tabindex');
            }

            return;
        }

        if (!focusableEl.hasAttribute('data-hero-tabindex')) {
            focusableEl.setAttribute('data-hero-tabindex', focusableEl.getAttribute('tabindex') || '');
        }

        focusableEl.setAttribute('tabindex', '-1');
    });
}

function resetHeroFadeState() {
    if (visualSectionEl) {
        visualSectionEl.classList.remove('is-hero-fade-ready');
    }

    heroFadeEls.forEach(function (fadeEl) {
        setHeroFadeFocusableState(fadeEl, true);
        if (typeof gsap !== 'undefined') {
            gsap.set(fadeEl, { opacity: 1 });
        } else {
            fadeEl.style.opacity = '1';
        }
    });
}

function runHeroFadeSequence() {
    if (!heroFadeEls.length) {
        return;
    }

    if (typeof gsap === 'undefined' || reducedMotionMediaQuery.matches) {
        resetHeroFadeState();
        return;
    }

    if (visualSectionEl) {
        visualSectionEl.classList.add('is-hero-fade-ready');
    }

    gsap.killTweensOf(heroFadeEls);

    heroFadeEls.forEach(function (fadeEl) {
        const isVisible = isHeroFadeVisible(fadeEl);
        setHeroFadeFocusableState(fadeEl, !isVisible);

        gsap.set(fadeEl, {
            opacity: isVisible ? 0 : 1
        });
    });

    heroFadeEls
        .filter(isHeroFadeVisible)
        .sort(function (prevEl, nextEl) {
            return getHeroFadeOrder(prevEl) - getHeroFadeOrder(nextEl);
        })
        .forEach(function (fadeEl, index) {
            setHeroFadeFocusableState(fadeEl, false);

            gsap.to(fadeEl, heroFadeDuration, {
                delay: heroFadeStartDelay + (index * heroFadeStepDelay),
                opacity: 1,
                ease: 'power2.out',
                onComplete: function () {
                    setHeroFadeFocusableState(fadeEl, true);
                }
            });
        });
}

runHeroFadeSequence();

if (heroFadeMediaQuery.addEventListener) {
    heroFadeMediaQuery.addEventListener('change', runHeroFadeSequence);
} else if (heroFadeMediaQuery.addListener) {
    heroFadeMediaQuery.addListener(runHeroFadeSequence);
}

if (reducedMotionMediaQuery.addEventListener) {
    reducedMotionMediaQuery.addEventListener('change', runHeroFadeSequence);
} else if (reducedMotionMediaQuery.addListener) {
    reducedMotionMediaQuery.addListener(runHeroFadeSequence);
}

const orderChoiceEl = document.querySelector('#order_choice_layer');
const orderChoicePanelEl = orderChoiceEl ? orderChoiceEl.querySelector('.order-choice__panel') : null;
const orderChoiceCloseEls = orderChoiceEl ? Array.from(orderChoiceEl.querySelectorAll('[data-order-close]')) : [];
const orderChoiceActionEls = orderChoiceEl ? Array.from(orderChoiceEl.querySelectorAll('.order-choice__button')) : [];
const orderChoiceTriggerEls = Array.from(document.querySelectorAll('[data-order-trigger]'));
const orderChoiceSiblingEls = pageMainEl
    ? Array.from(pageMainEl.children).filter(function (childEl) {
        return childEl !== orderChoiceEl;
    })
    : [];

let lastOrderTriggerEl = null;
let lockedScrollTop = 0;

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
    const previousScrollBehavior = documentElementStyle.scrollBehavior;

    documentElementStyle.scrollBehavior = 'auto';
    document.body.classList.remove('order-choice-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.width = '';
    window.scrollTo(0, lockedScrollTop);

    window.requestAnimationFrame(function () {
        documentElementStyle.scrollBehavior = previousScrollBehavior;
    });
}

function setPageInertForDialog(isInert) {
    if (skipLinksEl) {
        skipLinksEl.inert = isInert;
    }

    if (pageHeaderEl) {
        pageHeaderEl.inert = isInert;
    }

    orderChoiceSiblingEls.forEach(function (siblingEl) {
        siblingEl.inert = isInert;
    });
}

function syncOrderChoiceState(isOpen) {
    if (!orderChoiceEl) {
        return;
    }

    orderChoiceEl.classList.toggle('is-open', isOpen);
    orderChoiceEl.setAttribute('aria-hidden', String(!isOpen));
    orderChoiceEl.inert = !isOpen;
    setPageInertForDialog(isOpen);
}

function getOrderChoiceFocusableEls() {
    return getFocusableEls(orderChoicePanelEl);
}

function openOrderChoice(triggerEl) {
    if (!orderChoiceEl || !orderChoicePanelEl) {
        return;
    }

    lastOrderTriggerEl = triggerEl || null;
    syncOrderChoiceState(true);
    lockOrderChoiceScroll();

    if (triggerEl) {
        triggerEl.setAttribute('aria-expanded', 'true');
    }

    window.requestAnimationFrame(function () {
        const focusTarget = orderChoicePanelEl.querySelector('.order-choice__close') || orderChoicePanelEl;
        focusElement(focusTarget);
    });
}

function closeOrderChoice(options) {
    if (!orderChoiceEl || !orderChoicePanelEl) {
        return;
    }

    const config = options || {};
    const shouldRestoreFocus = config.restoreFocus !== false;

    syncOrderChoiceState(false);
    unlockOrderChoiceScroll();

    if (lastOrderTriggerEl) {
        lastOrderTriggerEl.setAttribute('aria-expanded', 'false');

        if (shouldRestoreFocus) {
            focusElement(lastOrderTriggerEl);
        }
    }

    lastOrderTriggerEl = null;
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
        event.preventDefault();
        return;
    }

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        focusElement(lastEl);
    } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        focusElement(firstEl);
    }
}

if (orderChoiceEl && orderChoicePanelEl && orderChoiceTriggerEls.length) {
    syncOrderChoiceState(false);

    orderChoiceTriggerEls.forEach(function (triggerEl) {
        triggerEl.setAttribute('aria-expanded', 'false');

        triggerEl.addEventListener('click', function (event) {
            event.preventDefault();
            openOrderChoice(triggerEl);
        });
    });

    orderChoiceCloseEls.forEach(function (closeEl) {
        closeEl.addEventListener('click', function () {
            closeOrderChoice();
        });
    });

    orderChoiceActionEls.forEach(function (actionEl) {
        actionEl.addEventListener('click', function () {
            closeOrderChoice({ restoreFocus: false });
        });
    });

    document.addEventListener('keydown', handleOrderChoiceKeydown);
}

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

const noticeEl = document.querySelector('.notice');
const promotionToggleEl = noticeEl ? noticeEl.querySelector('.menu-toggler') : null;
const promotionEl = document.querySelector('.promotion');
const promotionSlideEls = promotionEl ? Array.from(promotionEl.querySelectorAll('.swiper-slide')) : [];
let isPromotionHidden = promotionEl ? promotionEl.classList.contains('hide') : false;

function syncPromotionSlideAccessibility(swiper) {
    const activeIndex = swiper ? swiper.activeIndex : 0;

    promotionSlideEls.forEach(function (slideEl, slideIndex) {
        const promotionLinkEl = slideEl.querySelector('.btn--promotion');
        const isActive = slideIndex === activeIndex;

        slideEl.setAttribute('aria-hidden', String(!isActive));

        if (!promotionLinkEl) {
            return;
        }

        if (isActive) {
            promotionLinkEl.removeAttribute('tabindex');
        } else {
            promotionLinkEl.setAttribute('tabindex', '-1');
        }
    });
}

if (document.querySelector('.promotion .swiper-container') && typeof Swiper !== 'undefined') {
    const promotionSwiper = new Swiper('.promotion .swiper-container', {
        autoplay: false,
        loop: false,
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
        },
        on: {
            init: function () {
                syncPromotionSlideAccessibility(this);
            },
            slideChange: function () {
                syncPromotionSlideAccessibility(this);
            }
        }
    });

    syncPromotionSlideAccessibility(promotionSwiper);
}

function syncPromotionState(isHidden) {
    if (!promotionEl || !promotionToggleEl) {
        return;
    }

    isPromotionHidden = isHidden;
    promotionEl.classList.toggle('hide', isPromotionHidden);
    promotionEl.setAttribute('aria-hidden', String(isPromotionHidden));
    promotionEl.inert = isPromotionHidden;
    promotionToggleEl.setAttribute('aria-expanded', String(!isPromotionHidden));
    promotionToggleEl.setAttribute('aria-label', isPromotionHidden ? '프로모션 펼치기' : '프로모션 접기');

    if (noticeEl) {
        noticeEl.classList.toggle('menuing', !isPromotionHidden);
    }

    if (isPromotionHidden && promotionEl.contains(document.activeElement)) {
        focusElement(promotionToggleEl);
    }
}

function syncPromotionState(isHidden) {
    if (!promotionEl || !promotionToggleEl) {
        return;
    }

    isPromotionHidden = isHidden;
    promotionEl.classList.toggle('hide', isPromotionHidden);
    promotionEl.setAttribute('aria-hidden', String(isPromotionHidden));
    promotionEl.inert = isPromotionHidden;
    promotionToggleEl.setAttribute('aria-expanded', String(!isPromotionHidden));
    promotionToggleEl.setAttribute('aria-label', isPromotionHidden ? '프로모션 펼치기' : '프로모션 접기');

    if (noticeEl) {
        noticeEl.classList.toggle('menuing', !isPromotionHidden);
    }

    if (isPromotionHidden && promotionEl.contains(document.activeElement)) {
        focusElement(promotionToggleEl);
    }
}

function syncPromotionState(isHidden) {
    if (!promotionEl || !promotionToggleEl) {
        return;
    }

    isPromotionHidden = isHidden;
    promotionEl.classList.toggle('hide', isPromotionHidden);
    promotionEl.setAttribute('aria-hidden', String(isPromotionHidden));
    promotionEl.inert = isPromotionHidden;
    promotionToggleEl.setAttribute('aria-expanded', String(!isPromotionHidden));
    promotionToggleEl.setAttribute('aria-label', isPromotionHidden ? '프로모션 펼치기' : '프로모션 접기');

    if (noticeEl) {
        noticeEl.classList.toggle('menuing', !isPromotionHidden);
    }

    if (isPromotionHidden && promotionEl.contains(document.activeElement)) {
        focusElement(promotionToggleEl);
    }
}

function syncPromotionStateAccessible(isHidden) {
    if (!promotionEl || !promotionToggleEl) {
        return;
    }

    isPromotionHidden = isHidden;
    promotionEl.classList.toggle('hide', isPromotionHidden);
    promotionEl.setAttribute('aria-hidden', String(isPromotionHidden));
    promotionEl.inert = isPromotionHidden;
    promotionToggleEl.setAttribute('aria-expanded', String(!isPromotionHidden));
    promotionToggleEl.setAttribute('aria-label', isPromotionHidden ? '프로모션 펼치기' : '프로모션 접기');

    if (noticeEl) {
        noticeEl.classList.toggle('menuing', !isPromotionHidden);
    }

    if (isPromotionHidden && promotionEl.contains(document.activeElement)) {
        focusElement(promotionToggleEl);
    }
}

if (promotionEl && promotionToggleEl) {
    syncPromotionStateAccessible(isPromotionHidden);

    promotionToggleEl.addEventListener('click', function () {
        syncPromotionStateAccessible(!isPromotionHidden);
    });
}

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
}());
