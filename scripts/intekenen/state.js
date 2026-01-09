// scripts/intekenen/state.js

export let map = null;
export function setMap(m) {
  map = m;
}

export let drawnItems = null;
export function setDrawnItems(fg) {
  drawnItems = fg;
}

export let currentDrawingType = null;
export function setCurrentDrawingType(type) {
  currentDrawingType = type;
}

export let currentDrawControl = null;
export function setCurrentDrawControl(ctrl) {
  currentDrawControl = ctrl;
}
