// Binds the "Automatisch Tracé Aanvragen" button
export function bindCreateTraceProjectButton() {
  const btn = document.getElementById("createTraceProjectBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    // Leid de gebruiker naar de trace aanvragen pagina
    window.location.href = "./intekenen.html";
  });
}
