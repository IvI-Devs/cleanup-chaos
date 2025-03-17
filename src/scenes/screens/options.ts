import { GameInfo } from "../../gameInfo";
import { GameData } from "../../GameData";

export default class Options extends Phaser.Scene {
  constructor(){ super({ key: "Options" }) }
  private _background: Phaser.GameObjects.Image;
  private _title: Phaser.GameObjects.Text;
  private _backArrow: Phaser.GameObjects.Text;
  private _menuItems: any[] = [];
  private _selectedIndex = 0;

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

  create(){
    this._background = this.add.image(0, 0, "bootscreen-bg").setOrigin(0, 0);
    this._title.setText("Options");

    this._menuItems = [];
    this._selectedIndex = 0;
    this.createMenu();

    this.input.keyboard.on('keydown-ESC', () => { this.goBack(); });
  }

  createMenu(){
    for(let i = 0; i < GameInfo.options.items.length; i++){
      const item = GameInfo.menu.items[i];
      const x = this.game.canvas.width / 2;
      const y = 400 + i * 75;

      let menuItem = this.add.text(x, y, item, {
        fontSize: GameInfo.options.fontSize,
        fontFamily: GameInfo.options.font,
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
  }

  updateMenu() {
    for(let i = 0; i < this._menuItems.length; i++){
      if(i === this._selectedIndex){
        this._menuItems[i].setText(`> ${GameInfo.options.items[i]} <`);
      }
      else this._menuItems[i].setText(GameInfo.options.items[i]);
    }
  }

  selectItem(index: number){
    switch(GameInfo.options.items[index]){
      case GameInfo.menu.items[0]:
        console.log("Disable music");
        break;
      case GameInfo.options.items[1]:
      console.log("Disable SFX");
        break;
      case GameInfo.options.items[2]:
        console.log("Commands");
        break;
      case 'Exit':
        this.game.destroy(true);
        break;
    }
  }

  goBack(){
    this.scene.stop(this);
    this.scene.start("Boot");
  }

}