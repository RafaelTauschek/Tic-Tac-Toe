let fields = [
    null,
    'circle',
    null,
    'circle',
    null,
    null,
    'cross',
    'cross',
    null
];

function init() {
    render();
}

function render() {

    const contentDiv = document.getElementById('content');
    let tableHTML = '<table>';
    let index = 0;

    // Iteration über die Zeilen
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        // Iteration über die Spalten
        for (let j = 0; j < 3; j++) {
            tableHTML += '<td>';
            // Prüfen, ob das Feld leer ist
            if (fields[index] === null) {
                tableHTML += '';
            } else {
                // Setzen des Feldwertes (Kreis oder Kreuz)
                tableHTML += fields[index] === 'circle' ? 'O' : 'X';
            }
            tableHTML += '</td>';
            index++;
        }

        tableHTML += '</tr>';
    }

    tableHTML += '</table>';

    // Setzen des generierten HTML-Codes in den contentDiv
    contentDiv.innerHTML = tableHTML;
}