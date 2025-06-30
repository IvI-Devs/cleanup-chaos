import { GameInfo } from "../GameInfo";
import { GameData } from "../GameData";

export default class CreditsScene extends Phaser.Scene {
  constructor(){ super({ key: "CreditsScene" }) }
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
      .setFontSize(Math.min(this.scale.width / 25, 50))
      .setFontFamily(GameInfo.default.font)
      .setInteractive()
      .on('pointerdown', () => { this.goBack() });

    this._title = this.add
      .text(this.scale.width / 2, this.scale.height * 0.2, "")
      .setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setWordWrapWidth(1000)
      .setAlign(GameInfo.gameTitle.align)
      .setFontSize(Math.min(this.scale.width / 15, 100))
      .setFontFamily(GameInfo.gameTitle.font);
  }


  preload(){
    this.load.image("bg-02", "assets/images/backgrounds/bg-02.svg");
    this.load.audio("credits", "assets/music/credits.mp3");
    this.load.audio("menuSelect", "assets/sounds/menuSelect.mp3");
  }

  create(){
    this._background = this.add.image(0, 0, "bg-02").setOrigin(0, 0);
    // Scale background to cover entire screen
    const scaleX = this.scale.width / this._background.width;
    const scaleY = this.scale.height / this._background.height;
    const scale = Math.max(scaleX, scaleY);
    this._background.setScale(scale);
    
    this._title.setText("Credits");

    const musicEnabled = localStorage.getItem('musicEnabled') === 'true';
    if (musicEnabled) {
      this._music = this.sound.add("credits", { loop: true, volume: 0.5 });
      this._music.play();
    }

    this._menuItems = [];
    this._selectedIndex = 0;
    this.createMenu();

    this.input.keyboard.on('keydown-ESC', () => { 
      if (localStorage.getItem('soundEffectsEnabled') === 'true') {
        this.sound.play('menuSelect');
      }
      this.goBack(); 
    });

    this.input.keyboard.on('keydown-SPACE', () => { 
      if (localStorage.getItem('soundEffectsEnabled') === 'true') {
        this.sound.play('menuSelect');
      }
      this.goBack(); 
    });

    this.input.keyboard.on('keydown-ENTER', () => { 
      if (localStorage.getItem('soundEffectsEnabled') === 'true') {
        this.sound.play('menuSelect');
      }
      this.goBack(); 
    });

    this._backArrow.setInteractive().on('pointerdown', () => {
      if (localStorage.getItem('soundEffectsEnabled') === 'true') {
        this.sound.play('menuSelect');
      }
      this.goBack();
    });
  }

  createMenu(){
    for(let i = 0; i < GameInfo.credits.length; i++){
      const item = `${GameInfo.credits[i]}`;
      const x = this.scale.width / 2;
      const y = this.scale.height * 0.4 + i * Math.min(this.scale.height / 15, 75);

      let menuItem = this.add.text(x, y, item, {
        fontSize: `${Math.min(this.scale.width / 30, GameInfo.options.fontSize)}px`,
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
    this.scene.start("MainMenuScene");
  }

}