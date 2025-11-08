let lines = []

//UI
let weightSlider
let currentWeigth
let clrPicker
let currentColor


function setup() {
  createCanvas(800, 600);

  //UI
  weightSlider = createSlider(1, 20, 1);  
  weightSlider.position(10, height + 20);
  weightSlider.size(200);
  
  clrPicker = createColorPicker('#000000');
  clrPicker.position(240, height + 20);
}

function draw() {
  background(225);

  if (mouseIsPressed) {
    lines[lines.length - 1].addPoint(mouseX, mouseY);
}
lines.forEach( (l)=>{
    l.display()
})
  setUIValues();
}

function mousePressed() {
  lines.push(new drawingLine(mouseX, mouseY, currentColor, currentWeight));
}

function setUIValues(){ 
  currentWeight = weightSlider.value();
  currentColor = clrPicker.value();
}