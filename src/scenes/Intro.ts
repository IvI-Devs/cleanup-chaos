export default class Intro extends Phaser.Scene {
  constructor() {
    super({ key: "Intro" });
  }

  private _ship: Phaser.GameObjects.Image;

  private _speed: number = 200; 

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  preload() {
    this.load.image("ship", "assets/images/ships/full-ship.svg");
  }
  
  create() {
    this.cameras.main.setBackgroundColor("#000000");

    this._ship = this.add.image(
      this.game.canvas.width / 2, 
      this.game.canvas.height / 2, 
      "ship" 
    );

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time: number, delta: number) {
    if (this.cursors.left.isDown) {
      this._ship.x -= this._speed * delta / 1000; 
    }

    if (this.cursors.right.isDown) {
      this._ship.x += this._speed * delta / 1000; 
    }

    if (this.cursors.up.isDown) {
      this._ship.y -= this._speed * delta / 1000; 
    }

    // Movimento in basso
    if (this.cursors.down.isDown) {
      this._ship.y += this._speed * delta / 1000; 
    }
  }
}