/**
 * Verifica se a página sofreu um reload e limpa os dados de estado,
 * preservando preferências globais essenciais.
 */
export const resetStorageOnReload = () => {
    if (typeof window === "undefined") return;

    const [navigation] = window.performance.getEntriesByType("navigation");

    if (navigation?.type === "reload") {
        console.warn("♻️ Reload detectado: Filtrando dados do Storage.");

        const WHITELIST = ["theme"];

        sessionStorage.clear();

        const keys = Object.keys(localStorage);

        keys.forEach((key) => {
            if (!WHITELIST.includes(key)) {
                localStorage.removeItem(key);
            }
        });
    }
};
