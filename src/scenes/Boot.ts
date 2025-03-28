import { GameInfo } from "../GameInfo";
import WebFontFile from "../scenes/webFontFile";

export default class Boot extends Phaser.Scene {
  constructor(){ super({ key: "Boot" }) }
  private _background: Phaser.GameObjects.Image;
  private _gameTitle: Phaser.GameObjects.Text;
  private _arcadeMode: Phaser.GameObjects.Text;
  private _menuItems: any[] = [];
  private _selectedIndex = 0;

  preload(){
    this.cameras.main.setBackgroundColor("000");
    this.load.image("bg-04", "assets/images/backgrounds/bg-04.svg");
    this.load.image("bootscreen-bg", "assets/images/backgrounds/bootscreen.svg");
    this.load.addFile(new WebFontFile(this.load, 'Pixelify Sans')); // font preload
  }

  init(){
    this._gameTitle = this.add
      .text(this.game.canvas.width / 2, 250, "")
      .setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setWordWrapWidth(1000)
      .setAlign(GameInfo.gameTitle.align)
      .setFontSize(100)
      .setFontFamily(GameInfo.gameTitle.font);

    if(localStorage.getItem('level') === null) localStorage.setItem('level', '1');

    if(localStorage.getItem('score') === null) localStorage.setItem('score', '0');
    this._arcadeMode = this.add.text(this.game.canvas.width - 175, this.game.canvas.height - 50, "")
      .setDepth(1001)
      .setOrigin(0.5, 1)
      .setColor('#0099DB')
      .setFontSize(35)
      .setFontFamily(GameInfo.default.font)
      .setInteractive()
      .on("pointerdown", () => {
        localStorage.setItem('gameMode', 'arcade');
        this.scene.stop(this);
        this.scene.start('Preloader');
      });

    // if(localStorage.getItem('gameMode') === null) localStorage.setItem('gameMode', 'arcade');
  }

  create(){
    this._background = this.add.image(0, 0, "bg-04").setOrigin(0, 0);
    if(localStorage.getItem('score') != null) this._arcadeMode.setText("Arcade Mode");
    this._gameTitle.setText(GameInfo.gameTitle.text);

    this._menuItems = [];
    this._selectedIndex = 0;
    this.createMenu();
  }

  createMenu(){
    for(let i = 0; i < GameInfo.menu.items.length; i++){
      const item = GameInfo.menu.items[i];
      const x = this.game.canvas.width / 2;
      const y = 400 + i * 75;

      let menuItem = this.add.text(x, y, item, {
        fontSize: GameInfo.menu.fontSize,
        fontFamily: GameInfo.menu.font,
        color: '#fff'
      })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => { this.selectItem(i); })
      .on('pointerover', () => {
          this._selectedIndex = i;
          this.updateMenu();
      });

      this._menuItems.push(menuItem);
    }

    this.input.keyboard.on('keydown-UP', () => {
        this._selectedIndex = (this._selectedIndex - 1 + this._menuItems.length) % this._menuItems.length;
        this.updateMenu();
    });

    this.input.keyboard.on('keydown-DOWN', () => {
        this._selectedIndex = (this._selectedIndex + 1) % this._menuItems.length;
        this.updateMenu();
    });

    this.input.keyboard.on('keydown-ENTER', () => {
        this.selectItem(this._selectedIndex);
    });

    this.input.keyboard.on('keydown-SPACE', () => {
        this.selectItem(this._selectedIndex);
    });
  }

  updateMenu() {
      for(let i = 0; i < this._menuItems.length; i++){
        if(i === this._selectedIndex){
          this._menuItems[i].setText(`> ${GameInfo.menu.items[i]} <`);
        }
        else this._menuItems[i].setText(GameInfo.menu.items[i]);
      }
  }

  selectItem(index: number){
    switch(GameInfo.menu.items[index]){
      case 'Start Game':
        localStorage.setItem('gameMode', 'levels')
        this.scene.stop(this)
        this.scene.start('Levels');
        break;
      case 'Options':
        this.scene.stop(this)
        this.scene.start('GameOver');
        break;
      case 'Credits':
        this.scene.stop(this)
        this.scene.start('Credits');
        break;
      case 'Exit':
        this.scene.stop(this)
        this.scene.start('Exit');
        // this.game.destroy(true);
        break;
    }
  }

}