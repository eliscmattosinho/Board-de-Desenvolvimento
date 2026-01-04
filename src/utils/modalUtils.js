let scrollLockCount = 0;

/**
 * Bloqueia o scroll do body
 * Adiciona um padding compensatório para evitar o "pulo" da tela (layout shift).
 */
export function lockBodyScroll() {
    scrollLockCount += 1;

    if (scrollLockCount === 1) {
        // Calcula a largura da barra de rolagem antes de escondê-la
        const scrollBarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";

        // Compensação: Adiciona padding à direita para o conteúdo não "pular"
        if (scrollBarWidth > 0) {
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        }
    }
}

/**
 * Desbloqueia o scroll apenas quando todos os locks forem removidos.
 */
export function unlockBodyScroll() {
    scrollLockCount = Math.max(0, scrollLockCount - 1);

    if (scrollLockCount === 0) {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        document.body.style.paddingRight = "";
    }
}
