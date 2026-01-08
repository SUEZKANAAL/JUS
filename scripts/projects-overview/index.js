import { bindCreateTraceProjectButton } from "./actions/bindCreateTraceProjectButton.js";
import { initProjectsLoader } from "./features/initProjectsLoader.js";
import { initPagination } from "./features/initPagination.js";
import { initFilters } from "./features/initFilters.js";
import { fetchMembersCount, showMembersPopup, initAddMember  } from "./features/initMembers.js";
import * as projectsOverviewState from "./state.js";
import { initTraceModal } from "./features/initTraceModal.js";
import { initDownloadModal } from "./features/initDownloadModal.js";
import { openDownloadModal } from "./ui/downloadModal.js";
import { getAllProjects } from "./state.js";
import { initTraceEntries } from "./features/initTraceEntries.js";
import { addTraceEntry } from "./ui/traceEntries.js";
import { initTraceUpload } from "./features/initTraceUpload.js";



// REMOVE LATER
window.__projectsOverviewState = projectsOverviewState;
window.__projectsOverviewAddTraceEntry = addTraceEntry;

document.addEventListener("DOMContentLoaded", () => {
  window.__projectsOverviewServices = window.__projectsOverviewServices || {};
  window.__projectsOverviewServices.fetchMembersCount = fetchMembersCount;
  window.__projectsOverviewServices.showMembersPopup = showMembersPopup;

  bindCreateTraceProjectButton();
  initProjectsLoader();
  initPagination();
  initFilters();
  initAddMember();
  initTraceModal();
  initDownloadModal();
  initTraceEntries();
  initTraceUpload();

  window.__projectsOverviewServices.openDownloadModal = (projectId) => {
    const project = getAllProjects().find((p) => String(p.id) === String(projectId));
    if (!project) return;
    openDownloadModal(project);
  };
});
