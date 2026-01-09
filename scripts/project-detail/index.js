import { initProjectLoader } from "./features/initProjectLoader.js";
import { initAddMember, showMembersPopup } from "./features/initMembers.js";
import { initTraceModal } from "./features/initTraceModal.js";
import { initTraceEntries } from "./features/initTraceEntries.js";
import { initTraceUpload } from "./features/initTraceUpload.js";
import { initFeatureModal } from "./features/initFeatureModal.js";
import { initFeatureEntries } from "./features/initFeatureEntries.js";
import { initFeatureUpload } from "./features/initFeatureUpload.js";
import { initDownloadModal } from "./features/initDownloadModal.js";
import { initActions } from "./features/initActions.js";
import { initCurrentUser } from "../auth/ui/currentUser.js";

document.addEventListener("DOMContentLoaded", () => {
  initProjectLoader();
  initAddMember();
  initTraceModal();
  initTraceEntries();
  initTraceUpload();
  initFeatureModal();
  initFeatureEntries();
  initFeatureUpload();
  initDownloadModal();
  initActions();
  initCurrentUser();
});
