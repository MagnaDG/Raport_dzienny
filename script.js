document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("table-body");
  const liniaSelect = document.getElementById("linia");
  const addRowBtn = document.getElementById("add-row");

  const data = {
    "MP4": { "MP4-101": 12, "MP4-102": 15, "MP4-103": 18 },
    "M4":  { "M4-201": 10, "M4-202": 20 },
    "NHL": { "NHL-301": 8, "NHL-302": 14, "NHL-303": 16 }
  };

  function createRow() {
    const tr = document.createElement("tr");
    for (let i = 0; i < 29; i++) {
      const td = document.createElement("td");
      if (i === 11) { // kolumna KOD
        const select = document.createElement("select");
        select.classList.add("kod-select");
        td.appendChild(select);

        select.addEventListener("change", () => {
          const line = liniaSelect.value;
          const code = select.value;
          tr.children[8].textContent = code ? data[line][code] : "";
        });

      } else {
        td.contentEditable = true;
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
    updateKodOptions();
  }

  function updateKodOptions() {
    const line = liniaSelect.value;
    document.querySelectorAll(".kod-select").forEach(select => {
      const currentValue = select.value;
      select.innerHTML = "";
      if (line && data[line]) {
        Object.keys(data[line]).forEach(code => {
          const opt = document.createElement("option");
          opt.value = code;
          opt.textContent = code;
          select.appendChild(opt);
        });
        select.value = currentValue || "";
      }
    });
  }

  // początkowe 8 wierszy
  for (let i = 0; i < 8; i++) createRow();

  // zmiana linii
  liniaSelect.addEventListener("change", updateKodOptions);

  // dodawanie wiersza
  addRowBtn.addEventListener("click", createRow);
});
