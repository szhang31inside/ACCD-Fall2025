let particles = []

function setup() {
  createCanvas(800, 600)
  colorMode(HSB, TWO_PI, 1, 1)

  particles.push(new Particle(width*0.5, height*0.5))

}

function draw() {
  background(0)

  particles.forEach((p) =>{ 
    p.move()
    p.display()
    p.reachOut(particles)
  })

}

function mouseReleased(){
  particles.push(new Particle(mouseX, mouseY))
}
