import { GameInfo } from "../../GameInfo";

export default class Levels extends Phaser.Scene {
  constructor(){ super({ key: "Levels" }); }

  private _background: Phaser.GameObjects.Image;
  private _levelsText: Phaser.GameObjects.Text;
  private _backToMenu: Phaser.GameObjects.Text
  private _highestScore: Phaser.GameObjects.Text;
  private _menuItems: Phaser.GameObjects.Text[];
  private _selectedIndex: number;

  init(){
    this._levelsText = this.add
      .text(this.game.canvas.width / 2, 250, "")
      .setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setWordWrapWidth(1000)
      .setAlign(GameInfo.gameTitle.align)
      .setFontSize(100)
      .setFontFamily(GameInfo.gameTitle.font);
    this._highestScore = this.add.text(0, 0, GameInfo.gameTitle.text).setFontFamily(GameInfo.default.font);
    this._backToMenu = this.add.text(75, 70, "Menu").setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1)
      .setColor("#fff")
      .setWordWrapWidth(1000)
      .setFontSize(35)
      .setFontFamily(GameInfo.default.font)
      .setInteractive()
      .on('pointerdown', () => { this.goToMenu() });
  }

  create(){
    this._background = this.add.image(0, 0, "bg-01").setOrigin(0, 0);
    this._levelsText.setText("Levels");
    this._highestScore.setFontFamily(GameInfo.default.font);

    this._menuItems = [];
    this._selectedIndex = 0;

    this._menuItems.push(this.add.text(0, 0, "Level 1").setFontFamily(GameInfo.default.font));
    this._menuItems.push(this.add.text(0, 0, "Level 2").setFontFamily(GameInfo.default.font));
    this._menuItems.push(this.add.text(0, 0, "Level 3").setFontFamily(GameInfo.default.font));

    this._menuItems.forEach((item, index) => {
      item.setOrigin(0.5, 0.5);
      item.setPosition(this.game.canvas.width / 2, this.game.canvas.height / 2 + index * 50);
    });

    this._menuItems[this._selectedIndex].setStyle({ fill: "#ff0000" });

    // this.input.keyboard.on("keydown", this.onKeyDown, this);
  }

  private goToMenu(){
    this.scene.stop(this);
    this.scene.start('Boot');
  }

}