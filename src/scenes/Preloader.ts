import { GameData } from "../GameData";
import { GameInfo } from "../GameInfo";
import WebFontFile from "../scenes/webFontFile";

export default class Preloader extends Phaser.Scene {
  constructor(){ super({ key: "Preloader" }) }
  private _loading: Phaser.GameObjects.Text;
  private _progress: Phaser.GameObjects.Graphics;
  private _image: Phaser.GameObjects.Image;
  private _background: Phaser.GameObjects.Image;
  private _gameTitle: Phaser.GameObjects.Text;

  preload() {
    this.cameras.main.setBackgroundColor(GameData.globals.bgColor);
    this._progress = this.add.graphics();
    this.loadAssets();
  }

  init(){
    this._background = this.add.image(0, 0, "bootscreen-bg").setOrigin(0, 0);
    this._gameTitle = this.add
      .text(this.game.canvas.width / 2, 250, GameInfo.gameTitle.text)
      .setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setWordWrapWidth(1000)
      .setAlign(GameInfo.gameTitle.align)
      .setFontSize(100)
      .setFontFamily(GameInfo.gameTitle.font);

    this.tweens.add({
      targets: [this._image],
      alpha: 1,
      duration: 500,
    });

    this._loading = this.add
      .text(this.game.canvas.width / 2, GameData.preloader.loadingTextY, "")
      .setAlpha(1)
      .setDepth(1001)
      .setOrigin(0.5, 1)
      .setColor('#fff')
      .setFontSize(40)
      .setFontFamily(GameData.preloader.loadingTextFont);
  }

  loadAssets(): void {
    this.load.on("start", () => {});
    // this.load.on("fileprogress", (file: any, value: any) => {});
    // this.load.on("progress", (value: number) => {
    //   this._progress.clear();
    //   this._progress.fillStyle(GameData.preloader.loadingBarColor, 1);
    //   this._progress.fillRect(0, GameData.preloader.loadingBarY, GameData.globals.gameWidth * value, 70);
    //   this._loading.setText(GameData.preloader.loadingText + " " + Math.round(value * 100) + "%");
    // });

    this.load.on("complete", () => {
      this._progress.clear();
      this._loading.setText(GameData.preloader.loadingTextComplete);

      this.input.keyboard.on("keydown", () => {
        this.tweens.add({
          targets: [this._image, this._loading],
          alpha: 0,
          duration: 500,
          onComplete: () => {
            this.scene.stop("Preloader");
            this.scene.start("Intro");
          },
        });
      });
    });

    //-------------------------- Assets Load

    //WEB FONT
    if(GameData.webfonts != null){
      let _fonts: Array<string> = [];
      GameData.webfonts.forEach((element: FontAsset) => {
        _fonts.push(element.key);
      });
      this.load.addFile(new WebFontFile(this.load, _fonts));
    }

    // local FONT
    if (GameData.fonts != null) {
      let _fonts: Array<string> = [];
      GameData.fonts.forEach((element: FontAsset) => {
        this.load.font(element.key, element.path, element.type);
      });
    }

    // SCRIPT
    if (GameData.scripts != null)
      GameData.scripts.forEach((element: ScriptAsset) => {
        this.load.script(element.key, element.path);
      });

    // IMAGES
    if (GameData.images != null)
      GameData.images.forEach((element: ImageAsset) => {
        this.load.image(element.name, element.path);
      });

    // TILEMAPS
    if (GameData.tilemaps != null)
      GameData.tilemaps.forEach((element: TileMapsAsset) => {
        this.load.tilemapTiledJSON(element.key, element.path);
      });

    // ATLAS
    if (GameData.atlas != null)
      GameData.atlas.forEach((element: AtlasAsset) => {
        this.load.atlas(element.key, element.imagepath, element.jsonpath);
      });

    // SPRITESHEETS
    if (GameData.spritesheets != null)
      GameData.spritesheets.forEach((element: SpritesheetsAsset) => {
        this.load.spritesheet(element.name, element.path, { frameWidth: element.width, frameHeight: element.height, endFrame: element.frames });
      });

    // video
    if (GameData.videos != null) {
      GameData.videos.forEach((element: VideoAsset) => {
        this.load.video(element.name, element.path, true);
      });
    }

    // bitmap fonts
    if (GameData.bitmapfonts != null)
      GameData.bitmapfonts.forEach((element: BitmapfontAsset) => {
        this.load.bitmapFont(element.name, element.imgpath, element.xmlpath);
      });

    // SOUNDS
    if (GameData.sounds != null)
      GameData.sounds.forEach((element: SoundAsset) => {
        this.load.audio(element.name, element.paths);
      });

    // Audio
    if(GameData.audios != null){
      GameData.audios.forEach((element: AudioSpriteAsset) => {
        this.load.audioSprite(element.name, element.jsonpath, element.paths, element.instance);
      });
    }

  }
}