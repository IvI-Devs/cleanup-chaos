import { GameInfo } from "../GameInfo";
import WebFontFile from "../scenes/webFontFile";

export default class Boot extends Phaser.Scene {
  constructor(){ super({ key: "Boot" }) }
  private _background: Phaser.GameObjects.Image;
  private _gameTitle: Phaser.GameObjects.Text;
  private _highestScore: Phaser.GameObjects.Text;
  private _menuItems: any[] = [];
  private _selectedIndex = 0;

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

    if(localStorage.getItem('score') === null){
      localStorage.setItem('score', '0');
    }
    else{
      this._highestScore = this.add.text(this.game.canvas.width / 2 + 275, 300, `High Score: ${localStorage.getItem('score')}`)
        .setDepth(1001)
        .setOrigin(0.5, 1)
        .setColor('#fff')
        .setFontSize(40)
        .setFontFamily(GameInfo.default.font);
    }
  }

  preload(){
    this.cameras.main.setBackgroundColor("000");
    this.load.image("bootscreen-bg", "assets/images/backgrounds/bootscreen.svg");
    this.load.addFile(new WebFontFile(this.load, 'Pixelify Sans')); // font preload
  }

  create() {
    this._background = this.add.image(0, 0, "bootscreen-bg").setOrigin(0, 0);
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
        this.scene.stop(this)
        this.scene.start('Preloader');
        break;
      case 'Options':
        this.scene.stop(this)
        this.scene.start('Options');
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