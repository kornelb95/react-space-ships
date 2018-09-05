import EnemyBullet from "./EnemyBullet";
import { randomNumberBetween } from "../common/functions";
export default class Enemy {
  constructor(argument) {
    this.position = argument.position;
    this.velocity = {
      x: 0,
      y: 0
    };
    this.rotation = 0;
    this.rotationSpeed = 6;
    this.speed = 0.15;
    this.lastBullet = 0;
    this.create = argument.create;
    this.radius = 50;
    this.inertia = 0.9;
    this.delete = false;
    this.player = argument.player;
  }
  init(app) {
    if (Date.now() - this.lastBullet > 4000) {
      const enemyBullet = new EnemyBullet({ enemy: this, player: this.player });
      this.create(enemyBullet, "enemyBullets");
      this.lastBullet = Date.now();
    }
    //Ruch
    this.velocity.x -= Math.sin((-this.rotation * Math.PI) / 180) * this.speed;
    this.velocity.y -= Math.cos((-this.rotation * Math.PI) / 180) * this.speed;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    //blokada
    if (this.position.x > app.window.width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = app.window.width;
    }
    if (this.position.y > app.window.height) {
      this.position.y = 0;
      this.position.x = app.window.width / randomNumberBetween(0, 5);
    } else if (this.position.y < 0) {
      this.position.y = app.window.height;
      this.position.x = app.window.width / randomNumberBetween(0, 5);
    }

    //Rysowanie obiektu wroga
    const ctx = app.context;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);

    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.rotate((-90 * Math.PI) / 180);
    if (app.window.width - this.position.x <= 60) {
      this.velocity.x -= Math.sin((-90 * Math.PI) / 180) * this.speed;
    } else if (this.position.x <= 60) {
      this.velocity.x -= Math.sin((-90 * Math.PI) / 180) * this.speed;
    }
    if (app.window.height - this.position.y <= 60) {
      this.velocity.x -= Math.sin((-90 * Math.PI) / 180) * this.speed;
    } else if (this.position.y <= 60) {
      this.velocity.x -= Math.sin((-90 * Math.PI) / 180) * this.speed;
    }
    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 25);
    ctx.lineTo(70, 0);
    ctx.lineTo(0, -25);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
  destroy() {
    this.delete = true;
  }
}
