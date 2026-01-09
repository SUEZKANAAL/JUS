import { closeFeatureModal } from "../ui/featureModal.js";

export function initFeatureModal() {
  const featureModal = document.getElementById("featureModal");
  const closeBtn = document.getElementById("closeFeatureModal");

  closeBtn?.addEventListener("click", closeFeatureModal);

  window.addEventListener("click", (event) => {
    if (event.target === featureModal) {
      closeFeatureModal();
    }
  });
}
