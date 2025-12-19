

let posX
let posY

let velX
let velY

let diameter = 130

let imgHappy, imgAngry, currentImg
let countDown = 0

let sound 



function preload(){
  imgHappy = loadImage("happy.png")
  imgAngry = loadImage("angry.png")
  sound = loadSound ("sound.mp3")

}

function setup() {
  createCanvas(800,600)
  imageMode(CENTER)

  posX = width/2
  posY = height/2

  velX = random(-5, 5)
  velY = random(-3.5, 3.5)

  currentImg = imgHappy

}

function draw() {
  background (220)

  circle(posX, posY, diameter)
  image(currentImg, posX, posY, diameter, diameter)

  velX += random(-0.5, 0.5); 
  velY += random(-0.5, 0.5);

  posX = posX + velX
  posY += velY
      
  if (posX + diameter * 0.5 >= width || posX - diameter * 0.5 <=0) {
     velX = velX * -1
      currentImg = imgAngry
      countDown = 16

      sound.play()
  
  }

  if (posY + diameter * 0.5 >= height || posY - diameter * 0.5 <=0) {
     velY = velY * -1
     currentImg = imgAngry
     countDown = 16

sound.play()
  
  }

  if(countDown > 0){
  countDown--
  }
  else (
    currentImg = imgHappy
  )

}
