(function () {
    const splashEl = document.querySelector('[data-splash]');
    if (!splashEl) {
        return;
    }

    const storageKey = 'starbucksPortfolioSplashSeen';
    const progressTextEl = splashEl.querySelector('[data-splash-progress]');
    const progressBarEl = splashEl.querySelector('[data-splash-bar]');
    const progressEl = splashEl.querySelector('[role="progressbar"]');
    const statusEl = splashEl.querySelector('[data-splash-status]');
    const mainEl = document.querySelector('main');
    const skipLinksEl = document.querySelector('.skip-links');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let hasFinished = false;

    function hasSeenSplash() {
        try {
            return sessionStorage.getItem(storageKey) === 'true';
        } catch (error) {
            return false;
        }
    }

    function rememberSplash() {
        try {
            sessionStorage.setItem(storageKey, 'true');
        } catch (error) {}
    }

    function setProgress(value) {
        const safeValue = Math.max(0, Math.min(100, Math.round(value)));

        if (progressTextEl) {
            progressTextEl.textContent = safeValue + '%';
        }

        if (progressBarEl) {
            progressBarEl.style.width = safeValue + '%';
        }

        if (progressEl) {
            progressEl.setAttribute('aria-valuenow', String(safeValue));
        }
    }

    function restorePage() {
        if (hasFinished) {
            return;
        }

        hasFinished = true;
        document.body.classList.remove('is-splash-active');

        if (mainEl) {
            mainEl.inert = false;
        }

        if (skipLinksEl) {
            skipLinksEl.inert = false;
        }

        splashEl.setAttribute('aria-hidden', 'true');
        splashEl.remove();
    }

    function finishSplash() {
        setProgress(100);
        rememberSplash();

        if (statusEl) {
            statusEl.textContent = 'Portfolio experience ready.';
        }

        window.setTimeout(function () {
            splashEl.classList.add('is-hidden');
            splashEl.addEventListener('transitionend', restorePage, { once: true });
            window.setTimeout(restorePage, 700);
        }, reduceMotion ? 120 : 430);
    }

    if (hasSeenSplash()) {
        document.documentElement.classList.add('splash-seen');
        restorePage();
        return;
    }

    document.body.classList.add('is-splash-active');

    if (mainEl) {
        mainEl.inert = true;
    }

    if (skipLinksEl) {
        skipLinksEl.inert = true;
    }

    if (reduceMotion) {
        setProgress(100);
        finishSplash();
        return;
    }

    const duration = 2200;
    const startTime = window.performance.now();

    function tick(now) {
        const elapsed = now - startTime;
        const ratio = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - ratio, 3);

        setProgress(eased * 100);

        if (ratio < 1) {
            window.requestAnimationFrame(tick);
            return;
        }

        finishSplash();
    }

    setProgress(0);
    window.requestAnimationFrame(tick);
}());
