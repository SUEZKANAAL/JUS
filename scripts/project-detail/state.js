const state = {
  currentProject: null,
  projectId: null,
};

export function getState() {
  return state;
}

export function setProject(project) {
  state.currentProject = project;
}

export function getProject() {
  return state.currentProject;
}

export function setProjectId(id) {
  state.projectId = id;
  if (state.currentProject) {
    // Also update project ID in project data if available
    if (state.currentProject.project) {
      state.currentProject.project.id = id;
    }
  }
}

export function getProjectId() {
  return state.projectId;
}
