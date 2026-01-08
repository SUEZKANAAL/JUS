import * as projectsOverviewState from "./state.js";
import { bindCreateTraceProjectButton } from "./actions/bindCreateTraceProjectButton.js"; 
import { initProjectsLoader } from "./features/initProjectsLoader.js";
import { renderProjects } from "./ui/renderProjects.js";
import { initPagination } from "./features/initPagination.js";
import { initFilters } from "./features/initFilters.js";


document.addEventListener("DOMContentLoaded", () => {
  bindCreateTraceProjectButton();
  initProjectsLoader();
  initPagination();
  initFilters();
});