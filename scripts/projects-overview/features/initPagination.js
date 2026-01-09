import {
  getTotalPages,
  getCurrentPage,
  setCurrentPage,
} from "../state.js";
import { loadProjects } from "./initProjectsLoader.js";

export function initPagination() {
  const firstPageBtn = document.getElementById("firstPageBtn");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
  const lastPageBtn = document.getElementById("lastPageBtn");

  if (firstPageBtn) {
    firstPageBtn.addEventListener("click", () => {
      setCurrentPage(1);
      loadProjects();
    });
  }

  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      const currentPage = getCurrentPage();
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        loadProjects();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      const currentPage = getCurrentPage();
      const totalPages = getTotalPages();
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        loadProjects();
      }
    });
  }

  if (lastPageBtn) {
    lastPageBtn.addEventListener("click", () => {
      const totalPages = getTotalPages();
      if (totalPages > 0) {
        setCurrentPage(totalPages);
        loadProjects();
      }
    });
  }
}
