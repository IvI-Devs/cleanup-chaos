import { GameInfo } from "../GameInfo";

export default class GameOver extends Phaser.Scene {
  constructor(public registry: Phaser.Data.DataManager){ super({ key: "GameOver" }) }
  private _gameOverText: Phaser.GameObjects.Text;
  private _playAgainButton: Phaser.GameObjects.Text;
  public score: number;
  private _scoreText: Phaser.GameObjects.Text;
  private _background: Phaser.GameObjects.Image;
  private _backToMenu: Phaser.GameObjects.Text;

  create(){
    this.cameras.main.setBackgroundColor('#000');
    this.score = this.registry.get("score") || 0;
    this._background = this.add.image(0, 0, "bootscreen-bg").setOrigin(0, 0);

    if(this.score > parseInt(localStorage.getItem('score'))){
      localStorage.setItem('score', this.score.toString());
    }

    this._backToMenu = this.add.text(75, 70, "Menu").setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1)
      .setColor("#fff")
      .setWordWrapWidth(1000)
      .setFontSize(35)
      .setFontFamily(GameInfo.default.font)
      .setInteractive()
      .on('pointerdown', () => { this.goToMenu() });

    this._gameOverText = this.add
      .text(this.game.canvas.width / 2, this.game.canvas.height / 2 - 100, "Game Over")
      .setAlpha(1)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setFontSize(100)
      .setFontFamily(GameInfo.default.font);

    this._scoreText = this.add
      .text(this.game.canvas.width / 2, this.game.canvas.height / 2 - 50, `Your score: ${this.score}`)
      .setAlpha(1)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setFontSize(40)
      .setFontFamily(GameInfo.default.font);

    this._playAgainButton = this.add
      .text(this.game.canvas.width / 2, this.game.canvas.height / 2 + 100, "Play Again")
      .setAlpha(1)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setFontSize(25)
      .setFontFamily(GameInfo.default.font)
      .setInteractive().on('pointerdown', () => this.playAgain() );


    this.input.keyboard.on('keydown-SPACE', () => { this.playAgain(); });
    this.input.keyboard.on('keydown-ENTER', () => { this.playAgain(); });
  }

  private playAgain(){
    this.scene.stop(this);
    this.scene.start('Preloader');
  }

  private goToMenu(){
    this.scene.stop(this);
    this.scene.start('Boot');
  }

}