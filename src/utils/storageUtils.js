/**
 * Verifica se a página sofreu um reload e limpa o armazenamento de sessão.
 * Isso garante que a aplicação retorne ao estado dos templates originais.
 */
export const resetStorageOnReload = () => {
  if (
    typeof window !== "undefined" &&
    window.performance &&
    window.performance.getEntriesByType("navigation").length > 0
  ) {
    const navigationType = window.performance.getEntriesByType("navigation")[0].type;
    
    if (navigationType === "reload") {
      console.warn("♻️ Recarregamento detectado: Resetando sessionStorage.");
      sessionStorage.clear();
    }
  }
};