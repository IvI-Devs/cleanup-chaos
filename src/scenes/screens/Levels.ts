import { GameInfo } from "../../GameInfo";

export default class Levels extends Phaser.Scene {
  constructor(){ super({ key: "Levels" }); }

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
  }

  init(){
    this._levelsText = this.add
      .text(this.game.canvas.width / 2, 200, "")
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
    this.currentLevel = Number(localStorage.getItem('level'));
    this._levelsGroup = this.physics.add.group();
    this._levelsGroup.clear(true, true);

    GameInfo.levels.forEach((level, index) => {
      let x = this.game.canvas.width / 6 - 25;
      let y = this.game.canvas.height / 2 - 50;
      const rectangle = this.add.image(x + (250 * index), y, 'pixel-art-rectangle').setOrigin(0, 0).setAlpha(0.3);
      const text = this.add.text(x+70 + (250 * index), y + 55, (index+1).toString(), {
        fontSize: '75px',
        color: '#ffffff',
        fontFamily: GameInfo.default.font
      }).setOrigin(0, 0).setAlpha(0.3);

      if(index < this.currentLevel){
        text.setAlpha(1).setInteractive().on('pointerdown', () => { this.play(index) });
        rectangle.setAlpha(1).setInteractive().on('pointerdown', () => { this.play(index) });
      }

      this._levelsGroup.add(rectangle);
      this._levelsGroup.add(text);
    })
    this.input.keyboard.on("keydown-ESC", () => { this.goToMenu(); });
    this.input.keyboard.on('keydown-ESC', () => { this.goToMenu(); });
  }

  private goToMenu(){
    this.scene.stop(this);
    this.scene.start('Boot');
  }

  private play(levelNumber: number){
    localStorage.setItem('selectedLevel', (levelNumber).toString())
    this.scene.stop(this);
    this.scene.start('Preloader');
  }

}