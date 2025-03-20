import { GameInfo } from "../GameInfo";

export default class GameOver extends Phaser.Scene {
  constructor(){ super({ key: "GameOver" }) }
  private _gameOverText: Phaser.GameObjects.Text;
  private _playAgainButton: Phaser.GameObjects.Text;

  create(){
    this.cameras.main.setBackgroundColor('#000');

    this._gameOverText = this.add
      .text(this.game.canvas.width / 2, this.game.canvas.height / 2, "Game Over")
      .setAlpha(1)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setFontSize(75)
      .setFontFamily(GameInfo.default.font);

    this._playAgainButton = this.add
      .text(this.game.canvas.width / 2, this.game.canvas.height / 2 + 50, "Play Again")
      .setAlpha(1)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setFontSize(25)
      .setFontFamily(GameInfo.default.font)
      .setInteractive().on('pointerdown', () => this.scene.start('Preloader'));
  }
}