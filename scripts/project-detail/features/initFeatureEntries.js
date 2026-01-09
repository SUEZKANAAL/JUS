import { addFeatureEntry } from "../ui/featureEntries.js";

export function initFeatureEntries() {
  document.getElementById("addFeatureEntryBtn")?.addEventListener("click", addFeatureEntry);
}
