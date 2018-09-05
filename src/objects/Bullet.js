import { distancePoint } from "../common/functions";
export default class Bullet {
  constructor(argument) {
    //odległość od środka statku
    let distance = distancePoint(
      { x: 0, y: -20 },
      { x: 0, y: 0 },
      (argument.player.rotation * Math.PI) / 180
    );
    //pozycja początkowa pocisku
    this.position = {
      x: argument.player.position.x + distance.x,
      y: argument.player.position.y + distance.y
    };
    this.rotation = argument.player.rotation;
    this.velocity = {
      x: distance.x / 2,
      y: distance.y / 2
    };
    this.radius = 2;
    this.delete = false;
  }
  destroy() {
    this.delete = true;
  }
  init(app) {
    //Ruch pocisku
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //usunięcie pocisku kiedy osiągnie krawędź
    if (
      this.position.x < 0 ||
      this.position.y < 0 ||
      this.position.x > app.window.width ||
      this.position.y > app.window.height
    ) {
      this.destroy();
    }
    //rysowanie pocisku
    const ctx = app.context;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.rotate((-90 * Math.PI) / 180);
    ctx.fillStyle = "#f00";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
