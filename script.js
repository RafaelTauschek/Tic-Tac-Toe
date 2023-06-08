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

const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Kombinationen
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Kombinationen
    [0, 4, 8], [2, 4, 6] // Diagonale Kombinationen
  ];

function init() {
    render();
}

function checkGameOver() {
    for (const combination of winCombinations) {
    const [a, b, c] = combination;
    if (
      fields[a] !== null &&
      fields[a] === fields[b] &&
      fields[b] === fields[c]
    ) {
      drawWinningLine(a, b, c);
      return true; // Das Spiel ist vorbei
    }
  }

  // Unentschieden prüfen
  if (fields.every(field => field !== null)) {
    // Unentschieden
    return true; // Das Spiel ist vorbei
  }

  return false; // Das Spiel ist noch nicht vorbei
}

function render() {
    const contentDiv = document.getElementById('content');  //content div = HTML ID 'content'
    let tableHTML = '<table>';   //tableHTML = HTMLElement Table
    let index = 0;  // Index = 0

    // Iteration über die Zeilen
    for (let i = 0; i < 3; i++) {  //Index = 0, wird ausgeführt solange i kleiner als 3 ist, nach jeder ausführung um 1 erhöht
        tableHTML += '<tr>';  //in der Table wird jedes mal eine Tabellen-Zeile angelegt (Ergo 3x (0, 1, 2))
        // Iteration über die Spalten
        for (let j = 0; j < 3; j++) { // Index = 0, wird ausgeeführt , solange i kleiner ist als 3, nach jeder ausführung um 1 erhöht
                                    // In der Tabelle wird jedes mal eine Tabellen-Spalte angelegt (Ergo x3 (0, 1, 2))
            tableHTML += '<td onclick="handleCellClick(' + index + ')">';  //Verkettungsoperator
            // Prüfen, ob das Feld leer ist
            if (fields[index] === null) {  // Wenn: Array[jeweilige Indexstelle] = 0 ist
                tableHTML += ''; //Dann: Tabellen-"Kasten" -> Leer
            } else { //Sonst
                // Setzen des Feldwertes (Kreis oder Kreuz)   
                //Tenärer Operator: Bedingung ? Ausdruck 1 : Ausdruck 2 = ergibt entweder 'true' oder 'false'
                tableHTML += fields[index] === 'circle' ? generateCircleSVG() : generateCrossSVG(); // Wenn Indexstelle im Array = 'circle' = true, dann wird ein Kreis generiert
            }                                                                                       //Wenn Indexstelle im Array = 'circle' = 'false' dann wird ein X generiert
            tableHTML += '</td>'; //Der Tabelle wird das td angefügt
            index++; //Index wird um 1 erhöht
        }

        tableHTML += '</tr>'; //Der Tabelle wird das tr angefügt
    }

    tableHTML += '</table>'; // Das table-Tag wird dem HTML hinzugefügt

    // Setzen des generierten HTML-Codes in den contentDiv
    contentDiv.innerHTML = tableHTML; 
}

function drawWinningLine(a, b, c) {
    const lineColor = '#FFFFFF';
    const lineWidth = 5;
    const cellElements = document.getElementsByTagName('td');
  
    // Position der Zellen ermitteln
    const cellA = cellElements[a].getBoundingClientRect();
    const cellB = cellElements[b].getBoundingClientRect();
    const cellC = cellElements[c].getBoundingClientRect();
  
    // Position des Spielfelds ermitteln
    const contentDiv = document.getElementById('content');
    const contentRect = contentDiv.getBoundingClientRect();
  
    // Linie erzeugen
    const lineElement = document.createElement('div');
    lineElement.style.position = 'absolute';
    lineElement.style.backgroundColor = lineColor;
    lineElement.style.height = lineWidth + 'px';
  
    // Position der Linie festlegen
    const offsetX = contentRect.left + window.pageXOffset;
    const offsetY = contentRect.top + window.pageYOffset;
  
    // Berechnung der Start- und Endpunkte für die Linie
    const startX = cellA.left + cellA.width / 2 - offsetX;
    const startY = cellA.top + cellA.height / 2 - offsetY;
    const endX = cellC.left + cellC.width / 2 - offsetX;
    const endY = cellC.top + cellC.height / 2 - offsetY;
  
    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const angle = Math.atan2(endY - startY, endX - startX);
  
    lineElement.style.left = startX + 'px';
    lineElement.style.top = startY + 'px';
    lineElement.style.width = length + 'px';
    lineElement.style.transformOrigin = 'top left';
    lineElement.style.transform = `rotate(${angle}rad)`;
  
    // Linie zum Spielfeld hinzufügen
    contentDiv.style.position = 'relative';
    contentDiv.appendChild(lineElement);
  }


let currentPlayer = 'circle'; // Startspieler festlegen, Startwert: 'circle'

function handleCellClick(index) {
    if (fields[index] === null) {
      fields[index] = currentPlayer;
      const symbolHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
      const cellElement = document.getElementsByTagName('td')[index];
      cellElement.innerHTML = symbolHTML;
      cellElement.removeAttribute('onclick');
      currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
      
      if (checkGameOver()) {
        // Spiel ist vorbei
        // Hier können entsprechende Aktionen durchgeführt werden
        console.log('Spiel ist vorbei');
      }
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


