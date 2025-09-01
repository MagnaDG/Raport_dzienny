document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu-button");
    const menuModal = document.getElementById("menu-modal");
    const closeButton = document.querySelector(".close-button");
    const editDataButton = document.getElementById("edit-data-button");
    const editSection = document.getElementById("edit-section");
    const backButton = document.getElementById("back-button");
    const saveDataButton = document.getElementById("save-data-button");
    const reportTable = document.getElementById("report-table").querySelector("tbody");
    const editTableContainer = document.getElementById("edit-table-container");

    // Otwieranie modala
    menuButton.addEventListener("click", () => {
        menuModal.classList.remove("hidden");
    });

    // Zamknięcie modala
    closeButton.addEventListener("click", () => {
        menuModal.classList.add("hidden");
    });

    // Edytuj dane
    editDataButton.addEventListener("click", () => {
        menuModal.classList.add("hidden");
        editSection.classList.remove("hidden");

        // Tworzymy prostą tabelę edycyjną (na razie pustą)
        editTableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Godz.</th>
                        <th>OEE</th>
                        <th>KOD</th>
                        <th>OK</th>
                        <th>NOK</th>
                        <th>CC</th>
                        <th>CZAS</th>
                        <th>DANE1</th>
                        <th>DANE2</th>
                        <th>DANE3</th>
                        <th>DANE4</th>
                        <th>DANE5</th>
                        <th>DANE6</th>
                        <th>DANE7</th>
                        <th>DANE8</th>
                        <th>DANE9</th>
                        <th>DANE10</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" value=""></td>
                        <td><input type="text" value=""></td>
                        <td><input type="text" value=""></td>
                        <td><input type="number" value=""></td>
                        <td><input type="number" value=""></td>
                        <td><input type="text" value=""></td>
                        <td><input type="text" value=""></td>
                        <td><input type="text" value=""></td>
                        <td><input type="text" value=""></td>
                        <td><input type="text" value=""></td>
                        <td><input type="text" value=""></td>
                        <td><input type="text" value=""></td>
                        <td><input type="text" value=""></td>
                        <td><input type="text" value=""></td>
                        <td><input type="text" value=""></td>
                        <td><input type="text" value=""></td>
                        <td><input type="text" value=""></td>
                    </tr>
                </tbody>
            </table>
        `;
    });

    // Powrót
    backButton.addEventListener("click", () => {
        editSection.classList.add("hidden");
    });

    // Zapis danych (na razie tylko pobranie z inputów i wrzucenie do tabeli raportu)
    saveDataButton.addEventListener("click", () => {
        const inputs = editTableContainer.querySelectorAll("input");
        const newRow = document.createElement("tr");

        inputs.forEach(input => {
            const td = document.createElement("td");
            td.textContent = input.value;
            newRow.appendChild(td);
        });

        reportTable.appendChild(newRow);
        editSection.classList.add("hidden");
    });
});
