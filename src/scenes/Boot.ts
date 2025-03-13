export default class Boot extends Phaser.Scene {
  constructor(){ super({ key: "Boot" }) }
  private _text: Phaser.GameObjects.Text;

  init(){ }
  preload(){
    this.cameras.main.setBackgroundColor("#ffffff");
    this.load.image("logo", "assets/images/phaser.png");
  }

  create(){
    this.scene.stop(this);
    this.scene.start("Preloader");
  }

  update(time: number, delta: number): void {
    this._text.angle += 1;
  }

}