import { closeTraceModal } from "../ui/traceModal.js";

export function initTraceModal() {
  const traceModal = document.getElementById("traceModal");
  const closeBtn = document.getElementById("closeModal");

  closeBtn?.addEventListener("click", closeTraceModal);

  window.addEventListener("click", (event) => {
    if (event.target === traceModal) {
      closeTraceModal();
    }
  });
}
