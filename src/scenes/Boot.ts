import { GameInfo } from "../gameInfo";
import { GameData } from "../GameData";

export default class Boot extends Phaser.Scene {
  constructor(){ super({ key: "Boot" }) }
  private _background: Phaser.GameObjects.Image;
  private _gameTitle: Phaser.GameObjects.Text;
  private menuItems: any[] = [];
  private selectedIndex = 0;

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
  }

  preload(){
    this.cameras.main.setBackgroundColor("fff");
    this.load.image("bootscreen-bg", "assets/images/backgrounds/bootscreen.svg");
  }

  create(){
    this._background = this.add.image(0, 0, "bootscreen-bg").setOrigin(0, 0);
    this._gameTitle.setText(GameInfo.gameTitle.text);

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
          this.selectedIndex = i;
          this.updateMenu();
      });

      this.menuItems.push(menuItem);
    }

    this.input.keyboard.on('keydown-UP', () => {
        this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
        this.updateMenu();
    });

    this.input.keyboard.on('keydown-DOWN', () => {
        this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
        this.updateMenu();
    });

    this.input.keyboard.on('keydown-ENTER', () => {
        this.selectItem(this.selectedIndex);
    });

    this.updateMenu();
}

  updateMenu() {
      for(let i = 0; i < this.menuItems.length; i++){
        if(i === this.selectedIndex){
            this.menuItems[i].setText(`> ${GameInfo.menu.items[i]} <`);
        }
        else this.menuItems[i].setText(GameInfo.menu.items[i]);
      }
  }

  selectItem(index: number){
    switch(GameInfo.menu.items[index]){
      case 'Credits':
        this.scene.start('Credits');
        break;
      case 'Options':
        this.scene.start('Options');
        break;
      case 'Start Game':
        this.scene.start('Preloader');
        break;
      case 'Exit':
        this.game.destroy(true);
        break;
    }
  }


  // update(time: number, delta: number): void {
  //   this._text.angle += 1;
  // }

}