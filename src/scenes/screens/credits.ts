import { GameInfo } from "../../GameInfo";
import { GameData } from "../../GameData";

export default class Credits extends Phaser.Scene {
  constructor(){ super({ key: "Credits" }) }
  private _background: Phaser.GameObjects.Image;
  private _title: Phaser.GameObjects.Text;
  private _backArrow: Phaser.GameObjects.Text;
  private _menuItems: any[] = [];
  private _selectedIndex = 0;
  private _music: Phaser.Sound.BaseSound;

  init(){
    this._backArrow = this.add.text(50, 75, "<").setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1)
      .setColor("#fff")
      .setWordWrapWidth(1000)
      .setFontSize(50)
      .setFontFamily(GameInfo.default.font)
      .setInteractive()
      .on('pointerdown', () => { this.goBack() });

    this._title = this.add
      .text(this.game.canvas.width / 2, 250, "")
      .setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setWordWrapWidth(1000)
      .setAlign(GameInfo.gameTitle.align)
      .setFontSize(100)
      .setFontFamily(GameInfo.gameTitle.font);
  }


  preload(){
    this.load.image("bg-02", "assets/images/backgrounds/bg-02.svg");
    this.load.audio("credits", "../../assets/music/credits.mp3");
  }

  create(){
    this._background = this.add.image(0, 0, "bg-02").setOrigin(0, 0);
    this._title.setText("Credits");

    this._music = this.sound.add("credits", { loop: true, volume: 0.5 });
    this._music.play();

    this._menuItems = [];
    this._selectedIndex = 0;
    this.createMenu();

    this.input.keyboard.on('keydown-ESC', () => { this.goBack(); });
  }

  createMenu(){
    for(let i = 0; i < GameInfo.credits.length; i++){
      const item = `${GameInfo.credits[i]}`;
      const x = this.game.canvas.width / 2;
      const y = 400 + i * 75;

      let menuItem = this.add.text(x, y, item, {
        fontSize: GameInfo.options.fontSize,
        fontFamily: GameInfo.options.font,
        color: '#fff'
      }).setOrigin(0.5);

      this._menuItems.push(menuItem);
    }
  }

  goBack() {
    if (this._music && this._music.isPlaying) {
      this._music.stop();
    }

    this.scene.stop();
    this.scene.start("Boot");
  }

}