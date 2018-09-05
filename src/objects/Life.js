export default class Life {
  constructor(argument) {
    this.position = argument.position;
    this.radius = 20;
    this.delete = false;
  }
  init(app) {
    //Rysowanie serca
    const ctx = app.context;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.strokeStyle = "#f00";
    ctx.fillStyle = "#f00";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(75 / 2, 40 / 2);
    ctx.bezierCurveTo(75 / 2, 37 / 2, 70 / 2, 25 / 2, 50 / 2, 25 / 2);
    ctx.bezierCurveTo(20 / 2, 25 / 2, 20 / 2, 62.5 / 2, 20 / 2, 62.5 / 2);
    ctx.bezierCurveTo(20 / 2, 80 / 2, 40 / 2, 102 / 2, 75 / 2, 120 / 2);
    ctx.bezierCurveTo(110 / 2, 102 / 2, 130 / 2, 80 / 2, 130 / 2, 62.5 / 2);
    ctx.bezierCurveTo(130 / 2, 62.5 / 2, 130 / 2, 25 / 2, 100 / 2, 25 / 2);
    ctx.bezierCurveTo(85 / 2, 25 / 2, 75 / 2, 37 / 2, 75 / 2, 40 / 2);
    ctx.stroke();
    ctx.restore();
  }
  destroy() {
    this.delete = true;
  }
}
