var canvas
var slider

// Espera o DOM carregar
$(document).ready(function() {

    canvas = $("#canvas");
    slider = $("#slider");

    // Lê os parâmetros largura e altura da URL
    let w = readParam("w");
    let h = readParam("h");

    // Define a largura do canvas com valor passado como parâmetro.
    // Se o parâmetro não foi passado, carrega o último valor do cookie
    if (w) {
        canvas.attr("width", w);
        setCookie("width", w);
    } else {
        w = getCookie("width");
        if (w) canvas.attr("width", w);
    }

    // Define a altura do canvas com valor passado como parâmetro.
    // Se o parâmetro não foi passado, carrega o último valor do cookie
    if (h) {
        canvas.attr("height", h);
        setCookie("height", h);
    } else {
        h = getCookie("height");
        if (h) canvas.attr("height", h);
    }

    // Imprime a tamanho do canvas e o seu aspect ratio na tela
    $("h2").html("Canvas: (" + canvas.attr("width") + "&times;" + 
    canvas.attr("height") + ")<br>" + "Aspect ratio = " + 
    Math.round(canvas.attr("width")/canvas.attr("height")*100)/100);

    // Carrega o último valor do slider
    loadSlider();
    
    // Toda vez que o slider for arrastado, atualiza o canvas e salva o valor
    // do slider no cookie
    slider.on("input", updateCanvas);
    slider.on("input", saveSlider);
    updateCanvas();

    // Define a janela como arrastável
    $("#draggable").draggable({});
    dragAndSave("#draggable");
})

/**
 * Salva a posição do slider em um cookie chamado "slider"
 */
function saveSlider() {
    setCookie("slider", slider.val());
}

/**
 * Restaura a última posição do slider salva no cookie "slider"
 */
function loadSlider() {
    const oldSlider = getCookie("slider");
    if (oldSlider) slider.val(oldSlider);
}

/**
 * Lê um parâmetro da URL
 * 
 * @param {string} paramName Nome do parâmetro
 * @returns valor do parâmetro
 */
function readParam(paramName) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get(paramName);
    return param;
}

/**
 * Apaga o Canvas e desenha os n quadrados na forma mais eficiente possível
 * 
 * @returns tamanho de cada quadrado
 */
function updateCanvas() {
    
    let ctx = canvas.get(0).getContext("2d");
    
    const w = canvas.width();
    const h = canvas.height();
    const n = slider.val();
  
    const ratio = w/h;
    const cols = Math.sqrt(n * ratio);
    const rows = Math.ceil(n / cols);
  
    // Melhor opção ocupando toda altura
    {
        let _rows = Math.ceil(rows);
        let _cols = Math.ceil(n / _rows);

        // Segmento alterado para corrigir imprecisão com razões de aspecto 
        // muito diferentes de 1
        while (_rows * ratio < _cols) {
            _rows++;
            _cols = Math.ceil(n / _rows);
        }

        var fullHeightSide = h / _rows;
    }
   
  
    // Melhor opção ocupando toda largura
    {
        let _cols = Math.ceil(cols);
        let _rows = Math.ceil(n / _cols);

        // Segmento alterado para corrigir imprecisão com razões de aspecto 
        // muito diferentes de 1
        while (_rows * ratio > _cols) {
            _cols++;
            _rows = Math.ceil(n / _cols);
        }

        var fullWidthSide = w / _cols;
    }
  
    // Finalmente 
    let squareSide = Math.max(fullHeightSide, fullWidthSide);

    
    // O cálculo de `perRow` foi alterado para evitar erro de truncamento
    // (visível quando w=400, h=200 e n=52)
    let perRow = Math.floor(Math.max(w/squareSide, 1/(squareSide / w)))

    let circleRadius = squareSide / 4;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = "black";
    ctx.strokeStyle = "gray";
    for (let i = 0; i < n; i++) {
        let row = Math.floor(i / perRow);
        let col = i % perRow;
        let x = circleRadius * 2 + circleRadius * 4 * col;
        let y = circleRadius * 2 + circleRadius * 4 * row;
        ctx.beginPath();
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath();
        ctx.moveTo(x - squareSide / 2, y - squareSide / 2);
        ctx.lineTo(x - squareSide / 2, y + squareSide / 2);
        ctx.lineTo(x + squareSide / 2, y + squareSide / 2);
        ctx.lineTo(x + squareSide / 2, y - squareSide / 2);
        ctx.closePath();
        ctx.stroke();
    }

    $("p").html(n + "&bull;&le;(" + Math.ceil(n/perRow) + "&times;" + perRow + ")");
  
    return squareSide;
  }