import { bindCreateTraceProjectButton } from "./actions/bindCreateTraceProjectButton.js"; 
import { initProjectsLoader } from "./features/initProjectsLoader.js";
import { renderProjects } from "./ui/renderProjects.js";
import { initPagination } from "./features/initPagination.js";


document.addEventListener("DOMContentLoaded", () => {
  window.__projectsOverviewRenderProjects = renderProjects;

  bindCreateTraceProjectButton();
  initProjectsLoader();
  initPagination()
});