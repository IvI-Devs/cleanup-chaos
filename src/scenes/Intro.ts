export default class Intro extends Phaser.Scene {
  constructor(){ super({ key: "Intro" }) }
  private _image1: Phaser.GameObjects.Image;

  preload(){ }
  create(){
    this.cameras.main.setBackgroundColor("#000000"); // background --> white
    this._image1 = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, "phaser");
  }

}