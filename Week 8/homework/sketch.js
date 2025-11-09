let handPose;
let video;
let hands = [];

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0, width, height);

  // Draw geometry for each hand
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    // Draw all keypoints
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 8);
    }

    // --- Detect openness (continuous value) ---
    let openness = getHandOpenness(hand); // returns value 0 → 1

    // --- Find palm position (average wrist & middle finger base) ---
    let wrist = hand.keypoints[0];
    let middleBase = hand.keypoints[9];
    let palmX = (wrist.x + middleBase.x) / 2;
    let palmY = (wrist.y + middleBase.y) / 2;

    // --- Smooth circle growth based on openness ---
    let circleSize = map(openness, 0, 1, 0, 200); // gradually open

    // --- Draw geometry for this hand ---
    fill(255, 100, 150, 180);
    noStroke();
    ellipse(palmX, palmY, circleSize, circleSize);
  }
}

function gotHands(results) {
  hands = results;
}

// --- Continuous openness detection ---
function getHandOpenness(hand) {
  let wrist = hand.keypoints[0];
  let fingerTips = [4, 8, 12, 16, 20].map(i => hand.keypoints[i]);
  let totalDist = 0;

  for (let tip of fingerTips) {
    totalDist += dist(wrist.x, wrist.y, tip.x, tip.y);
  }
  let avgDist = totalDist / fingerTips.length;

  // Normalize distance to 0–1 range
  let minDist = 60;  // fully closed hand
  let maxDist = 200; // fully open hand
  let openness = constrain(map(avgDist, minDist, maxDist, 0, 1), 0, 1);
  return openness;
}
