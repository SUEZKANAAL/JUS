import { closeTraceModal } from "../ui/traceModal.js";

export function initTraceModal() {
  document.getElementById("closeModal")?.addEventListener("click", closeTraceModal);
}
