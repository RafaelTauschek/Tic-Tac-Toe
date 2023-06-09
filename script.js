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

let audio_draw = new Audio('audio/draw.mp3');
let audio_end = new Audio('audio/end.mp3');
let currentPlayer = 'cross';
const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Kombinationen
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Kombinationen
    [0, 4, 8], [2, 4, 6] // Diagonale Kombinationen
];


function init() {
    render();
    renderSymbols();
}


function render() {
    const contentDiv = document.getElementById('content');
    const tableHTML = generateTableHTML();
    contentDiv.innerHTML = tableHTML;
    renderSymbols();
}


function render() {
    const contentDiv = document.getElementById('content');
    const tableHTML = generateTableHTML();
    contentDiv.innerHTML = tableHTML;
    renderSymbols();
}


function generateTableHTML() {
    let tableHTML = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            tableHTML += generateCellHTML(i * 3 + j);
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    return tableHTML;
}


function generateCellHTML(index) {
    let cellHTML = '<td onclick="handleCellClick(' + index + ')">';
    if (fields[index] === null) {
        cellHTML += '';
    } else {
        cellHTML += fields[index] === 'circle' ? generateCircleSVG() : generateCrossSVG();
    }
    cellHTML += '</td>';
    return cellHTML;
}


function renderSymbols() {
    let crossSymbol = document.getElementById('cross');
    let circleSymbol = document.getElementById('circle');
    crossSymbol.innerHTML = generateCrossSVG();
    circleSymbol.innerHTML = generateCircleSVG();
    if (currentPlayer === 'circle') {
        crossSymbol.classList.add('inactive');
        circleSymbol.classList.remove('inactive');
    } else {
        crossSymbol.classList.remove('inactive');
        circleSymbol.classList.add('inactive');
    }
}


function restartGame() {
    fields.fill(null);
    currentPlayer = 'cross';
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
            return true;
        }
    }
    if (fields.every(field => field !== null)) {
        return true;
    }
    return false;
}


function handleCellClick(index) {
    if (!checkGameOver() && fields[index] === null) {
        fields[index] = currentPlayer;
        const symbolHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        const cellElement = document.getElementsByTagName('td')[index];
        cellElement.innerHTML = symbolHTML;
        cellElement.removeAttribute('onclick');
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
        audio_draw.play();
        renderSymbols();
        if (checkGameOver()) {
            audio_end.play();
        }
    }
}


function drawWinningLine(a, b, c) {
    const { lineColor, lineWidth, cellElements, contentDiv } = getLineSetup();
    const { cellA, cellB, cellC, contentRect } = determineCellPosition(a, b, c, cellElements, contentDiv);
    const { lineElement } = generateLine(lineColor, lineWidth, contentDiv);
    const { offsetX, offsetY } = linePosition(contentRect);
    const { startX, startY, endX, endY, length, angle } = calculateStartandEndPoint(cellA, cellB, cellC, offsetX, offsetY);
    styleLineHTML(lineElement, contentDiv, startX, startY, length, angle);
}


function getLineSetup() {
    const lineColor = '#FFFFFF';
    const lineWidth = 5;
    const cellElements = document.getElementsByTagName('td');
    const contentDiv = document.getElementById('content');
    return { lineColor, lineWidth, cellElements, contentDiv };
}


function determineCellPosition(a, b, c, cellElements, contentDiv) {
    const cellA = cellElements[a].getBoundingClientRect();
    const cellB = cellElements[b].getBoundingClientRect();
    const cellC = cellElements[c].getBoundingClientRect();
    const contentRect = contentDiv.getBoundingClientRect();
    return { cellA, cellB, cellC, contentRect };
}


function generateLine(lineColor, lineWidth, contentDiv) {
    const lineElement = document.createElement('div');
    lineElement.style.position = 'absolute';
    lineElement.style.backgroundColor = lineColor;
    lineElement.style.height = lineWidth + 'px';
    contentDiv.appendChild(lineElement);
    return { lineElement };
}


function linePosition(contentRect) {
    const offsetX = contentRect.left + window.pageXOffset;
    const offsetY = contentRect.top + window.pageYOffset;
    return { offsetX, offsetY };
}


function calculateStartandEndPoint(cellA, cellB, cellC, offsetX, offsetY) {
    const cellWidth = cellA.width;
    const cellHeight = cellA.height;
    const lineWidth = 5;
    const startX = cellA.left + cellWidth / 2 - offsetX + lineWidth / 2;
    const startY = cellA.top + cellHeight / 2 - offsetY + lineWidth / 2;
    const endX = cellC.left + cellWidth / 2 - offsetX + lineWidth / 2;
    const endY = cellC.top + cellHeight / 2 - offsetY + lineWidth / 2;
    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const angle = Math.atan2(endY - startY, endX - startX);
    return { startX, startY, endX, endY, length, angle };
}

function styleLineHTML(lineElement, contentDiv, startX, startY, length, angle) {
    const lineWidth = 5;
    const offsetX = lineWidth / 2;
    const offsetY = lineWidth / 2;
    lineElement.style.left = startX - offsetX + 'px';
    lineElement.style.top = startY - offsetY + 'px';
    lineElement.style.width = length + 'px';
    lineElement.style.transformOrigin = 'top left';
    lineElement.style.transform = `rotate(${angle}rad)`;
    contentDiv.style.position = 'relative';
    contentDiv.appendChild(lineElement);
}

function generateCircleSVG() {
    const circleColor = '#00B0EF';
    const width = 70;
    const height = 70;
    const radius = width / 2;
    const circumference = 2 * Math.PI * radius;
    const svgCode =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
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
    const svgCode =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <line x1="0" y1="0" x2="${width}" y2="${height}" stroke="${crossColor}" stroke-width="5">
        <animate attributeName="stroke-dasharray" from="0 ${width}" to="${width} 0" dur="250ms" fill="freeze" />
      </line>
      <line x1="${width}" y1="0" x2="0" y2="${height}" stroke="${crossColor}" stroke-width="5">
        <animate attributeName="stroke-dasharray" from="0 ${width}" to="${width} 0" dur="250ms" fill="freeze" />
      </line>
    </svg>`;
    return svgCode;
}
