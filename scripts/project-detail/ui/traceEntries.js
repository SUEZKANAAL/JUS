export function addTraceEntry() {
  const container = document.getElementById("traceEntriesContainer");
  const div = document.createElement("div");

  div.classList.add("trace-entry");
  div.style.border = "1px solid #ccc";
  div.style.padding = "10px";
  div.style.marginBottom = "10px";

  div.innerHTML = `
    <div>
      <label>Trace Naam:</label>
      <input type="text" class="trace-name form-control" required/>
    </div>
    <div>
      <label>Omschrijving:</label>
      <textarea class="trace-desc form-control" required></textarea>
    </div>
    <div>
      <label>GeoJSON Bestand:</label>
      <input type="file" class="trace-geojson" accept=".json,.geojson" required/>
    </div>
    <button type="button" class="btn btn-danger btn-sm remove-trace-entry mt-2">Remove</button>
  `;

  container.appendChild(div);

  div.querySelector(".remove-trace-entry")?.addEventListener("click", () => {
    div.remove();
  });
}
