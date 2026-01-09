export function initToggleHulplijnButton() {
  const toggleButton = document.getElementById("toggleButton");
  const drawHulplijn = document.getElementById("drawHulplijn");

  if (!toggleButton || !drawHulplijn) return;

  toggleButton.addEventListener("click", () => {
    drawHulplijn.style.display =
      drawHulplijn.style.display === "none" ? "block" : "none";
  });
}
