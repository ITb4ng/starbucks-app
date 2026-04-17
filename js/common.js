(function () {
const searchEl = document.querySelector('.search');
const searchInputEl = searchEl ? searchEl.querySelector('input') : null;
const searchClearEl = searchEl ? searchEl.querySelector('.search__clear') : null;
const skipLinksEl = document.querySelector('.skip-links');
const inPageSkipLinkEls = document.querySelectorAll('.skip-link[href^="#"]:not([data-skip-menu])');
const headerEl = document.querySelector('header');
const mainEl = document.querySelector('main');
const headerToggleEl = headerEl ? headerEl.querySelector('.header-toggle') : null;
const headerNavEl = headerEl ? headerEl.querySelector('.header-nav') : null;
const headerCloseEls = headerEl ? Array.from(headerEl.querySelectorAll('.header-close')) : [];
const headerCloseActionEls = headerEl ? Array.from(headerEl.querySelectorAll('.header-nav__close-action')) : [];
const headerOverlayEl = headerEl ? headerEl.querySelector('.header-overlay') : null;
const headerMenuButtons = headerEl ? Array.from(headerEl.querySelectorAll('.main-menu .item > .item__name')) : [];
const headerMenuItems = headerEl ? Array.from(headerEl.querySelectorAll('.main-menu > .item')) : [];
const headerSkipMenuLinks = document.querySelectorAll('[data-skip-menu]');
const mobileSearchMediaQuery = window.matchMedia('(max-width: 959px)');
const tabletMediaQuery = window.matchMedia('(max-width: 959px)');
const rootEl = document.documentElement;
const headerActionsVisibleClass = 'is-nav-actions-visible';
const searchPlaceholderText = '통합검색';
const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let lastHeaderNavTriggerEl = null;

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

function moveFocusToTarget(targetEl) {
    if (!targetEl) {
        return;
    }

    targetEl.scrollIntoView({
        block: 'start',
        inline: 'nearest'
    });

    window.requestAnimationFrame(function () {
        focusElement(targetEl);
    });
}

function syncSearchPlaceholder() {
    if (!searchInputEl) {
        return;
    }

    searchInputEl.setAttribute('placeholder', mobileSearchMediaQuery.matches ? searchPlaceholderText : '');
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
        searchInputEl.setAttribute('placeholder', searchPlaceholderText);
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

function getHeaderMenuItem(buttonEl) {
    return buttonEl ? buttonEl.closest('.item') : null;
}

function getHeaderMenuPanel(buttonEl) {
    if (!buttonEl) {
        return null;
    }

    const panelId = buttonEl.getAttribute('aria-controls');
    return panelId ? document.getElementById(panelId) : null;
}

function getHeaderMenuPanelFocusableEls(buttonEl) {
    return getFocusableEls(getHeaderMenuPanel(buttonEl));
}

function syncHeaderMenuMetadata() {
    headerMenuButtons.forEach(function (buttonEl, index) {
        if (!buttonEl.id) {
            buttonEl.id = 'header-menu-button-' + (index + 1);
        }

        const panelEl = getHeaderMenuPanel(buttonEl);
        if (panelEl) {
            panelEl.setAttribute('aria-labelledby', buttonEl.id);
        }
    });
}

function setHeaderMenuItemState(buttonEl, isOpen) {
    if (!buttonEl) {
        return;
    }

    const itemEl = getHeaderMenuItem(buttonEl);
    const panelEl = getHeaderMenuPanel(buttonEl);

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

function resetHeaderMenuState() {
    if (!headerEl) {
        return;
    }

    headerEl.classList.remove(headerActionsVisibleClass);
    closeAllHeaderMenuItems();
}

function focusHeaderMenuButtonAt(index) {
    if (!headerMenuButtons.length) {
        return;
    }

    const safeIndex = (index + headerMenuButtons.length) % headerMenuButtons.length;
    focusElement(headerMenuButtons[safeIndex]);
}

function focusFirstHeaderMenuButton() {
    if (!headerMenuButtons.length) {
        return;
    }

    if (tabletMediaQuery.matches && headerEl && !headerEl.classList.contains('is-nav-open')) {
        openHeaderNav('menu', headerToggleEl);
        return;
    }

    window.requestAnimationFrame(function () {
        focusElement(headerMenuButtons[0]);
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

function setHeaderNavBackdropState(isOpen) {
    if (skipLinksEl) {
        skipLinksEl.inert = false;
    }
}

function syncHeaderNavAccessibility(isOpen) {
    if (!headerNavEl) {
        return;
    }

    if (!tabletMediaQuery.matches) {
        headerNavEl.inert = false;
        headerNavEl.setAttribute('aria-hidden', 'false');
        setHeaderNavBackdropState(false);
        return;
    }

    headerNavEl.inert = !isOpen;
    headerNavEl.setAttribute('aria-hidden', String(!isOpen));
    setHeaderNavBackdropState(isOpen);
}

function getHeaderNavFocusableEls() {
    return getFocusableEls(headerNavEl);
}

function openHeaderNav(focusMode, triggerEl) {
    if (!headerEl || !headerToggleEl || !tabletMediaQuery.matches) {
        return;
    }

    syncHeaderNavViewportHeight();
    lastHeaderNavTriggerEl = triggerEl || headerToggleEl;
    headerEl.classList.add('is-nav-ready', 'is-nav-open');
    headerEl.classList.remove(headerActionsVisibleClass);
    document.body.classList.add('header-nav-open');
    headerToggleEl.setAttribute('aria-expanded', 'true');
    syncHeaderNavAccessibility(true);

    window.requestAnimationFrame(function () {
        if (focusMode === 'menu' && headerMenuButtons.length) {
            focusElement(headerMenuButtons[0]);
            return;
        }

        const firstFocusTarget = headerCloseEls[0] || getHeaderNavFocusableEls()[0];
        focusElement(firstFocusTarget);
    });
}

function closeHeaderNav(options) {
    if (!headerEl || !headerToggleEl) {
        return;
    }

    const config = options || {};
    const shouldRestoreFocus = config.restoreFocus !== false;

    headerEl.classList.remove('is-nav-open');
    document.body.classList.remove('header-nav-open');
    headerToggleEl.setAttribute('aria-expanded', 'false');
    resetSearchFocusState();
    resetHeaderMenuState();
    syncHeaderNavAccessibility(false);

    if (shouldRestoreFocus && tabletMediaQuery.matches) {
        const focusTarget = lastHeaderNavTriggerEl || headerToggleEl;
        window.requestAnimationFrame(function () {
            focusElement(focusTarget);
        });
    }
}

function syncHeaderNavState() {
    if (!tabletMediaQuery.matches) {
        closeHeaderNav({ restoreFocus: false });
        if (headerEl) {
            headerEl.classList.remove('is-nav-ready');
        }
    }

    syncHeaderNavAccessibility(headerEl ? headerEl.classList.contains('is-nav-open') : false);
}

function handleHeaderMenuButtonKeydown(event, buttonEl, index) {
    switch (event.key) {
        case ' ':
        case 'Enter':
            event.preventDefault();
            toggleHeaderMenuItem(buttonEl);
            break;
        case 'ArrowRight':
            event.preventDefault();
            focusHeaderMenuButtonAt(index + 1);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            focusHeaderMenuButtonAt(index - 1);
            break;
        case 'Home':
            event.preventDefault();
            focusHeaderMenuButtonAt(0);
            break;
        case 'End':
            event.preventDefault();
            focusHeaderMenuButtonAt(headerMenuButtons.length - 1);
            break;
        case 'ArrowDown':
            event.preventDefault();
            openHeaderMenuItem(buttonEl);
            window.requestAnimationFrame(function () {
                const panelFocusableEls = getHeaderMenuPanelFocusableEls(buttonEl);

                if (!panelFocusableEls.length) {
                    return;
                }

                focusElement(panelFocusableEls[0]);
            });
            break;
        case 'Escape':
            if (tabletMediaQuery.matches && headerEl && headerEl.classList.contains('is-nav-open')) {
                event.preventDefault();
                closeHeaderNav();
                return;
            }

            event.preventDefault();
            setHeaderMenuItemState(buttonEl, false);
            focusElement(buttonEl);
            break;
        default:
            break;
    }
}

function trapHeaderNavFocus(event) {
    if (!tabletMediaQuery.matches || !headerEl || !headerEl.classList.contains('is-nav-open') || event.key !== 'Tab') {
        return;
    }

    const focusableEls = getHeaderNavFocusableEls();
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

function bindInPageSkipLinks() {
    inPageSkipLinkEls.forEach(function (skipLinkEl) {
        skipLinkEl.addEventListener('click', function (event) {
            const targetId = skipLinkEl.getAttribute('href');
            const targetEl = targetId ? document.querySelector(targetId) : null;

            if (!targetEl) {
                return;
            }

            event.preventDefault();

            if (tabletMediaQuery.matches && headerEl && headerEl.classList.contains('is-nav-open')) {
                closeHeaderNav({ restoreFocus: false });
            }

            moveFocusToTarget(targetEl);
        });
    });
}

if (headerEl && headerToggleEl && headerNavEl && headerOverlayEl) {
    syncHeaderMenuMetadata();
    bindInPageSkipLinks();

    headerToggleEl.addEventListener('click', function () {
        if (!tabletMediaQuery.matches) {
            return;
        }

        if (headerEl.classList.contains('is-nav-open')) {
            closeHeaderNav();
            return;
        }

        openHeaderNav('default', headerToggleEl);
    });

    headerCloseEls.forEach(function (closeButtonEl) {
        closeButtonEl.addEventListener('click', function () {
            closeHeaderNav();
        });
    });

    headerCloseActionEls.forEach(function (closeActionEl) {
        closeActionEl.addEventListener('click', function () {
            closeHeaderNav();
        });
    });

    headerOverlayEl.addEventListener('click', function () {
        closeHeaderNav({ restoreFocus: false });
    });

    headerMenuButtons.forEach(function (buttonEl, index) {
        buttonEl.addEventListener('keydown', function (event) {
            handleHeaderMenuButtonKeydown(event, buttonEl, index);
        });

        buttonEl.addEventListener('click', function () {
            resetSearchFocusState();
            toggleHeaderMenuItem(buttonEl);
        });
    });

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

    headerSkipMenuLinks.forEach(function (skipLinkEl) {
        skipLinkEl.addEventListener('click', function (event) {
            event.preventDefault();
            focusFirstHeaderMenuButton();
        });
    });

    document.addEventListener('keydown', function (event) {
        if (tabletMediaQuery.matches && headerEl.classList.contains('is-nav-open') && event.key === 'Escape') {
            event.preventDefault();
            closeHeaderNav();
            return;
        }

        trapHeaderNavFocus(event);
    });

    document.addEventListener('mousedown', function (event) {
        if (!headerEl.contains(event.target)) {
            closeAllHeaderMenuItems();
        }
    });

    document.addEventListener('focusin', function (event) {
        if (!headerEl.contains(event.target)) {
            closeAllHeaderMenuItems();
        }
    });

    window.addEventListener('resize', syncHeaderNavState);
    window.addEventListener('resize', syncHeaderNavViewportHeight);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', syncHeaderNavViewportHeight);
    }

    syncHeaderNavState();
    syncHeaderNavViewportHeight();
    resetHeaderMenuState();
}

const thisYearEls = document.querySelectorAll('.this-year');
if (thisYearEls.length) {
    const currentYear = new Date().getFullYear();
    thisYearEls.forEach(function (thisYearEl) {
        thisYearEl.textContent = currentYear;
    });
}
}());
