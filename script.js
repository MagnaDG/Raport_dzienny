document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("table-body");
  const liniaSelect = document.getElementById("linia");
  const addRowBtn = document.getElementById("add-row");

  // Wypełniamy select linii na podstawie reportData
  Object.keys(reportData).forEach(line => {
    const opt = document.createElement("option");
    opt.value = line;
    opt.textContent = line;
    liniaSelect.appendChild(opt);
  });

  // Funkcja tworzenia wiersza
  function createRow() {
    const tr = document.createElement("tr");
    for (let i = 0; i < 29; i++) {
      const td = document.createElement("td");
      if (i === 11) { // kolumna KOD
        const select = document.createElement("select");
        select.classList.add("kod-select");

        // wypełnienie od razu opcjami
        const line = liniaSelect.value;
        if (line && reportData[line]) {
          Object.keys(reportData[line]).forEach(code => {
            const opt = document.createElement("option");
            opt.value = code;
            opt.textContent = code;
            select.appendChild(opt);
          });
        }

        select.addEventListener("change", () => {
          const code = select.value;
          const line = liniaSelect.value;
          tr.children[8].textContent = code ? reportData[line][code] : "";
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

  // Zmiana linii aktualizuje listy KOD
  liniaSelect.addEventListener("change", () => {
    document.querySelectorAll(".kod-select").forEach(select => {
      const currentValue = select.value;
      select.innerHTML = "";
      const line = liniaSelect.value;
      if (line && reportData[line]) {
        Object.keys(reportData[line]).forEach(code => {
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
