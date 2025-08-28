// Definicja kodów dla każdej linii
const kodyLinii = {
  MP4: ["K01", "K02", "K03"],
  M4: ["M41", "M42", "M43", "M44"],
  NHL: ["N1", "N2", "N3"]
};

// Funkcja do wypełnienia selectów "KOD"
function updateKodSelects(linia) {
  const selects = document.querySelectorAll(".kod-select");
  selects.forEach(sel => {
    sel.innerHTML = ""; // wyczyść stare opcje
    if (kodyLinii[linia]) {
      kodyLinii[linia].forEach(kod => {
        const opt = document.createElement("option");
        opt.value = kod;
        opt.textContent = kod;
        sel.appendChild(opt);
      });
    }
  });
}

// Start – domyślna linia MP4
document.addEventListener("DOMContentLoaded", () => {
  const liniaSelect = document.getElementById("linia");
  updateKodSelects(liniaSelect.value);

  // Zmiana linii = zmiana listy w kolumnie "KOD"
  liniaSelect.addEventListener("change", e => {
    updateKodSelects(e.target.value);
  });
});
