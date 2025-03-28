import { GameInfo } from "../GameInfo";

export default class PauseMenu extends Phaser.Scene {
  private _menuItems: Phaser.GameObjects.Text[] = [];
  private _selectedIndex: number = 0;

  constructor() {
    super({ key: "PauseMenu" });
  }

  create() {
    this._menuItems = [];
    this._selectedIndex = 0;
  
    const { width, height } = this.scale;
  
    // Semi-clear background
    this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);
  
    const music = this.registry.get('backgroundMusic') as Phaser.Sound.BaseSound;

    // Stop musics
    if (music && music.isPlaying) {
      music.pause();
    }

    // Menu title
    this.add.text(width / 2, height / 2 - 150, "Pause Menu", {
      fontSize: "48px",
      fontFamily: GameInfo.default.font,
      color: "#ffffff",
    }).setOrigin(0.5);
  
    // Menu entries
    const menuItems = ["Resume", "Restart", "Exit"];
    menuItems.forEach((item, index) => {
      const menuItem = this.add.text(width / 2, height / 2 - 50 + index * 50, item, {
        fontSize: "32px",
        fontFamily: GameInfo.default.font,
        color: "#ffffff",
      })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => this.selectItem(index))
        .on("pointerover", () => {
          this._selectedIndex = index;
          this.updateMenu();
        });
  
      this._menuItems.push(menuItem);
    });
  
    // Keyboard inputs
    this.input.keyboard.on("keydown-UP", () => {
      this._selectedIndex = (this._selectedIndex - 1 + this._menuItems.length) % this._menuItems.length;
      this.updateMenu();
    });
  
    this.input.keyboard.on("keydown-DOWN", () => {
      this._selectedIndex = (this._selectedIndex + 1) % this._menuItems.length;
      this.updateMenu();
    });
  
    this.input.keyboard.on("keydown-ENTER", () => {
      this.selectItem(this._selectedIndex);
    });

    this.input.keyboard.on("keydown-ESC", () => {
      if (music) {
        music.resume();
      }
      this.scene.stop();
      this.scene.resume("Intro");
    });
  
    this.updateMenu();
  }

  private updateMenu() {
    this._menuItems.forEach((menuItem, index) => {
      const cleanText = menuItem.text.replace(/> | </g, "");
  
      if (index === this._selectedIndex) {
        menuItem.setText(`> ${cleanText} <`);
      } else {
        menuItem.setText(cleanText);
      }
    });
  }

  private selectItem(index: number) {
    const music = this.registry.get('backgroundMusic') as Phaser.Sound.BaseSound;
    switch (index) {
      case 0: // Resume
        if (music && music.isPaused) {
          music.resume();
        }
        this.scene.stop();
        this.scene.resume("Intro");
        break;
      case 1: // Restart
        if (music && music.isPlaying) {
          music.stop();
        }
        this.scene.stop();
        this.scene.stop("Intro");
        this.scene.start("Preloader");
        break;
      case 2: // Exit
        if (music && music.isPlaying) {
          music.stop();
        }
        this.scene.stop("Intro");
        this.scene.stop("Minimap")
        this.scene.start("Boot");
        break;
    }
  }
}