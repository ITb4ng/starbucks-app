// 헤더 통합검색 Logic
const searchEl = document.querySelector('.search');
const searchInputEl = searchEl ? searchEl.querySelector('input') : null;

if (searchEl && searchInputEl) {
    searchEl.addEventListener('click', function() {
        searchInputEl.focus();
    });

    searchInputEl.addEventListener('focus', function() {
        searchEl.classList.add('focused');
        searchInputEl.setAttribute('placeholder', '통합검색');
    })

    searchInputEl.addEventListener('blur', function() { // focusOut , blur 이벤트 버블링 여부 차이
        searchEl.classList.remove('focused');
        searchInputEl.setAttribute('placeholder', '');
        searchInputEl.value = '' // 텍스트 필드 값 비우기
    })
}

// 반응형 헤더 GNB Logic
const headerEl = document.querySelector('header');
const headerToggleEl = headerEl ? headerEl.querySelector('.header-toggle') : null;
const headerCloseEl = headerEl ? headerEl.querySelector('.header-close') : null;
const headerOverlayEl = headerEl ? headerEl.querySelector('.header-overlay') : null;
const headerMenuButtons = headerEl ? headerEl.querySelectorAll('.main-menu .item > .item__name') : [];
const tabletMediaQuery = window.matchMedia('(max-width: 959px)');

function closeHeaderNav() {
    if (!headerEl || !headerToggleEl) {
        return;
    }

    headerEl.classList.remove('is-nav-open');
    document.body.classList.remove('header-nav-open');
    headerToggleEl.setAttribute('aria-expanded', 'false');

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

if (headerEl && headerToggleEl && headerCloseEl && headerOverlayEl) {
    headerToggleEl.addEventListener('click', function () {
        headerEl.classList.add('is-nav-ready');
        const isOpen = headerEl.classList.toggle('is-nav-open');
        document.body.classList.toggle('header-nav-open', isOpen);
        headerToggleEl.setAttribute('aria-expanded', String(isOpen));

        if (!isOpen) {
            headerMenuButtons.forEach(function (buttonEl) {
                const itemEl = buttonEl.closest('.item');
                if (itemEl) {
                    itemEl.classList.remove('is-open');
                }
                buttonEl.setAttribute('aria-expanded', 'false');
            });
        }
    });

    headerCloseEl.addEventListener('click', closeHeaderNav);
    headerOverlayEl.addEventListener('click', closeHeaderNav);

    headerMenuButtons.forEach(function (buttonEl) {
        buttonEl.addEventListener('click', function () {
            if (!tabletMediaQuery.matches) {
                return;
            }

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
        });
    });

    window.addEventListener('resize', syncHeaderNavState);
    syncHeaderNavState();
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeHeaderNav();
        }
    });
}
  
  /* footer Copyright */
const thisYear = document.querySelector('.this-year');
thisYear.textContent = new Date().getFullYear();
