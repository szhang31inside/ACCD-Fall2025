let school;
let messageTimer = 0;
let messageText = "";

function setup() {
  createCanvas(800, 500);
  colorMode(HSB, TWO_PI, 1, 1);
  school = new School();
}

function draw() {
  background(0, 0, 0.95);
  school.update();
  school.display();

  // Show message when new student is added
  if (millis() - messageTimer < 2000 && messageText !== "") {
    fill(0);
    textAlign(CENTER);
    textSize(13);
    text(messageText, width / 2, height - 60);
  }
}

// --- School System ---
class School {
  constructor() {
    this.teacher = new Teacher(width / 2, height / 2);
    this.students = [];

    // Start with some students
    for (let i = 0; i < 8; i++) {
      this.students.push(new Student(random(width), random(height)));
    }
  }

  update() {
    for (let s of this.students) s.move();
    this.teacher.teach(this.students);
  }

  display() {
    // Draw school boundary and label
    noFill();
    stroke(0, 0, 0.5);
    strokeWeight(3);
    rect(5, 5, width - 10, height - 10, 15);
    noStroke();
    fill(0);
    textAlign(CENTER);
    textSize(20);
    text("School", width / 2, 25);

    // Draw teacher-student connections
    this.teacher.displayConnections(this.students);

    // Draw teacher and students
    this.teacher.display();
    for (let s of this.students) s.display();

    // Emergent property: average knowledge
    let avg = this.students.reduce((sum, s) => sum + s.knowledge, 0) / this.students.length;
    fill(0);
    textSize(13);
    textAlign(LEFT);
    text("Click anywhere to add a new student", 20, height - 20);
  }
}

// --- Teacher class ---
class Teacher {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.range = 150; // teaching range
  }

  teach(students) {
    for (let s of students) {
      let d = dist(this.pos.x, this.pos.y, s.pos.x, s.pos.y);
      if (d < this.range) {
        s.learn(0.3);
      }
    }
  }

  displayConnections(students) {
    stroke(0.6, 0.8, 0.8, 0.5);
    for (let s of students) {
      if (dist(this.pos.x, this.pos.y, s.pos.x, s.pos.y) < this.range) {
        line(this.pos.x, this.pos.y, s.pos.x, s.pos.y);
      }
    }
  }

  display() {
    fill(0.6, 1, 1);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 35, 35);
    fill(0);
    textAlign(CENTER);
    text("Teacher", this.pos.x, this.pos.y + 45);
  }
}

// --- Student class (each circle = a student) ---
class Student {
  constructor(_x, _y) {
    this.pos = createVector(_x, _y);
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.Rad = random(10, 25);
    this.Col = color(random(TWO_PI), 0, 0);
    console.log(this.Col.toString())
    console.log(hue(this.Col))
    console.log(saturation(this.Col))
    console.log(brightness(this.Col))
    this.friendliness = random(70, 150);
    this.knowledge = random(0, 50);
  }

  move() {
    this.pos.add(this.vel);
    if (this.pos.x + this.Rad >= width || this.pos.x - this.Rad <= 0) this.vel.x *= -1;
    if (this.pos.y + this.Rad >= height || this.pos.y - this.Rad <= 0) this.vel.y *= -1;
  }

  learn(amount) {
    this.knowledge += amount;
    this.Col = color(hue(this.Col), 1, map(this.knowledge, 0, 200, 0, 1));
  }

  display() {
    fill(this.Col);
    noStroke();
    circle(this.pos.x, this.pos.y, this.Rad * 2);
  }
}

// --- User adds new student ---
function mousePressed() {
  // A random circle = a new student joins the school
  school.students.push(new Student(mouseX, mouseY));
  messageText = "A new student joined the class!";
  messageTimer = millis();
}
