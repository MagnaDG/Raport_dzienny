document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("table-body");
  const liniaSelect = document.getElementById("linia");
  const addRowBtn = document.getElementById("add-row");

  const data = {
    "MP4": { "MP4-101": 12, "MP4-102": 15, "MP4-103": 18 },
    "M4":  { "M4-201": 10, "M4-202": 20 },
    "NHL": { "NHL-301": 8, "NHL-302": 14, "NHL-303": 16 }
  };

  // Funkcja tworząca wiersz
  function createRow() {
    const tr = document.createElement("tr");

    for (let i = 0; i < 29; i++) {
      const td = document.createElement("td");

      if (i === 11) { // kolumna KOD
        const select = document.createElement("select");
        select.classList.add("kod-select");

        // wypełnienie od razu opcjami
        const line = liniaSelect.value;
        if (line && data[line]) {
          Object.keys(data[line]).forEach(code => {
            const opt = document.createElement("option");
            opt.value = code;
            opt.textContent = code;
            select.appendChild(opt);
          });
        }

        // event zmiany KOD → Tt NOM
        select.addEventListener("change", () => {
          const code = select.value;
          const line = liniaSelect.value;
          tr.children[8].textContent = code ? data[line][code] : "";
        });

        td.appendChild(select);

      } else {
        td.contentEditable = true;
      }

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  // Początkowe 8 wierszy
  for (let i = 0; i < 8; i++) createRow();

  // Aktualizacja list KOD po zmianie linii
  liniaSelect.addEventListener("change", () => {
    document.querySelectorAll(".kod-select").forEach(select => {
      const currentValue = select.value;
      select.innerHTML = ""; // wyczyść

      const line = liniaSelect.value;
      if (line && data[line]) {
        Object.keys(data[line]).forEach(code => {
          const opt = document.createElement("option");
          opt.value = code;
          opt.textContent = code;
          select.appendChild(opt);
        });
      }

      select.value = currentValue || "";
    });
  });

  // Dodawanie wiersza
  addRowBtn.addEventListener("click", createRow);
});
