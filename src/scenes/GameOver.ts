import { GameInfo } from "../GameInfo";

export default class GameOver extends Phaser.Scene {
  constructor(public registry: Phaser.Data.DataManager){ super({ key: "GameOver" }) }
  private _gameOverText: Phaser.GameObjects.Text;
  private _playAgainButton: Phaser.GameObjects.Text;
  private _subtitle: Phaser.GameObjects.Text;
  private _background: Phaser.GameObjects.Image;
  private _backToMenu: Phaser.GameObjects.Text;
  private _playAgainRectangle: Phaser.GameObjects.Image;
  public score: number;

  create(){
    this.cameras.main.setBackgroundColor('#000');
    this.score = this.registry.get("score") || 0;
    this._background = this.add.image(0, 0, "bootscreen-bg").setOrigin(0, 0);

    const music = this.registry.get('backgroundMusic') as Phaser.Sound.BaseSound;
    if (music && music.isPlaying) {
      music.stop();
    }

    if(this.score > parseInt(localStorage.getItem('score'))) localStorage.setItem('score', this.score.toString());

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
      .text(this.game.canvas.width / 2, this.game.canvas.height / 2 - 50, "Game Over")
      .setAlpha(1)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setFontSize(100)
      .setFontFamily(GameInfo.default.font);

    this._subtitle = this.add
      .text(this.game.canvas.width - 50, this.game.canvas.height - 50, "")
      .setAlpha(1)
      .setOrigin(1, 1)
      .setColor('#0099DB')
      .setFontSize(40)
      .setFontFamily(GameInfo.default.font);

    this._playAgainButton = this.add
      .text(this.game.canvas.width / 2, this.game.canvas.height / 2 + 50, "Play Again")
      .setAlpha(1)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setFontSize(30)
      .setFontFamily(GameInfo.default.font)
      .setInteractive().on('pointerdown', () => this.playAgain() );

    // this._playAgainRectangle = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2 + 90, 'pixel-art-rectangle-3')
    //   .setAlpha(1)
    //   .setOrigin(0.5, 1)
    //   .setInteractive().on('pointerdown', () => this.playAgain() );

    this.input.keyboard.on('keydown-ESC', () => { this.goToMenu(); });
    this.input.keyboard.on('keydown-SPACE', () => { this.playAgain(); });
    this.input.keyboard.on('keydown-ENTER', () => { this.playAgain(); });

    if(localStorage.getItem('gameMode') == 'arcade') this._subtitle.setText(`Your score: ${this.score}`);
    else this._subtitle.setText(`Level ${parseInt(localStorage.getItem('selectedLevel'))+1}`)
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