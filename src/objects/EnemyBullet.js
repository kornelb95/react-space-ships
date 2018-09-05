export default class EnemyBullet {
  constructor(argument) {
    let vy = argument.player.position.y - argument.enemy.position.y;
    let vx = argument.player.position.x - argument.enemy.position.x;
    let len = Math.sqrt(vx * vx + vy * vy);
    vy /= len;
    vx /= len;
    let angle = Math.atan(Math.abs(vy / vx));
    angle = (angle * 180) / Math.PI;
    //pozycja początkowa pocisku
    this.position = {
      x: argument.enemy.position.x,
      y: argument.enemy.position.y
    };
    this.rotation = angle;
    this.velocity = {
      x: vx * 4,
      y: vy * 4
    };
    this.radius = 2;
    this.delete = false;
    this.player = argument.player;
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
    ctx.fillStyle = "#f00";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
