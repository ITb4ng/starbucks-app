// Header search logic
const searchEl = document.querySelector('.search');
const searchInputEl = searchEl ? searchEl.querySelector('input') : null;
const searchClearEl = searchEl ? searchEl.querySelector('.search__clear') : null;
const mobileSearchMediaQuery = window.matchMedia('(max-width: 959px)');

function syncSearchPlaceholder() {
    if (!searchInputEl) {
        return;
    }

    searchInputEl.setAttribute('placeholder', mobileSearchMediaQuery.matches ? '통합검색' : '');
}

function syncSearchValueState() {
    if (!searchEl || !searchInputEl) {
        return;
    }

    searchEl.classList.toggle('has-value', searchInputEl.value.trim().length > 0);
}

function resetSearchFocusState() {
    if (!searchEl || !searchInputEl) {
        return;
    }

    searchEl.classList.remove('focused');
    searchInputEl.blur();
    syncSearchPlaceholder();
}

if (searchEl && searchInputEl) {
    searchEl.addEventListener('click', function () {
        searchInputEl.focus();
    });

    searchInputEl.addEventListener('focus', function () {
        searchEl.classList.add('focused');
        searchInputEl.setAttribute('placeholder', '통합검색');
    });

    searchInputEl.addEventListener('blur', function () {
        searchEl.classList.remove('focused');
        syncSearchPlaceholder();
        searchInputEl.value = '';
        syncSearchValueState();
    });

    searchInputEl.addEventListener('input', syncSearchValueState);

    if (searchClearEl) {
        searchClearEl.addEventListener('mousedown', function (event) {
            event.preventDefault();
        });

        searchClearEl.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            searchInputEl.value = '';
            syncSearchValueState();
            searchInputEl.focus();
        });
    }

    syncSearchPlaceholder();
    syncSearchValueState();
    if (mobileSearchMediaQuery.addEventListener) {
        mobileSearchMediaQuery.addEventListener('change', syncSearchPlaceholder);
    } else if (mobileSearchMediaQuery.addListener) {
        mobileSearchMediaQuery.addListener(syncSearchPlaceholder);
    }
}

// Responsive header GNB logic
const headerEl = document.querySelector('header');
const headerNavEl = headerEl ? headerEl.querySelector('.header-nav') : null;
const headerToggleEl = headerEl ? headerEl.querySelector('.header-toggle') : null;
const headerCloseEls = headerEl ? headerEl.querySelectorAll('.header-close') : [];
const headerOverlayEl = headerEl ? headerEl.querySelector('.header-overlay') : null;
const headerMenuButtons = headerEl ? headerEl.querySelectorAll('.main-menu .item > .item__name') : [];
const tabletMediaQuery = window.matchMedia('(max-width: 959px)');
const rootEl = document.documentElement;

function syncHeaderNavViewportHeight() {
    if (!rootEl) {
        return;
    }

    if (!tabletMediaQuery.matches) {
        rootEl.style.removeProperty('--header-nav-height');
        return;
    }

    rootEl.style.setProperty('--header-nav-height', window.innerHeight + 'px');
}

function closeHeaderNav() {
    if (!headerEl || !headerToggleEl) {
        return;
    }

    headerEl.classList.remove('is-nav-open');
    headerEl.classList.remove('is-bottom-close-visible');
    document.body.classList.remove('header-nav-open');
    headerToggleEl.setAttribute('aria-expanded', 'false');
    resetSearchFocusState();

    headerMenuButtons.forEach(function (buttonEl) {
        const itemEl = buttonEl.closest('.item');
        if (itemEl) {
            itemEl.classList.remove('is-open');
        }
        buttonEl.setAttribute('aria-expanded', 'false');
    });
}

function syncHeaderNavState() {
    if (!tabletMediaQuery.matches) {
        closeHeaderNav();
        headerEl.classList.remove('is-nav-ready');
    }
}

function syncBottomCloseVisibility() {
    if (!headerEl || !headerNavEl) {
        return;
    }

    if (!tabletMediaQuery.matches || !headerEl.classList.contains('is-nav-open')) {
        headerEl.classList.remove('is-bottom-close-visible');
        return;
    }

    const scrollableDistance = headerNavEl.scrollHeight - headerNavEl.clientHeight;
    if (scrollableDistance <= 24) {
        headerEl.classList.remove('is-bottom-close-visible');
        return;
    }

    const isNearBottom = headerNavEl.scrollTop + headerNavEl.clientHeight >= headerNavEl.scrollHeight - 24;
    headerEl.classList.toggle('is-bottom-close-visible', isNearBottom);
}

if (headerEl && headerToggleEl && headerCloseEls.length && headerOverlayEl) {
    headerToggleEl.addEventListener('click', function () {
        syncHeaderNavViewportHeight();
        headerEl.classList.add('is-nav-ready');
        const isOpen = headerEl.classList.toggle('is-nav-open');
        document.body.classList.toggle('header-nav-open', isOpen);
        headerToggleEl.setAttribute('aria-expanded', String(isOpen));

        if (!isOpen) {
            headerEl.classList.remove('is-bottom-close-visible');
            headerMenuButtons.forEach(function (buttonEl) {
                const itemEl = buttonEl.closest('.item');
                if (itemEl) {
                    itemEl.classList.remove('is-open');
                }
                buttonEl.setAttribute('aria-expanded', 'false');
            });
        } else {
            window.requestAnimationFrame(syncBottomCloseVisibility);
        }
    });

    headerCloseEls.forEach(function (closeButtonEl) {
        closeButtonEl.addEventListener('click', closeHeaderNav);
    });
    headerOverlayEl.addEventListener('click', closeHeaderNav);

    headerMenuButtons.forEach(function (buttonEl) {
        buttonEl.addEventListener('click', function () {
            if (!tabletMediaQuery.matches) {
                return;
            }

            resetSearchFocusState();

            const itemEl = buttonEl.closest('.item');
            const isOpen = itemEl ? itemEl.classList.contains('is-open') : false;

            headerMenuButtons.forEach(function (otherButtonEl) {
                const otherItemEl = otherButtonEl.closest('.item');
                if (otherItemEl) {
                    otherItemEl.classList.remove('is-open');
                }
                otherButtonEl.setAttribute('aria-expanded', 'false');
            });

            if (itemEl && !isOpen) {
                itemEl.classList.add('is-open');
                buttonEl.setAttribute('aria-expanded', 'true');
            }

            window.requestAnimationFrame(syncBottomCloseVisibility);
        });
    });

    if (headerNavEl) {
        headerNavEl.addEventListener('scroll', syncBottomCloseVisibility, { passive: true });
    }
    window.addEventListener('resize', syncHeaderNavState);
    window.addEventListener('resize', syncHeaderNavViewportHeight);
    window.addEventListener('resize', syncBottomCloseVisibility);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', syncHeaderNavViewportHeight);
        window.visualViewport.addEventListener('resize', syncBottomCloseVisibility);
    }
    syncHeaderNavState();
    syncHeaderNavViewportHeight();
    syncBottomCloseVisibility();
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeHeaderNav();
        }
    });
}

// Footer copyright
const thisYearEls = document.querySelectorAll('.this-year');
if (thisYearEls.length) {
    const currentYear = new Date().getFullYear();
    thisYearEls.forEach(function (thisYearEl) {
        thisYearEl.textContent = currentYear;
    });
}
