class drawingLine{
  constructor(_startX, _startY, _color, _weight){
    this.positions = [];
    this.positions.push( createVector(_startX, _startY) );
    this.col = _color;
    this.weight = _weight;
  }

  display(){
    if(this.positions.length > 1){
      for(let i=1; i<this.positions.length; i++){
        stroke(this.col);
        strokeWeight(this.weight);
        line(this.positions[i-1].x, this.positions[i-1].y, this.positions[i].x, this.positions[i].y);
      }
    }
  }
  addPoint(_x, _y){
    this.positions.push( createVector(_x, _y) );
  }
}