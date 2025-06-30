import { GameInfo } from "../GameInfo";

export default class LevelSelectScene extends Phaser.Scene {
  constructor(){ super({ key: "LevelSelectScene" }); }

  private _background: Phaser.GameObjects.Image;
  private _levelsText: Phaser.GameObjects.Text;
  private _backToMenu: Phaser.GameObjects.Text
  private _highestScore: Phaser.GameObjects.Text;
  private _menuItems: Phaser.GameObjects.Text[];
  private currentLevel: number;

  private _levelsGroup: Phaser.GameObjects.Group;

  preload(){
    this.load.image("bg-01", "assets/images/backgrounds/bg-01.svg");
    this.load.image("pixel-art-rectangle", "assets/images/other/pixel-art-rectangle.svg");
    this.load.audio("menuSelect", "assets/sounds/menuSelect.mp3");
  }

  init(){
    this._levelsText = this.add
      .text(this.scale.width / 2, this.scale.height * 0.2, "")
      .setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setWordWrapWidth(1000)
      .setAlign(GameInfo.gameTitle.align)
      .setFontSize(Math.min(this.scale.width / 15, 100))
      .setFontFamily(GameInfo.gameTitle.font);
    this._highestScore = this.add.text(0, 0, GameInfo.gameTitle.text).setFontFamily(GameInfo.default.font);
    this._backToMenu = this.add.text(75, this.scale.height * 0.08, "Menu").setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1)
      .setColor("#fff")
      .setWordWrapWidth(1000)
      .setFontSize(Math.min(this.scale.width / 35, 35))
      .setFontFamily(GameInfo.default.font)
      .setInteractive()
      .on('pointerdown', () => { 
        if (localStorage.getItem('soundEffectsEnabled') === 'true') {
          this.sound.play('menuSelect');
        }
        this.goToMenu(); 
      });
  }

  create(){
    this._background = this.add.image(0, 0, "bg-01").setOrigin(0, 0);
    // Scale background to cover entire screen
    const scaleX = this.scale.width / this._background.width;
    const scaleY = this.scale.height / this._background.height;
    const scale = Math.max(scaleX, scaleY);
    this._background.setScale(scale);
    this._levelsText.setText("Levels");
    this._highestScore.setFontFamily(GameInfo.default.font);
    this.currentLevel = Number(localStorage.getItem('level'));
    this._levelsGroup = this.physics.add.group();
    this._levelsGroup.clear(true, true);

    GameInfo.levels.forEach((level, index) => {
      let x = this.scale.width / 6 - 25;
      let y = this.scale.height / 2 - 50;
      const rectangle = this.add.image(x + (this.scale.width / 5 * index), y, 'pixel-art-rectangle').setOrigin(0, 0).setAlpha(0.3)
        .setScale(Math.min(this.scale.width / 1200, 1));
      const text = this.add.text(x + 70 + (this.scale.width / 5 * index), y + 55, (index+1).toString(), {
        fontSize: `${Math.min(this.scale.width / 20, 75)}px`,
        color: '#ffffff',
        fontFamily: GameInfo.default.font
      }).setOrigin(0, 0).setAlpha(0.3);

      if(index < this.currentLevel){
        text.setAlpha(1).setInteractive().on('pointerdown', () => { 
          if (localStorage.getItem('soundEffectsEnabled') === 'true') {
            this.sound.play('menuSelect');
          }
          this.play(index); 
        });
        rectangle.setAlpha(1).setInteractive().on('pointerdown', () => { 
          if (localStorage.getItem('soundEffectsEnabled') === 'true') {
            this.sound.play('menuSelect');
          }
          this.play(index); 
        });
      }

      this._levelsGroup.add(rectangle);
      this._levelsGroup.add(text);
    });

    this.input.keyboard.on("keydown-ESC", () => { 
      if (localStorage.getItem('soundEffectsEnabled') === 'true') {
        this.sound.play('menuSelect');
      }
      this.goToMenu(); 
    });
  }

  private goToMenu(){
    this.scene.stop(this);
    this.scene.start('MainMenuScene');
  }

  private play(levelNumber: number){
    localStorage.setItem('selectedLevel', (levelNumber).toString());
    this.scene.stop(this);
    this.scene.start('Preloader');
  }

}