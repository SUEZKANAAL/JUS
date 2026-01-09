export function addFeatureEntry() {
  const container = document.getElementById("featureEntriesContainer");
  const div = document.createElement("div");

  div.classList.add("feature-entry");
  div.style.border = "1px solid #ccc";
  div.style.padding = "10px";
  div.style.marginBottom = "10px";

  div.innerHTML = `
    <div>
      <label>Feature Naam:</label>
      <input type="text" class="feature-name form-control" required/>
    </div>
    <div>
      <label>Omschrijving:</label>
      <textarea class="feature-desc form-control"></textarea>
    </div>
    <div>
      <label>GeoJSON Bestand:</label>
      <input type="file" class="feature-geojson" accept=".json,.geojson" required/>
    </div>
    <button type="button" class="btn btn-danger btn-sm remove-feature-entry mt-2">Remove</button>
  `;

  container.appendChild(div);

  div.querySelector(".remove-feature-entry")?.addEventListener("click", () => {
    div.remove();
  });
}
