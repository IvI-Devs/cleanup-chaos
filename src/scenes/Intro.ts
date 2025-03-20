import { GameInfo } from "../GameInfo";

export default class Intro extends Phaser.Scene {
  constructor(){ super({ key: "Intro" }); }
  public score: number = 0;
  public hearts: number = 3;
  private heartsGroup: Phaser.GameObjects.Group;


  private keys: {
    W: Phaser.Input.Keyboard.Key,
    A: Phaser.Input.Keyboard.Key,
    S: Phaser.Input.Keyboard.Key,
    D: Phaser.Input.Keyboard.Key
  };

  private _background: Phaser.GameObjects.Image;
  private _ship: Phaser.GameObjects.Image;
  private _scoreText: Phaser.GameObjects.Text;
  private cursor: Phaser.Types.Input.Keyboard.CursorKeys;
  private _speed: number = 250;

  private asteroids: Phaser.Physics.Arcade.Group;
  private asteroidSpeed: number = 150;

  create(){
    this.cursor = this.input.keyboard.createCursorKeys();
    this._background = this.add.image(0, 0, "bg-01");
    this._background.setOrigin(0, 0);
    this._ship = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, "ship-base").setScale(0.5);
    this._scoreText = this.add.text(50, 50, "Score: 00").setFontSize(35).setFontFamily(GameInfo.default.font);

    this.heartsGroup = this.add.group();
    this.updateHearts();

    this.keys = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    this.asteroids = this.physics.add.group();

    this.time.addEvent({
      delay: 1500,
      callback: this.spawnAsteroid,
      callbackScope: this,
      loop: true
    });
  }

  private updateHearts() {
      // 1. Rimuovi tutti i cuori esistenti
      this.heartsGroup.clear(true, true);

      // 2. Calcola posizione iniziale (in alto a sinistra)
      const startX = 75;
      const startY = 125;
      const spacing = 55; // Distanza tra i cuori

      // 3. Crea un cuore per ogni vita rimanente
      for (let i = 0; i < this.hearts; i++) {
          const heart = this.add.image(
              startX + (i * spacing), // Posizione X
              startY,                 // Posizione Y
              'heart-white'                 // Chiave dell'immagine
          )
          .setScale(0.5)
          .setScrollFactor(0)         // Mantieni la posizione sullo schermo
          .setDepth(1000);           // Mostra sopra a tutto

          this.heartsGroup.add(heart);
      }
  }

  loseLife() {
      if(this.hearts > 0) {
          this.hearts--;
          this.updateHearts(); // Aggiorna le immagini

          // Aggiungi qui altri effetti (es. animazioni, suoni)
      }
  }

  // Esempio di metodo per guadagnare una vita
  gainLife() {
      if(this.hearts < 5) { // Massimo 5 vite
          this.hearts++;
          this.updateHearts(); // Aggiorna le immagini
      }
  }

  update(time: number, delta: number){
    if(this.cursor.left.isDown || this.keys.A.isDown){
      this._ship.x -= this._speed * delta / 1000;
      this._ship.angle = -90;
    }
    if(this.cursor.right.isDown || this.keys.D.isDown){
      this._ship.x += this._speed * delta / 1000;
      this._ship.angle = 90;
    }
    if(this.cursor.up.isDown || this.keys.W.isDown){
      this._ship.y -= this._speed * delta / 1000;
      this._ship.angle = 0;
    }
    if(this.cursor.down.isDown || this.keys.S.isDown){
      this._ship.y += this._speed * delta / 1000;
      this._ship.angle = 180;
    }

    if((this.cursor.left.isDown || this.keys.A.isDown) && (this.cursor.down.isDown || this.keys.S.isDown)) this._ship.angle = -135;
    if((this.cursor.right.isDown || this.keys.D.isDown) && (this.cursor.down.isDown || this.keys.S.isDown)) this._ship.angle = 135;
    if((this.cursor.left.isDown || this.keys.A.isDown) && (this.cursor.up.isDown || this.keys.W.isDown)) this._ship.angle = -45;
    if((this.cursor.right.isDown || this.keys.D.isDown) && (this.cursor.up.isDown || this.keys.W.isDown)) this._ship.angle = 45;

    this.asteroids.getChildren().forEach((asteroid: any) => {
      if(asteroid.x < -100 || asteroid.x > this.game.canvas.width + 100 ||
        asteroid.y < -100 || asteroid.y > this.game.canvas.height + 100) {
        asteroid.destroy();
      }
    });
  }

  private spawnAsteroid() {
    const screenWidth = this.game.canvas.width;
    const screenHeight = this.game.canvas.height;
    const minDistanceFromShip = 300;
    const padding = 50;

    let x: number, y: number;
    let edge = Phaser.Math.Between(0, 3); // 0=top, 1=right, 2=bottom, 3=left

    switch(edge) {
      case 0: // Top
        x = Phaser.Math.Between(-padding, screenWidth + padding);
        y = -padding;
        break;
      case 1: // Right
        x = screenWidth + padding;
        y = Phaser.Math.Between(-padding, screenHeight + padding);
        break;
      case 2: // Bottom
        x = Phaser.Math.Between(-padding, screenWidth + padding);
        y = screenHeight + padding;
        break;
      default: // Left
        x = -padding;
        y = Phaser.Math.Between(-padding, screenHeight + padding);
    }

    const distanceToShip = Phaser.Math.Distance.Between(x, y, this._ship.x, this._ship.y);

    if(distanceToShip < minDistanceFromShip){
      switch(edge){
        case 0: case 2: // Top/Bottom
          x = x < screenWidth/2 ?
              Phaser.Math.Between(screenWidth/2 + minDistanceFromShip, screenWidth + padding) :
              Phaser.Math.Between(-padding, screenWidth/2 - minDistanceFromShip);
          break;
        default: // Left/Right
          y = y < screenHeight/2 ?
              Phaser.Math.Between(screenHeight/2 + minDistanceFromShip, screenHeight + padding) :
              Phaser.Math.Between(-padding, screenHeight/2 - minDistanceFromShip);
      }
    }

    const asteroid = this.asteroids.create(x, y, 'asteroid-base').setScale(Phaser.Math.Between(1.5, 2.5)).setInteractive()
      .on('pointerdown', () => {
        asteroid.destroy();
      });
    asteroid.setAngularVelocity(Phaser.Math.Between(-50, 50));

    const targetPoint = new Phaser.Math.Vector2(
        Phaser.Math.Between(padding, screenWidth - padding),
        Phaser.Math.Between(padding, screenHeight - padding)
    );

    this.physics.moveTo(asteroid, targetPoint.x, targetPoint.y, this.asteroidSpeed);
}

}