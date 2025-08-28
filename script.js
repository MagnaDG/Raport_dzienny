document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("table-body");
  const liniaSelect = document.getElementById("linia");

  // Wczytaj dane z pliku JSON
  const response = await fetch("data.json");
  const data = await response.json();

  // Utwórz 8 wierszy
  for (let i = 0; i < 8; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < 29; j++) {
      const td = document.createElement("td");

      if (j === 11) { 
        // Kolumna "KOD"
        const select = document.createElement("select");
        select.classList.add("kod-select");
        td.appendChild(select);

        // Zdarzenie wyboru kodu -> wpisanie Tt NOM
        select.addEventListener("change", () => {
          const chosenCode = select.value;
          const line = liniaSelect.value;
          if (line && chosenCode) {
            const ttNom = data[line].codes[chosenCode];
            tr.children[8].textContent = ttNom; // kolumna Tt NOM (index 8)
          }
        });
      } else {
        td.contentEditable = true;
      }

      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  // Reagowanie na wybór linii – odświeżenie kodów
  liniaSelect.addEventListener("change", () => {
    const line = liniaSelect.value;
    const selects = document.querySelectorAll(".kod-select");

    selects.forEach(select => {
      select.innerHTML = ""; // wyczyść
      if (line && data[line]) {
        const codes = Object.keys(data[line].codes);
        codes.forEach(code => {
          const opt = document.createElement("option");
          opt.value = code;
          opt.textContent = code;
          select.appendChild(opt);
        });
      }
    });
  });
});
