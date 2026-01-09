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
import { initFeatureEntries } from "./features/initFeatureEntries.js";
import { initFeatureUpload } from "./features/initFeatureUpload.js";
import { initFeatureModal } from "./features/initFeatureModal.js";
import { initStandaloneProjectModal } from "./features/initStandaloneProjectModal.js";
import { initCurrentUser } from "../auth/ui/currentUser.js";



document.addEventListener("DOMContentLoaded", () => {
  bindCreateTraceProjectButton();
  initProjectsLoader();
  initPagination();
  initFilters();
  initAddMember();
  initTraceModal();
  initDownloadModal();
  initTraceEntries();
  initTraceUpload();
  initFeatureEntries();
  initFeatureUpload();
  initFeatureModal();
  initStandaloneProjectModal();
  initCurrentUser();
});
