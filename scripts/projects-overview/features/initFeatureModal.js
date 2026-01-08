import { closeFeatureModal } from "../ui/featureModal.js";

export function initFeatureModal() {
  const featureModal = document.getElementById("featureModal");
  const closeFeatureBtn = document.getElementById("closeFeatureModal");

  closeFeatureBtn?.addEventListener("click", closeFeatureModal);

  window.addEventListener("click", (event) => {
    if (event.target === featureModal) {
      closeFeatureModal();
    }
  });
}
