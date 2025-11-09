let video, handPose, hands = [];
let lastDistances = [];
let fireworks = [];

function setup() {
  createCanvas(windowWidth, windowHeight); 
  colorMode(HSB, 360, 100, 100, 100);

  video = createCapture(VIDEO);
  video.size(640, 480); 
  video.hide();

  handPose = ml5.handpose(video, {
    maxHands: 2,
    modelType: "full",
    detectionConfidence: 0.5,
    trackingConfidence: 0.5
  }, () => {
    console.log;
  });

  handPose.on("predict", gotHands);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function gotHands(results) {
  hands = results;
  console.log;
}

function draw() {
  background(255);

  let x = (width - video.width) / 2;
  let y = (height - video.height) / 2;
  image(video, x, y, video.width, video.height);

  let currentDistances = [];

  while (lastDistances.length < hands.length) {
    lastDistances.push(Infinity);
  }
  while (lastDistances.length > hands.length) {
    lastDistances.pop();
  }

  for (let i = 0; i < hands.length; i++) {
    let landmarks = hands[i].landmarks;
    let thumbTip = landmarks[4];
    let middleTip = landmarks[12];

    if (thumbTip && middleTip) {
      currentDistances[i] = dist(thumbTip[0], thumbTip[1], middleTip[0], middleTip[1]);
    } else {
      currentDistances[i] = Infinity;
    }
  }

  for (let i = 0; i < currentDistances.length; i++) {
    let currentD = currentDistances[i];
    let lastD = lastDistances[i];

    if (currentD > 40 && lastD <= 40) {
      let thumbTip = hands[i].landmarks[4];
      let middleTip = hands[i].landmarks[12];

      fireworks.push(new Firework(
        x + lerp(thumbTip[0], middleTip[0], 0.5), 
        y + lerp(thumbTip[1], middleTip[1], 0.5)  
      ));
    }
  }

  for (let i = 0; i < currentDistances.length; i++) {
    lastDistances[i] = currentDistances[i];
  }

  
  drawHandSkeleton(x, y);

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();
    if (fireworks[i].isFinished()) fireworks.splice(i, 1);
  }
}

class Firework {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.particles = [];
    this.lifespan = 100;
    this.fadeSpeed = 2;

    const layerConfigs = [
      { circles: 8,  radius: 0,   size: 12 },
      { circles: 12, radius: 30,  size: 8 },
      { circles: 18, radius: 60,  size: 6 },
      { circles: 24, radius: 90,  size: 4 },
      { circles: 30, radius: 120, size: 2 }
    ];

    for (let config of layerConfigs) {
      const angleStep = TWO_PI / config.circles;
      for (let a = 0; a < TWO_PI; a += angleStep) {
        this.particles.push({
          pos: p5.Vector.fromAngle(a).mult(config.radius),
          size: config.size,
          hue: this.getRandomHue(),
          angle: random(TWO_PI),
          speed: random(0.5, 2),
          alpha: 100
        });
      }
    }
  }

  getRandomHue() {
    const rand = random();
    if (rand < 0.4) return random(0, 15);
    else if (rand < 0.7) return random(15, 60);
    else return random(180, 300);
  }

  update() {
    this.lifespan -= this.fadeSpeed;
    for (let p of this.particles) {
      p.pos.rotate(p.speed * 0.01);
      p.alpha = map(this.lifespan, 100, 0, 100, 0);
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    for (let p of this.particles) {
      fill(p.hue, 90, 90, p.alpha);
      noStroke();
      circle(p.pos.x, p.pos.y, p.size * map(this.lifespan, 0, 100, 0.5, 1.5));
    }
    pop();
  }

  isFinished() {
    return this.lifespan <= 0;
  }
}

function drawHandSkeleton(offsetX, offsetY) {

  const connections = [

    [0, 1], [0, 5], [0, 9], [0, 13], [0, 17],
 
    [1, 2], [2, 3], [3, 4],
 
    [5, 6], [6, 7], [7, 8],

    [9, 10], [10, 11], [11, 12],
  
    [13, 14], [14, 15], [15, 16],
 
    [17, 18], [18, 19], [19, 20]
  ];

  push();
  translate(offsetX, offsetY); 

  for (let i = 0; i < hands.length; i++) {
    let landmarks = hands[i].landmarks;


    stroke(0, 255, 0);
    strokeWeight(3);
    noFill();

    for (let connection of connections) {
      let start = landmarks[connection[0]];
      let end = landmarks[connection[1]];

      if (start && end) {
        line(start[0], start[1], end[0], end[1]);
      }
    }

 
    fill(255, 0, 0); 
    noStroke();
    for (let landmark of landmarks) {
      if (landmark) {
        circle(landmark[0], landmark[1], 8);
      }
    }
  }

  pop();
}