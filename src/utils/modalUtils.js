let scrollLockCount = 0; // modais bloqueando o scroll

export function lockBodyScroll() {
    scrollLockCount += 1;
    if (scrollLockCount === 1) {
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
    }
}

export function unlockBodyScroll() {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
    }
}
