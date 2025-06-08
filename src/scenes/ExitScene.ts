import { GameInfo } from "../GameInfo";
import { GameData } from "../GameData";

export default class ExitScene extends Phaser.Scene {
  constructor(){ super({ key: "ExitScene" }) }
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


  preload() {
    this.cameras.main.setBackgroundColor("fff");
    this.load.image("hole-with-text", "../assets/images/other/hole-with-text.png");
    this.load.audio("menuSelect", "assets/sounds/menuSelect.mp3"); // Carica il sound effect
    GameData.sounds.forEach((sound) => {
      this.load.audio("easterEggMusic", "../assets/music/easterEgg.mp3");
    });
  }

  create() {
    const musicEnabled = localStorage.getItem('musicEnabled') === 'true';
    if (musicEnabled) {
      this._music = this.sound.add("easterEggMusic", { loop: true, volume: 0.5 });
      this._music.play();
    }

    this._hole = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2 + 100, "hole-with-text")
      .setOrigin(0.5, 0.5)
      .setDepth(1000)
      .setInteractive()
      .on('pointerdown', () => { 
        if (localStorage.getItem('soundEffectsEnabled') === 'true') {
          this.sound.play('menuSelect'); // Suona quando si clicca sul buco
        }
        this.goBack(); 
      });

    this._text.setText("U really tried to close a web game with the exit button... :|");

    this.input.keyboard.on('keydown-ESC', () => { 
      if (localStorage.getItem('soundEffectsEnabled') === 'true') {
        this.sound.play('menuSelect'); // Suona quando si preme ESC
      }
      this.goBack(); 
    });

    this.input.keyboard.on('keydown-SPACE', () => { 
      if (localStorage.getItem('soundEffectsEnabled') === 'true') {
        this.sound.play('menuSelect'); // Suona quando si preme SPACE
      }
      this.goBack(); 
    });

    this.input.keyboard.on('keydown-ENTER', () => { 
      if (localStorage.getItem('soundEffectsEnabled') === 'true') {
        this.sound.play('menuSelect'); // Suona quando si preme ENTER
      }
      this.goBack(); 
    });
  }

  goBack() {
    if (this._music && this._music.isPlaying) {
      this._music.stop();
    }

    this.scene.stop();
    this.scene.start("MainMenuScene");
  }

}