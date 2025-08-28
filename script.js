document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("table-body");
  const liniaSelect = document.getElementById("linia");

  // Wczytaj dane JSON
  const response = await fetch("data.json");
  const data = await response.json();

  // Funkcja do tworzenia wierszy
  const createRow = () => {
    const tr = document.createElement("tr");
    for (let i = 0; i < 29; i++) {
      const td = document.createElement("td");

      if (i === 11) { // KOD
        const select = document.createElement("select");
        select.classList.add("kod-select");
        td.appendChild(select);

        select.addEventListener("change", () => {
          const chosenCode = select.value;
          const line = liniaSelect.value;
          if (line && chosenCode) {
            tr.children[8].textContent = data[line].codes[chosenCode]; // Tt NOM
          } else {
            tr.children[8].textContent = "";
          }
        });

      } else {
        td.contentEditable = true;
      }

      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  };

  // Stwórz 8 wierszy
  for (let i = 0; i < 8; i++) createRow();

  // Odświeżanie kodów po zmianie linii
  liniaSelect.addEventListener("change", () => {
    const line = liniaSelect.value;
    document.querySelectorAll(".kod-select").forEach(select => {
      select.innerHTML = "";
      if (line && data[line]) {
        Object.keys(data[line].codes).forEach(code => {
          const opt = document.createElement("option");
          opt.value = code;
          opt.textContent = code;
          select.appendChild(opt);
        });
      }
    });
  });
});
