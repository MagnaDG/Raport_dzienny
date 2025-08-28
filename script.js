// Kody przypisane do linii
const kodyLinii = {
  MP4: ["K01", "K02", "K03", "K04"],
  M4:  ["M41", "M42", "M43", "M44"],
  NHL: ["N1", "N2", "N3"]
};

// Uzupełnia wszystkie selecty .kod-select kodami dla wybranej linii
function updateKodSelects(linia) {
  const selects = document.querySelectorAll(".kod-select");
  selects.forEach(sel => {
    sel.innerHTML = ""; // czyścimy stare opcje
    const list = kodyLinii[linia] || [];
    list.forEach(kod => {
      const opt = document.createElement("option");
      opt.value = kod;
      opt.textContent = kod;
      sel.appendChild(opt);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const liniaSelect = document.getElementById("linia");

  // Inicjalne wypełnienie KOD na starcie
  updateKodSelects(liniaSelect.value);

  // Zmiana linii -> aktualizacja KOD we wszystkich wierszach
  liniaSelect.addEventListener("change", (e) => {
    updateKodSelects(e.target.value);
  });
});
