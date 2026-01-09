// scripts/intekenen/actions/bindTraceAanvragenButton.js

import { drawnItems } from "../state.js";
import { createAutomaticTrace } from "../api/createAutomaticTrace.js";
import { toWKT } from "../draw/wkt.js"; // if you already migrated WKT here

export function bindTraceAanvragenButton() {
  const btn = document.getElementById("downloadButton");
  if (!btn) return;

  btn.addEventListener("click", sendAPIPostRequest);
}

function sendAPIPostRequest() {
  let projectgebiedWKT = null;
  let startEindPuntWKT = [];

  if (!drawnItems) {
    Swal.fire({
      icon: "error",
      title: "Fout",
      text: "Kaart is nog niet klaar (drawnItems ontbreekt).",
    });
    return;
  }

  drawnItems.eachLayer((layer) => {
    const wkt = toWKT(layer);
    if (!wkt) return;

    if (layer.type === "projectgebiedWKT") projectgebiedWKT = wkt;
    if (layer.type === "startEindPuntWKT") startEindPuntWKT.push(wkt);
  });

  if (!projectgebiedWKT || startEindPuntWKT.length < 2) {
    Swal.fire({
      icon: "error",
      title: "Fout",
      text: "Projectgebied en start en eindpunt zijn verplicht.",
    });
    return;
  }

  const modalContent = document
    .getElementById("project-modal-content")
    ?.cloneNode(true);

  if (!modalContent) {
    Swal.fire({
      icon: "error",
      title: "Fout",
      text: "Modal content niet gevonden (#project-modal-content).",
    });
    return;
  }

  modalContent.style.display = "block";

  // Attach slider listeners dynamically
  modalContent.querySelectorAll("input[type=range]").forEach((slider) => {
    const span = modalContent.querySelector(`#${slider.id}Value`);
    if (!span) return;
    slider.addEventListener("input", () => {
      span.textContent = slider.value;
    });
  });

  Swal.fire({
    html: modalContent,
    width: 600,
    showCancelButton: true,
    confirmButtonText: "Versturen",
    cancelButtonText: "Annuleren",
    focusConfirm: false,
    preConfirm: () => {
      const getValue = (id) => modalContent.querySelector(`#${id}`)?.value ?? "";

      const projectName = getValue("projectName").trim();
      const projectNumber = getValue("projectNumber").trim();

      if (!projectName || !projectNumber) {
        Swal.showValidationMessage("Projectnaam en projectnummer zijn verplicht");
        return false;
      }

      return {
        projectName: projectName.replace(/[^a-zA-Z0-9_-]/g, "_"),
        projectNumber: projectNumber.replace(/[^a-zA-Z0-9_-]/g, "_"),
        klicFile: getValue("klicFile"),
        PrivaatBedrijfWegen: getValue("PrivaatBedrijfWegen"),
        geulbreedte: getValue("geulbreedte"),
        geslotenVerharding: getValue("geslotenVerharding"),
        openVerharding: getValue("openVerharding"),
        halfVerhard: getValue("halfVerhard"),
        onverhard: getValue("onverhard"),
        groenvoorzieningLaag: getValue("groenvoorzieningLaag"),
        groenvoorzieningHoog: getValue("groenvoorzieningHoog"),
        groenvoorzieningBos: getValue("groenvoorzieningBos"),
        nogo: getValue("nogo"),
        klicDrukte: getValue("klicDrukte"),
        waterkering: getValue("waterkering"),
        natura2000: getValue("natura2000"),
        BuisLeidingGevaarlijkeInhoud: getValue("BuisLeidingGevaarlijkeInhoud"),
        GasHogeDruk: getValue("GasHogeDruk"),
        GasLageDruk: getValue("GasLageDruk"),
        Hoogspanning: getValue("Hoogspanning"),
      };
    },
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    const data = result.value;

    const payload = {
      projectName: `${data.projectName}_${data.projectNumber}`,
      traceInputFeatures: {
        projectgebiedWKT,
        startEindPuntWKT,
      },
      parameters: {
        geulbreedte: data.geulbreedte,
        klicFile: data.klicFile,
        PrivaatBedrijfWegen: data.PrivaatBedrijfWegen,
        geslotenVerharding: data.geslotenVerharding,
        openVerharding: data.openVerharding,
        halfVerhard: data.halfVerhard,
        onverhard: data.onverhard,
        groenvoorzieningLaag: data.groenvoorzieningLaag,
        groenvoorzieningHoog: data.groenvoorzieningHoog,
        groenvoorzieningBos: data.groenvoorzieningBos,
        nogo: data.nogo,
        klicDrukte: data.klicDrukte,
        waterkering: data.waterkering,
        natura2000: data.natura2000,
        BuisLeidingGevaarlijkeInhoud: data.BuisLeidingGevaarlijkeInhoud,
        GasHogeDruk: data.GasHogeDruk,
        GasLageDruk: data.GasLageDruk,
        Hoogspanning: data.Hoogspanning,
      },
    };

    try {
      const resultData = await createAutomaticTrace(payload);

      Swal.fire({
        icon: "success",
        title: "Project aangemaakt",
        text: `Project ID: ${resultData.project_id}`,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Fout",
        text: err?.message ?? "Onbekende fout",
      });
    }
  });
}
