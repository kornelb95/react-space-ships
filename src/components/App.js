import React, { Component } from "react";
import { KEYS } from "../common/const";
import Player from "../objects/Player";
import Enemy from "../objects/Enemy";
import Life from "../objects/Life";
import "../index.css";
import {
  randomNumberBetweenConstraint,
  randomNumberBetween
} from "../common/functions";
class App extends Component {
  constructor() {
    super();
    //stan początkowy
    this.state = {
      //właściwość context odpowiedzialna za obsługę canvas
      context: null,
      playerState: null,
      //czy trwa gra
      playing: false,
      //rozmiary planszy gry, a dokładnie okna canvas
      window: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      //obiekt przechowujący stan akcji przycisków
      keys: {
        move: false,
        left: false,
        right: false,
        fire: false
      },
      //liczba wrogów
      enemiesCount: 4,
      currentScore: 0,
      bestScore: localStorage["bestscore"] || 0,
      lastLife: Date.now()
    };
    this.player = [];
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.lifes = [];
  }

  componentDidMount() {
    //kiedy naciśniemy przycisk, przekazujemy wartość true
    window.addEventListener("keydown", this.handleMove.bind(this, true));
    //kiedy puścimy przycisk, przekazujemy wartość false
    window.addEventListener("keyup", this.handleMove.bind(this, false));

    //inicjalizacja canvas, pobieramy kontekst
    const context = this.refs.canvas.getContext("2d");
    //ustawiamy w stanie komponentu pobrany kontekst
    this.setState({ context: context });

    //zaczynamy grę
    this.start();
    this.setState({ playerState: this.player[0] });
    requestAnimationFrame(() => {
      this.update();
    });
  }
  restart() {
    this.start();
    window.location.reload();
  }

  render() {
    let content = null;

    if (!this.state.playing) {
      content = (
        <div className="endgame">
          <p>Przegrałeś.</p>
          <button onClick={this.restart.bind(this)}>Jeszcze raz?</button>
        </div>
      );
    }
    if (this.state.playing) {
      if (this.state.playerState !== null) {
        content = (
          <div className="container">
            <div className="controls">
              {this.state.playerState.life} &nbsp;
              <i className="fas fa-heart" />
            </div>
            <div className="score">
              <p className="current-score">Punkty: {this.state.currentScore}</p>
              <p className="best-score">
                Najlepszy wynik: {this.state.bestScore}
              </p>
            </div>
          </div>
        );
      }
    }
    return (
      <div>
        {content}
        <canvas
          ref="canvas"
          width={this.state.window.width}
          height={this.state.window.height}
        />
      </div>
    );
  }

  start() {
    this.setState({
      playing: true
    });
    //stworzenie obiektu gracza
    let player = new Player({
      position: {
        x: this.state.window.width / 2,
        y: this.state.window.height / 2
      },
      create: this.createObject.bind(this),
      onDie: this.gameOver.bind(this)
    });
    this.createObject(player, "player");
    //Stworzenie obiektów wrogów
    this.enemies = [];
    this.enemyBullets = [];
    this.createEnemies(this.state.enemiesCount);
  }
  gameOver() {
    this.setState({
      playing: false
    });
    if (this.state.currentScore > this.state.bestScore) {
      this.setState({
        bestScore: this.state.currentScore
      });
      localStorage["bestscore"] = this.state.currentScore;
    }
  }
  update() {
    const ctx = this.state.context;
    const player = this.player;
    const bullets = this.bullets;
    const enemyBullets = this.enemyBullets;
    const enemies = this.enemies;
    const lifes = this.lifes;
    ctx.save();
    this.setState({ playerState: player[0] });
    //zmazanie poprzedniej klatki oraz ustawienie backgroundu od nowa
    ctx.fillRect(0, 0, this.state.window.width, this.state.window.height);
    const background = new Image();
    background.src =
      "http://www.script-tutorials.com/demos/360/images/stars.png";
    ctx.drawImage(background, 0, 0);
    if (Date.now() - this.state.lastLife > 10000) {
      let life = new Life({
        position: {
          x: Math.round(randomNumberBetween(0, this.state.window.width)),
          y: Math.round(randomNumberBetween(0, this.state.window.height))
        }
      });
      this.createObject(life, "lifes");
      this.setState({ lastLife: Date.now() });
    }

    if (this.checkCollisionsWith(bullets, enemies)) {
      this.createEnemies(1);
      this.setState({ currentScore: this.state.currentScore + 1 });
    }
    if (this.checkCollisionsWith(lifes, player, true)) {
      this.player[0].life += 1;
    }
    this.checkCollisionsWith(enemyBullets, player);

    this.updateObjects(player, "player");
    this.updateObjects(bullets, "bullets");
    this.updateObjects(enemyBullets, "enemyBullets");
    this.updateObjects(enemies, "enemies");
    this.updateObjects(lifes, "lifes");

    ctx.restore();
    //następna klatka
    requestAnimationFrame(() => {
      this.update();
    });
  }

  createEnemies(count) {
    if (this.player[0] !== undefined) {
      let player = this.player[0];
      if (count === 1) {
        let enemy = new Enemy({
          size: 30,
          position: {
            x: randomNumberBetweenConstraint(
              0,
              this.state.window.width,
              player.position.x - 60,
              player.position.x + 60
            ),
            y: 0
          },
          create: this.createObject.bind(this),
          player: player
        });
        this.createObject(enemy, "enemies");
      } else {
        for (let i = 0; i < count; i++) {
          let enemy = new Enemy({
            size: 30,
            position: {
              x: randomNumberBetweenConstraint(
                0,
                this.state.window.width,
                player.position.x - 60,
                player.position.x + 60
              ),
              y: randomNumberBetweenConstraint(
                0,
                this.state.window.height,
                player.position.y - 60,
                player.position.y + 60
              )
            },
            create: this.createObject.bind(this),
            player: player
          });
          this.createObject(enemy, "enemies");
        }
      }
    }
  }

  handleMove(value, e) {
    let keys = this.state.keys;
    if (e.keyCode === KEYS.MOVE) keys.move = value;
    if (e.keyCode === KEYS.LEFT) keys.left = value;
    if (e.keyCode === KEYS.RIGHT) keys.right = value;
    if (e.keyCode === KEYS.FIRE) keys.fire = value;

    this.setState({
      keys: keys
    });
  }

  checkCollisionsWith(items1, items2, heart = false) {
    var a = items1.length - 1;
    var b;
    for (a; a > -1; --a) {
      b = items2.length - 1;
      for (b; b > -1; --b) {
        var item1 = items1[a];
        var item2 = items2[b];
        if (this.checkCollision(item1, item2)) {
          item1.destroy(heart);
          item2.destroy(heart);
          return true;
        }
      }
    }
  }

  checkCollision(obj1, obj2) {
    var vx = obj1.position.x - obj2.position.x;
    var vy = obj1.position.y - obj2.position.y;
    var length = Math.sqrt(vx * vx + vy * vy);
    if (length < obj1.radius + obj2.radius) {
      return true;
    }
    return false;
  }

  createObject(object, type) {
    this[type].push(object);
  }

  updateObjects(objects, type) {
    let i = 0;
    for (let object of objects) {
      if (object.delete) {
        this[type].splice(i, 1);
      } else {
        objects[i].init(this.state);
      }
      i++;
    }
  }
}

export default App;
