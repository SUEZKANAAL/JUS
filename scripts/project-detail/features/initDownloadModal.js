import { initDownloadModalClose, closeDownloadModal } from "../ui/downloadModal.js";

export function initDownloadModal() {
  initDownloadModalClose();

  const downloadModal = document.getElementById("downloadModal");

  window.addEventListener("click", (event) => {
    if (event.target === downloadModal) {
      closeDownloadModal();
    }
  });
}
