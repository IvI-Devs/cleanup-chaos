import { GameInfo } from "../GameInfo";

export default class GameOverScene extends Phaser.Scene {
  constructor(public registry: Phaser.Data.DataManager){ super({ key: "GameOverScene" }) }
  private _gameOverText: Phaser.GameObjects.Text;
  private _playAgainButton: Phaser.GameObjects.Text;
  private _subtitle: Phaser.GameObjects.Text;
  private _background: Phaser.GameObjects.Image;
  private _backToMenu: Phaser.GameObjects.Text;
  private _playAgainRectangle: Phaser.GameObjects.Image;
  public score: number;
  private isVictory: boolean = false;

  preload(){
    this.load.audio("death", "assets/sounds/explosion.wav");
    this.load.audio("victory", "assets/sounds/victory.mp3");
  }

  init(data: any) {
    this.isVictory = data && data.victory === true;
  }

  create(){
    this.cameras.main.setBackgroundColor('#000');
    this.score = this.registry.get("score") || 0;
    this._background = this.add.image(0, 0, "bootscreen-bg").setOrigin(0, 0);
    // Scale background to cover entire screen
    const scaleX = this.scale.width / this._background.width;
    const scaleY = this.scale.height / this._background.height;
    const scale = Math.max(scaleX, scaleY);
    this._background.setScale(scale);

    const music = this.registry.get('backgroundMusic') as Phaser.Sound.BaseSound;
    if (music && music.isPlaying) {
      music.stop();
    }

    const soundEffectsEnabled = localStorage.getItem('soundEffectsEnabled') === 'true';
    if (soundEffectsEnabled) {
        if (this.isVictory) {
            this.sound.play('victory', { volume: 0.5 });
        } else {
            this.sound.play('death', { volume: 0.5 });
        }
    }

    if(this.score > parseInt(localStorage.getItem('score'))) localStorage.setItem('score', this.score.toString());

    this._backToMenu = this.add.text(75, this.scale.height * 0.08, "Menu").setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1)
      .setColor("#fff")
      .setWordWrapWidth(1000)
      .setFontSize(Math.min(this.scale.width / 35, 35))
      .setFontFamily(GameInfo.default.font)
      .setInteractive()
      .on('pointerdown', () => { this.goToMenu() });

    const mainText = this.isVictory ? "Victory!" : "Game Over";
    const mainTextColor = this.isVictory ? '#ffff00' : '#fff';
    
    this._gameOverText = this.add
      .text(this.scale.width / 2, this.scale.height / 2 - this.scale.height * 0.05, mainText)
      .setAlpha(1)
      .setOrigin(0.5, 1)
      .setColor(mainTextColor)
      .setFontSize(Math.min(this.scale.width / 15, 100))
      .setFontFamily(GameInfo.default.font);

    // Add victory animation
    if (this.isVictory) {
        this.tweens.add({
            targets: this._gameOverText,
            scaleX: { from: 1, to: 1.1 },
            scaleY: { from: 1, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    this._subtitle = this.add
      .text(this.scale.width - 50, this.scale.height - 50, "")
      .setAlpha(1)
      .setOrigin(1, 1)
      .setColor('#0099DB')
      .setFontSize(Math.min(this.scale.width / 30, 40))
      .setFontFamily(GameInfo.default.font);

    const buttonText = this.isVictory ? "Play Again" : "Try Again";
    
    this._playAgainButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + this.scale.height * 0.08, buttonText)
      .setAlpha(1)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setFontSize(Math.min(this.scale.width / 40, 30))
      .setFontFamily(GameInfo.default.font)
      .setInteractive().on('pointerdown', () => this.playAgain() );

    // this._playAgainRectangle = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2 + 90, 'pixel-art-rectangle-3')
    //   .setAlpha(1)
    //   .setOrigin(0.5, 1)
    //   .setInteractive().on('pointerdown', () => this.playAgain() );

  this.input.keyboard.on('keydown-ESC', () => { 
    if (localStorage.getItem('soundEffectsEnabled') === 'true') {
      this.sound.play('menuSelect', { volume: 0.5 }); 
    }
    this.goToMenu(); 
  });

  this.input.keyboard.on('keydown-SPACE', () => { 
    if (localStorage.getItem('soundEffectsEnabled') === 'true') {
      this.sound.play('menuSelect', { volume: 0.5 });
    }
    this.playAgain(); 
  });

  this.input.keyboard.on('keydown-ENTER', () => { 
    if (localStorage.getItem('soundEffectsEnabled') === 'true') {
      this.sound.play('menuSelect', { volume: 0.5 });
    }
    this.playAgain(); 
  });

    if(localStorage.getItem('gameMode') == 'arcade') {
        this._subtitle.setText(`Your score: ${this.score}`);
    } else {
        if (this.isVictory) {
            this._subtitle.setText(`Final Score: ${this.score}`);
        } else {
            this._subtitle.setText(`Level ${parseInt(localStorage.getItem('selectedLevel'))+1}`);
        }
    }
  }

  private playAgain(){
    this.scene.stop(this);
    if (this.isVictory) {
        // After victory, go back to level selection to choose what to play next
        this.scene.start('LevelSelectScene');
    } else {
        // After game over, restart from the preloader to try again
        this.scene.start('Preloader');
    }
  }

  private goToMenu(){
    this.scene.stop(this);
    this.scene.start('MainMenuScene');
  }

}