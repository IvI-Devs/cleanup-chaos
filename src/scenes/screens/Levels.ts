import { GameInfo } from "../../GameInfo";

export default class Levels extends Phaser.Scene {
  constructor(){ super({ key: "Levels" }); }

  private _background: Phaser.GameObjects.Image;
  private _gameTitle: Phaser.GameObjects.Text;
  private _highestScore: Phaser.GameObjects.Text;
  private _menuItems: Phaser.GameObjects.Text[];
  private _selectedIndex: number;

  create(){
    this._background = this.add.image(0, 0, "levels-bg").setOrigin(0, 0);
    this._gameTitle.setText(GameInfo.gameTitle.text);
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

}