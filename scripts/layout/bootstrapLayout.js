import { initCurrentUser } from "../auth/ui/currentUser.js";
import { initLogout } from "../auth/ui/logout.js";

function applyNavbarShrinkBehavior() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  const shrink = () => {
    if (window.scrollY === 0) nav.classList.remove("navbar-shrink");
    else nav.classList.add("navbar-shrink");
  };

  shrink(); // run once right now
  window.addEventListener("scroll", shrink);
}

async function loadNavbar() {
  const host = document.getElementById("app-navbar");
  if (!host) return;

  // Determine the correct path to navbar.html based on current page location
  const isInPagesFolder = window.location.pathname.includes('/pages/');
  const navbarPath = isInPagesFolder ? '../scripts/layout/navbar.html' : './scripts/layout/navbar.html';
  
  const res = await fetch(navbarPath);
  let navbarHtml = await res.text();

  // Fix paths in navbar based on current page location
  const pathPrefix = isInPagesFolder ? '../' : './';

  // Replace navbar links with correct relative paths
  navbarHtml = navbarHtml
    .replace(/href="pages\//g, `href="${pathPrefix}pages/`)
    .replace(/href="index\.html/g, `href="${pathPrefix}index.html`);

  host.innerHTML = navbarHtml;

  applyNavbarShrinkBehavior();

  initCurrentUser();
  initLogout();
}

document.addEventListener("DOMContentLoaded", loadNavbar);
