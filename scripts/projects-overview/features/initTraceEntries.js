import { addTraceEntry } from "../ui/traceEntries.js";

export function initTraceEntries() {
  document.getElementById("addTraceEntryBtn")?.addEventListener("click", addTraceEntry);
}
