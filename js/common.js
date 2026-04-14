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
const headerToggleEl = headerEl ? headerEl.querySelector('.header-toggle') : null;
const headerCloseEls = headerEl ? headerEl.querySelectorAll('.header-close') : [];
const headerCloseActionEls = headerEl ? headerEl.querySelectorAll('.header-nav__close-action') : [];
const headerOverlayEl = headerEl ? headerEl.querySelector('.header-overlay') : null;
const headerMenuButtons = headerEl ? headerEl.querySelectorAll('.main-menu .item > .item__name') : [];
const headerMenuItems = headerEl ? headerEl.querySelectorAll('.main-menu > .item') : [];
const headerSkipMenuLinks = document.querySelectorAll('[data-skip-menu]');
const headerMenuFocusableItems = headerEl ? headerEl.querySelectorAll('.main-menu .item .item__contents .contents__menu > ul > li ul > li') : [];
const headerMenuHeadingEls = headerEl ? headerEl.querySelectorAll('.main-menu .item .item__contents .contents__menu > ul > li > h2') : [];
const tabletMediaQuery = window.matchMedia('(max-width: 959px)');
const rootEl = document.documentElement;
const headerActionsVisibleClass = 'is-nav-actions-visible';

function getHeaderMenuItem(buttonEl) {
    return buttonEl ? buttonEl.closest('.item') : null;
}

function setHeaderMenuItemState(buttonEl, isOpen) {
    if (!buttonEl) {
        return;
    }

    const itemEl = getHeaderMenuItem(buttonEl);
    const panelEl = buttonEl.getAttribute('aria-controls') ? document.getElementById(buttonEl.getAttribute('aria-controls')) : null;

    if (itemEl) {
        itemEl.classList.toggle('is-open', isOpen);
    }

    buttonEl.setAttribute('aria-expanded', String(isOpen));

    if (panelEl) {
        panelEl.setAttribute('aria-hidden', String(!isOpen));
    }
}

function closeAllHeaderMenuItems(exceptButtonEl) {
    headerMenuButtons.forEach(function (otherButtonEl) {
        if (exceptButtonEl && otherButtonEl === exceptButtonEl) {
            return;
        }

        setHeaderMenuItemState(otherButtonEl, false);
    });
}

function openHeaderMenuItem(buttonEl) {
    if (!buttonEl) {
        return;
    }

    closeAllHeaderMenuItems(buttonEl);
    setHeaderMenuItemState(buttonEl, true);

    if (tabletMediaQuery.matches && headerEl) {
        headerEl.classList.add(headerActionsVisibleClass);
    }
}

function toggleHeaderMenuItem(buttonEl) {
    if (!buttonEl) {
        return;
    }

    const itemEl = getHeaderMenuItem(buttonEl);
    const isOpen = itemEl ? itemEl.classList.contains('is-open') : false;

    if (isOpen) {
        setHeaderMenuItemState(buttonEl, false);
        if (headerEl) {
            headerEl.classList.remove(headerActionsVisibleClass);
        }
        return;
    }

    openHeaderMenuItem(buttonEl);
}

function focusFirstHeaderMenuButton() {
    if (!headerMenuButtons.length) {
        return;
    }

    const firstButtonEl = headerMenuButtons[0];

    if (tabletMediaQuery.matches && headerEl && headerToggleEl && !headerEl.classList.contains('is-nav-open')) {
        headerToggleEl.click();
    }

    window.requestAnimationFrame(function () {
        firstButtonEl.focus();
    });
}

function setupHeaderMenuFocusableItems() {
    headerMenuHeadingEls.forEach(function (headingEl) {
        headingEl.setAttribute('tabindex', '0');
    });

    headerMenuFocusableItems.forEach(function (itemEl) {
        if (itemEl.querySelector('a, button, input, select, textarea, [tabindex]')) {
            return;
        }

        itemEl.setAttribute('tabindex', '0');
        itemEl.setAttribute('role', 'menuitem');
    });
}

function setupHeaderMenuItemFocusState() {
    headerMenuItems.forEach(function (itemEl) {
        const buttonEl = itemEl.querySelector(':scope > .item__name');

        if (!buttonEl) {
            return;
        }

        itemEl.addEventListener('focusout', function (event) {
            const nextFocusedEl = event.relatedTarget;

            if (nextFocusedEl && itemEl.contains(nextFocusedEl)) {
                return;
            }

            setHeaderMenuItemState(buttonEl, false);
        });
    });
}

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

function resetHeaderMenuState() {
    if (!headerEl) {
        return;
    }

    headerEl.classList.remove(headerActionsVisibleClass);

    headerMenuButtons.forEach(function (buttonEl) {
        setHeaderMenuItemState(buttonEl, false);
    });
}

function closeHeaderNav() {
    if (!headerEl || !headerToggleEl) {
        return;
    }

    headerEl.classList.remove('is-nav-open');
    document.body.classList.remove('header-nav-open');
    headerToggleEl.setAttribute('aria-expanded', 'false');
    resetSearchFocusState();
    resetHeaderMenuState();
}

function syncHeaderNavState() {
    if (!tabletMediaQuery.matches) {
        closeHeaderNav();
        headerEl.classList.remove('is-nav-ready');
    }
}

if (headerEl && headerToggleEl && headerCloseEls.length && headerOverlayEl) {
    headerToggleEl.addEventListener('click', function () {
        syncHeaderNavViewportHeight();
        headerEl.classList.add('is-nav-ready');
        const isOpen = headerEl.classList.toggle('is-nav-open');
        document.body.classList.toggle('header-nav-open', isOpen);
        headerToggleEl.setAttribute('aria-expanded', String(isOpen));

        if (isOpen) {
            headerEl.classList.remove(headerActionsVisibleClass);
        } else {
            resetHeaderMenuState();
        }
    });

    headerCloseEls.forEach(function (closeButtonEl) {
        closeButtonEl.addEventListener('click', closeHeaderNav);
    });
    headerCloseActionEls.forEach(function (closeActionEl) {
        closeActionEl.addEventListener('click', closeHeaderNav);
    });
    headerOverlayEl.addEventListener('click', closeHeaderNav);

    headerMenuButtons.forEach(function (buttonEl) {
        buttonEl.addEventListener('keydown', function (event) {
            if (event.key !== 'Enter' && event.key !== ' ') {
                return;
            }

            event.preventDefault();
            openHeaderMenuItem(buttonEl);
        });

        buttonEl.addEventListener('click', function () {
            resetSearchFocusState();
            toggleHeaderMenuItem(buttonEl);
        });
    });

    headerSkipMenuLinks.forEach(function (skipLinkEl) {
        skipLinkEl.addEventListener('click', function (event) {
            event.preventDefault();
            focusFirstHeaderMenuButton();
        });
    });

    setupHeaderMenuFocusableItems();
    setupHeaderMenuItemFocusState();

    window.addEventListener('resize', syncHeaderNavState);
    window.addEventListener('resize', syncHeaderNavViewportHeight);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', syncHeaderNavViewportHeight);
    }
    syncHeaderNavState();
    syncHeaderNavViewportHeight();
    resetHeaderMenuState();
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
