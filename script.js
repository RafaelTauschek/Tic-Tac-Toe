let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
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
            tableHTML += '<td onclick="handleCellClick(' + index + ')">';
            // Prüfen, ob das Feld leer ist
            if (fields[index] === null) {
                tableHTML += '';
            } else {
                // Setzen des Feldwertes (Kreis oder Kreuz)
                tableHTML += fields[index] === 'circle' ? generateCircleSVG() : generateCrossSVG();
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

let currentPlayer = 'circle'; // Startspieler festlegen

function handleCellClick(index) {
    // Prüfen, ob das Feld bereits belegt ist
    if (fields[index] === null) {
        // Setzen des aktuellen Spielers
        fields[index] = currentPlayer;
        // HTML-Code für das entsprechende Symbol generieren
        const symbolHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        // HTML-Code in das angeklickte <td>-Element einfügen
        const cellElement = document.getElementsByTagName('td')[index];
        cellElement.innerHTML = symbolHTML;
        // onclick-Funktion von dem <td>-Element entfernen
        cellElement.removeAttribute('onclick');
        // Wechsel zum nächsten Spieler
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    }
}


function generateCircleSVG() {
    const circleColor = '#00B0EF';
    const width = 70;
    const height = 70;
    const radius = width / 2;
    const circumference = 2 * Math.PI * radius;
  
    // SVG-Code generieren
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <circle cx="${width / 2}" cy="${height / 2}" r="${radius - 2.5}" fill="transparent" stroke="${circleColor}" stroke-width="5" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}">
        <animate attributeName="stroke-dashoffset" from="${circumference}" to="0" dur="250ms" fill="freeze" begin="0s" />
      </circle>
    </svg>`;
  
    return svgCode;
  }

function generateCrossSVG() {
    const crossColor = '#FFC000';
    const width = 70;
    const height = 70;

    // SVG-Code generieren
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <line x1="0" y1="0" x2="${width}" y2="${height}" stroke="${crossColor}" stroke-width="5">
        <animate attributeName="stroke-dasharray" from="0 ${width}" to="${width} 0" dur="250ms" fill="freeze" />
      </line>
      <line x1="${width}" y1="0" x2="0" y2="${height}" stroke="${crossColor}" stroke-width="5">
        <animate attributeName="stroke-dasharray" from="0 ${width}" to="${width} 0" dur="250ms" fill="freeze" />
      </line>
    </svg>`;

    return svgCode;
}


