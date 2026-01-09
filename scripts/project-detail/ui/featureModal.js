export function openFeatureModal(project) {
  document.getElementById("featureModalProjectName").innerText =
    `Project: ${project.project_name}`;
  document.getElementById("featureModal").style.display = "flex";
}

export function closeFeatureModal() {
  const featureModal = document.getElementById("featureModal");
  if (featureModal) featureModal.style.display = "none";
}
