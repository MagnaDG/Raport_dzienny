document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("table-body");
  const liniaSelect = document.getElementById("linia");

  // WSZYSTKIE DANE: linia -> kody -> Tt NOM
  const data = {
    "MP4": { "codes": { "MP4-101": 12, "MP4-102": 15, "MP4-103": 18 } },
    "M4":  { "codes": { "M4-201": 10, "M4-202": 20 } },
    "NHL": { "codes": { "NHL-301": 8, "NHL-302": 14, "NHL-303": 16 } }
  };

  // Funkcja tworząca wiersz
  const createRow = () => {
    const tr = document.createElement("tr");
    for (let i = 0; i < 29; i++) {
      const td = document.createElement("td");

      if (i === 11) { // KOD
        const select = document.createElement("select");
        select.classList.add("kod-select");
        td.appendChild(select);

        // Aktualizacja Tt NOM po wyborze kodu
        select.addEventListener("change", () => {
          const code = select.value;
          const line = liniaSelect.value;
          tr.children[8].textContent = code ? data[line].codes[code] : "";
        });

      } else {
        td.contentEditable = true;
      }

      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  };

  // Tworzymy 8 wierszy
  for (let i = 0; i < 8; i++) createRow();

  // Aktualizacja list KOD po zmianie linii
  liniaSelect.addEventListener("change", () => {
    const line = liniaSelect.value;
    const kodSelects = document.querySelectorAll(".kod-select");
    kodSelects.forEach(select => {
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

  // Opcjonalnie: od razu wypełnij KOD dla pierwszej linii
  if (liniaSelect.value) liniaSelect.dispatchEvent(new Event("change"));
});
