class Particle {
  constructor(_x, _y){
    this.pos = createVector(_x, _y)
    this.vel = createVector(random(-4, 4), random(-4, 4))

    this.Rad = random(20, 60)
    this.Col = color(map(_x, 0, width, 0,TWO_PI), 0.9, 0.9)

    this.frendliness = random(70, 250)
  }

  move (){
    this.pos.add(this.vel)

    if(this.pos.x + this.Rad >= width || this.pos.x - this.Rad <= 0)
  {
    this.vel.x *= -1
    }
    if(this.pos.y + this.Rad >= height || this.pos.y - this.Rad <= 0){
    this.vel.y *= -1
    }
  }

  display(){
    fill(this.Col)
    noStroke()
    circle(this.pos.x, this.pos.y, this.Rad*2)
  }

  reachOut(_allparticles){
    _allparticles.forEach( (otherP) => {
      if(this.pos !== otherP.pos && this.pos.dist(otherP.pos) <= this.frendliness){
        stroke(0, 0, 1)
        line (this.pos.x, this.pos.y, otherP.pos.x, otherP.pos.y)
      }
    })
  }

}