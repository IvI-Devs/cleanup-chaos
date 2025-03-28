import { GameInfo } from "../../GameInfo";
import { GameData } from "../../GameData";

export default class Exit extends Phaser.Scene {
  constructor(){ super({ key: "Exit" }) }
  private _text: Phaser.GameObjects.Text;
  private _hole: Phaser.GameObjects.Image;
  private _music: Phaser.Sound.BaseSound;

  init(){
    this._text = this.add
      .text(this.game.canvas.width / 2, 200, "")
      .setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 0.5)
      .setColor('000')
      .setWordWrapWidth(1000)
      .setAlign(GameInfo.gameTitle.align)
      .setFontSize(50)
      .setFontFamily(GameInfo.gameTitle.font);
  }


  preload(){
    this.cameras.main.setBackgroundColor("fff");
    this.load.image("hole-with-text", "assets/images/other/hole-with-text.png");
    GameData.sounds.forEach((sound) => {
      this.load.audio("easterEggMusic", "../../assets/music/easterEgg.mp3");
    });
  }

  create(){
    this._music = this.sound.add("easterEggMusic", { loop: true, volume: 0.5 });
    this._music.play();

    this._hole = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2 + 100, "hole-with-text")
      .setOrigin(0.5, 0.5)
      .setDepth(1000)
      .setInteractive()
      .on('pointerdown', () => { this.goBack(); });
    this._text.setText("U really tried to close a web game with the exit button... :|");

    this.input.keyboard.on('keydown-ESC', () => { this.goBack(); });
    this.input.keyboard.on('keydown-SPACE', () => { this.goBack(); });
    this.input.keyboard.on('keydown-ENTER', () => { this.goBack(); });
  }

  goBack() {
    if (this._music && this._music.isPlaying) {
      this._music.stop();
    }

    this.scene.stop();
    this.scene.start("Boot");
  }

}