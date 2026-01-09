export function initLogout() {
  const btn = document.getElementById("logoutBtn");
  const navLogin = document.getElementById("navLogin");
  const navLogout = document.getElementById("navLogout");

  const token = localStorage.getItem("accessToken");

  if (token) {
    navLogin?.classList.add("d-none");
    navLogout?.classList.remove("d-none");
  } else {
    navLogout?.classList.add("d-none");
    navLogin?.classList.remove("d-none");
  }

  if (btn) {
    btn.onclick = () => {
      localStorage.clear();
      // Determine correct path based on current location
      const isInPagesFolder = window.location.pathname.includes('/pages/');
      const loginPath = isInPagesFolder ? './login.html' : './pages/login.html';
      window.location.href = loginPath;
    };
  }
}
