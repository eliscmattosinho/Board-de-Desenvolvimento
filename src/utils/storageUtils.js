/**
 * Verifica se a página sofreu um reload e limpa apenas os dados de estado,
 * preservando preferências globais como o Tema (Dark/Light).
 */
export const resetStorageOnReload = () => {
  if (
    typeof window !== "undefined" &&
    window.performance &&
    window.performance.getEntriesByType("navigation").length > 0
  ) {
    const navigationType =
      window.performance.getEntriesByType("navigation")[0].type;

    if (navigationType === "reload") {
      console.warn(
        "♻️ Recarregamento detectado: Resetando dados de navegação."
      );

      // Resetar TUDO exceto o tema:
      const currentTheme = localStorage.getItem("theme");

      // Limpa os storages
      sessionStorage.clear();
      localStorage.clear();

      // Restaura o tema logo em seguida para o usuário não perceber
      if (currentTheme) {
        localStorage.setItem("theme", currentTheme);
      }
    }
  }
};
