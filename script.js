


const dcanvas = document.getElementById("drawCanvas");
const ctx = dcanvas.getContext("2d");
const printArr = document.getElementById("printArray");
const displayTool = document.getElementById("dispTool");
const displayColor = document.getElementById("dispColor");
const colorBox = document.getElementById("colorBox");

// variables

const toolList = ["brush", "eraser", "bucket"];
let tool = toolList[0];
let color = "#EE4B2B";
let pixelSize = 16;


//mouse
let isDrawing = false;


//colorList
let colorList = {"red":"#EE4B2B", "blue":"#0096FF", "green":"#50C878", "yellow":"#FFEA00",
"orange":"#F28C28", "violet":"#7F00FF", "grey":"#808080", "turquoise":"#40e0d0", "black":"#000000"};


//here code

//draw array
let pixelArray = new Array(16).fill(null).map(()=>new Array(16).fill(null));
for (let i = 0; i < pixelArray.length; i++){
    for (let j = 0; j < pixelArray[0].length; j++){
        pixelArray[i][j] = "#ffffff";
    }
}

refresh();


//events
dcanvas.addEventListener("mousedown", function(e){
    isDrawing = true;
    if (tool === "bucket"){
        bucketFill(dcanvas, e);
    }
    else if(tool === "eraser" || tool === "brush"){
        paintPixel(dcanvas, e);
    }
});
dcanvas.addEventListener("mouseout", function(e){
    isDrawing = false;
})
dcanvas.addEventListener("mouseup", function(e){
    isDrawing = false;
})

dcanvas.addEventListener("mousemove", function(e){
    if (isDrawing && tool !== "bucket"){
        paintPixel(dcanvas, e);
    }
})

//functions

function updateArrDisplay(){
    let output = "";
    for (let i = 0; i < pixelArray.length; i++){
        for (let j = 0; j < pixelArray[0].length; j++){
            output += pixelArray[i][j];
            if (j<pixelArray[0].length - 1){
                output += ", ";
            }
        }
        output += "\n";
    }
    printArr.innerHTML = output;
}

function clearCanvas(){
    ctx.clearRect(0, 0, dcanvas.width, dcanvas.height);
    for (let i = 0; i < pixelArray.length; i++){
        for (let j = 0; j < pixelArray[0].length; j++){
            pixelArray[i][j] = "#ffffff";
        }
    }
    drawGrid();
    refresh();
}

function refresh(){
    ctx.clearRect(0, 0, dcanvas.width, dcanvas.height);
    for (let i = 0; i < pixelArray.length; i++){
        for (let j = 0; j < pixelArray[0].length; j++){
            ctx.fillStyle = pixelArray[i][j];
            ctx.fillRect(j*pixelSize,i*pixelSize,pixelSize,pixelSize);
        }
    }
    drawGrid();
    updateArrDisplay();
}

function drawGrid(){
    ctx.strokeStyle = "#b7b7b7";
    ctx.lineWidth = 1;
    for (let i = 1; i < dcanvas.width; i++){
        if (i%pixelSize===0){
            drawLine([i,0], [i,dcanvas.height]);
        }
    }
    for (let i = 1; i < dcanvas.height; i++){
        if (i%pixelSize===0){
            drawLine([0,i], [dcanvas.width,i]);
        }
    }
}


function setTool(newTool){
    tool = toolList[newTool];
    displayTool.innerHTML = "current tool: " + tool;
}

function paintPixel(canvas, event){
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    x = Math.floor(x/pixelSize);
    y = Math.floor(y/pixelSize);
    if (tool === "brush"){
        pixelArray[y][x] = color;
    }
    else if (tool === "eraser"){
        pixelArray[y][x] = "#ffffff";
    }
    refresh();
}

function bucketFill(canvas, event){
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    x = Math.floor(x/pixelSize);
    y = Math.floor(y/pixelSize);
    let prevColor = pixelArray[y][x];
    let visited = new Array(16).fill(null).map(()=>new Array(16).fill(null));
    for (let i = 0; i < visited.length; i++){
        for (let j = 0; j < visited[0].length; j++){
            visited[i][j] = 0;
        }
    }
    spreadPaint(dcanvas, visited, prevColor, x, y);
    refresh();
}

function spreadPaint(canvas, visited, pColor, x, y){
    pixelArray[y][x] = color;
    visited[y][x] = 1;
    if (y>0&&pixelArray[y-1][x]===pColor&&visited[y-1][x]===0){
        spreadPaint(dcanvas, visited, pColor, x, y-1);
    }
    if (y<pixelArray.length-1&&pixelArray[y+1][x]===pColor&&visited[y+1][x]===0){
        spreadPaint(dcanvas, visited, pColor, x, y+1);
    }
    if (x>0&&pixelArray[y][x-1]===pColor&&visited[y][x-1]===0){
        spreadPaint(dcanvas, visited, pColor, x-1, y);
    }
    if (x<pixelArray[0].length-1&&pixelArray[y][x+1]===pColor&&visited[y][x+1]===0){
        spreadPaint(dcanvas, visited, pColor, x+1, y);
    }
}


function drawLine(begin, end) {
    ctx.beginPath();
    ctx.moveTo(...begin);
    ctx.lineTo(...end);
    ctx.stroke();
}

function setColor(newColor){
    color = newColor;
    displayColor.innerHTML = "current color: " + color;
    colorBox.style.backgroundColor = color;
}


