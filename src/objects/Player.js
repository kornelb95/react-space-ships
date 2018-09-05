import Bullet from "./Bullet";
export default class Player {
  constructor(argument) {
    //stan początkowy obiektu gracza
    this.position = argument.position;
    this.rotation = 0;
    this.rotationVelocity = 6;
    this.speed = 0.3;
    this.radius = 50;
    this.lastBullet = 0;
    this.resistance = 0.94;
    this.life = 3;
    this.velocity = {
      x: 0,
      y: 0
    };
    //przekazane metody z komponentu
    this.createObject = argument.create;
    this.onDie = argument.onDie;
    this.delete = false;
  }
  //app stan komponentu nadrzędnego App
  init(app) {
    //sterowanie
    if (app.keys.left) {
      this.rotate("LEFT");
    }
    if (app.keys.right) {
      this.rotate("RIGHT");
    }
    if (app.keys.move) {
      this.move(1);
    }
    //strzał, zabezpieczenie przed za częstym strzelaniem
    if (app.keys.fire && Date.now() - this.lastBullet > 300) {
      const bullet = new Bullet({ player: this });
      this.createObject(bullet, "bullets");
      this.lastBullet = Date.now();
    }
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.resistance;
    this.velocity.y *= this.resistance;
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    //blokada
    if (this.position.x > app.window.width) this.position.x = app.window.width;
    else if (this.position.x < 0) this.position.x = 0;
    if (this.position.y > app.window.height)
      this.position.y = app.window.height;
    else if (this.position.y < 0) this.position.y = 0;

    //drawing
    const ctx = app.context;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.rotate((-90 * Math.PI) / 180);
    ctx.strokeStyle = "#ff0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 50, 0.2 * Math.PI, 1.8 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  rotate(direction) {
    if (direction === "LEFT") {
      this.rotation -= this.rotationVelocity;
    }
    if (direction === "RIGHT") {
      this.rotation += this.rotationVelocity;
    }
  }

  move(value) {
    this.velocity.x -= Math.sin((-this.rotation * Math.PI) / 180) * this.speed;
    this.velocity.y -= Math.cos((-this.rotation * Math.PI) / 180) * this.speed;
  }
  destroy(heart) {
    if (!heart) {
      this.life--;
      if (this.life <= 0) {
        this.delete = true;
        this.onDie();
      }
    }
  }
}
