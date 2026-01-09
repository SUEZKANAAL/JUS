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

  const res = await fetch("/scripts/layout/navbar.html");
  host.innerHTML = await res.text();

  applyNavbarShrinkBehavior();

  initCurrentUser();
  initLogout();
}

document.addEventListener("DOMContentLoaded", loadNavbar);
