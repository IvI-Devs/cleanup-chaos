import { GameData } from "../GameData";
import { GameInfo } from "../GameInfo";
import MinimapOverlay from "./MinimapOverlay";

export default class GameScene extends Phaser.Scene {
  constructor(public registry: Phaser.Data.DataManager){ super({ key: "GameScene" }); }
  public score: number = 0;
  public hearts: number = 3;

  private _background: Phaser.GameObjects.TileSprite;
  public static ship: Phaser.GameObjects.Image;
  private _scoreText: Phaser.GameObjects.Text;
  private cursor: Phaser.Types.Input.Keyboard.CursorKeys;
  private _speed: number = 250;
  private currentLevel: number = 0;

  public static asteroids: Phaser.Physics.Arcade.Group;
  public static trashGroup: Phaser.Physics.Arcade.Group;
  private heartsGroup: Phaser.GameObjects.Group;
  public static powerUps: Phaser.Physics.Arcade.Group;
  private asteroidSpeed: number = 150;
  private trashSpeed: number = 150;

  private powerUpsIndicators: Record<string, Phaser.GameObjects.Image> = {};
  private isBoostSoundPlaying: boolean = false;

  private keys: {
    W: Phaser.Input.Keyboard.Key,
    A: Phaser.Input.Keyboard.Key,
    S: Phaser.Input.Keyboard.Key,
    D: Phaser.Input.Keyboard.Key
  };

  preload() {
    this.load.audio("menuSelect", "assets/sounds/menuSelect.mp3");
    this.load.audio("collision", "assets/sounds/collision.mp3");
    this.load.audio("boost", "assets/sounds/boost.mp3");
    this.load.audio("shield", "assets/sounds/shield.wav");
    this.load.audio("doublePoints", "assets/sounds/doublePoints.wav");
    this.load.audio("heart", "assets/sounds/heart.wav");
  }

  init(){
    if(localStorage.getItem('gameMode') !== 'arcade' && localStorage.getItem('selectedLevel') !== null){
      this.currentLevel = parseInt(localStorage.getItem('selectedLevel'));
    }
    else this.currentLevel = 0;
  }

  create(){
    this.score = 0;
    this.hearts = 3;
    this.registry.set("score", 0);
    this.cursor = this.input.keyboard.createCursorKeys();
    this._background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, `${GameInfo.levels[this.currentLevel].background ?? 'bg-01'}-wider`).setOrigin(0, 0);
    this._scoreText = this.add.text(50, 50, `Score: ${this.score}`)
      .setFontSize(35).setFontFamily(GameInfo.default.font).setDepth(1000);

    const music = this.registry.get('backgroundMusic') as Phaser.Sound.BaseSound;
    if (localStorage.getItem('musicEnabled') !== 'false' && music && !music.isPlaying) music.play();

    this.createPowerUpIndicators();

    GameScene.asteroids = this.physics.add.group();
    GameScene.trashGroup = this.physics.add.group();
    GameScene.powerUps = this.physics.add.group();
    this.heartsGroup = this.add.group();

    this.createShip();
    this.updateHearts();
    this.updateScore(this.score);

    this.physics.world.setBounds(50, 50, this.scale.width - 50 * 2, this.scale.height - 50 * 2);
    this.physics.world.enable(GameScene.ship);

    this.physics.add.overlap(GameScene.ship, GameScene.asteroids, (ship, asteroid) => this.handleCollision(ship, asteroid), undefined, this);
    this.physics.add.overlap(GameScene.ship, GameScene.trashGroup, (ship, trash) => this.pickUpTrash(ship, trash), undefined, this);
    this.physics.add.overlap(GameScene.ship, GameScene.powerUps, (ship, powerUp) => this.rocketEnhancement(ship, powerUp), undefined, this);

    this.keys = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    this.input.keyboard.on("keydown-ESC", () => { 
    if (localStorage.getItem('soundEffectsEnabled') === 'true') {
      this.sound.play('menuSelect');
    }
    this.scene.pause(); 
    this.scene.launch("PauseScene"); 
    });
    this.input.keyboard.on("keyup-SPACE", () => {
      if(this.sound.get('boost')?.isPlaying) this.sound.stopByKey('boost');
    });

    this.time.addEvent({ delay: GameInfo.levels[this.currentLevel].asteroidsGenerationDelay ?? 1500, callback: this.spawnAsteroid, callbackScope: this, loop: true });
    this.time.addEvent({ delay: GameInfo.levels[this.currentLevel].trashGenerationDelay ?? 1500, callback: this.spawnTrash, callbackScope: this, loop: true });
    this.time.addEvent({ delay: GameInfo.levels[this.currentLevel].powerUpsGenerationDelay ?? GameInfo.powerUpsGenerationDelay, callback: this.spawnPowerUps, callbackScope: this, loop: true });
  }

  private checkLevelCompletion() {
    if(localStorage.getItem('gameMode') == 'levels' && this.score >= 2500){
        this.time.removeAllEvents();

        GameScene.asteroids.clear(true, true);
        GameScene.trashGroup.clear(true, true);
        GameScene.powerUps.clear(true, true);

        this.registry.set("score", this.score);

        const nextLevel = this.currentLevel + 1;

        if(nextLevel < GameInfo.levels.length){
          localStorage.setItem('selectedLevel', nextLevel.toString());
          this.showLevelCompleteMessage();
          this.time.delayedCall(2000, () => { this.scene.restart(); });
        }
        else{
          this.showVictoryMessage();
          this.time.delayedCall(2000, () => {
              this.scene.stop("MinimapOverlay");
              this.scene.start("GameOverScene", { victory: true });
          });
        }
    }
}

  private showLevelCompleteMessage() {
    const style = {
      fontFamily: GameInfo.default.font,
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { blur: 0, stroke: false, fill: false }
    };

    const text = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      `Level ${this.currentLevel+1} Complete!`,
      style
    ).setOrigin(0.5).setDepth(10000);

    this.tweens.add({
      targets: text,
      scale: { from: 0.5, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 500,
      ease: 'Power2'
    });

  }

  private showVictoryMessage() {
    const style = {
      fontFamily: GameInfo.default.font,
      fontSize: '48px',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { blur: 0, stroke: false, fill: false }
    };

    const text = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      'You Won!',
      style
    ).setOrigin(0.5).setDepth(10000);

    this.tweens.add({
      targets: text,
      scale: { from: 0.5, to: 1.2 },
      alpha: { from: 0, to: 1 },
      duration: 800,
      ease: 'Elastic'
    });

  }

  public updateScore(score: number): void {
    if(GameScene.ship.data.get('doublePoints') == true) this.score += score * 2;
    else this.score += score;

    this._scoreText.setText(`Score: ${this.score}`);
    this.checkLevelCompletion();
  }

  private createPowerUpIndicators() {
    Object.keys(GameInfo.powerUps).forEach((powerUp, index) => {
      this.powerUpsIndicators[powerUp] = this.add.image(50 + index * 50, 160, `powerUp-${powerUp}`)
        .setOrigin(0, 0).setDepth(1000).setScale(0.2).setAlpha(0);
    });
  }

  private updateIndicators(ship: any){
    Object.keys(GameInfo.powerUps).forEach(type => {
      this.powerUpsIndicators[type].setAlpha(ship.data.get(type) ? 1 : 0);
    });
  }

  private createShip(): void {
    GameScene.ship = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, "ship-base").setScale(0.5);
    const body = GameScene.ship.body as Phaser.Physics.Arcade.Body;
    body.setSize(GameScene.ship.width, GameScene.ship.height);
    body.setCollideWorldBounds(true);

    Object.keys(GameInfo.powerUps).forEach(type => { GameScene.ship.setData(type, false); });
  }

  private updateShip(ship: any): void {
    if(ship.data.get('shield') !== false){
      if(this.hearts == 3){ ship.setTexture("ship-base-shielded"); }
      if(this.hearts == 2){ GameScene.ship.setTexture("ship-slight-damage-shielded"); }
      if(this.hearts == 1){ GameScene.ship.setTexture("ship-damaged-shielded"); }
    }
    else{
      if(this.hearts == 3){ GameScene.ship.setTexture("ship-base"); }
      if(this.hearts == 2){ GameScene.ship.setTexture("ship-slight-damage"); }
      if(this.hearts == 1){ GameScene.ship.setTexture("ship-damaged"); }
    }
  }

  update(time: number, delta: number) {
    if (this.cursor.space.isDown && GameScene.ship.getData('boost')) {
      this._speed = 650;

      if (!this.isBoostSoundPlaying) {
        this.sound.play('boost', { loop: true, volume: 0.5 });
        this.isBoostSoundPlaying = true;
      }
    } else {
      this._speed = 250;

      if (this.isBoostSoundPlaying) {
        const boostSound = this.sound.get('boost');
        if (boostSound) {
          boostSound.stop();
          this.sound.removeByKey('boost');
        }
        this.isBoostSoundPlaying = false;
      }
    }

    if(this.cursor.left.isDown || this.keys.A.isDown){
      GameScene.ship.x -= this._speed * delta / 1000;
      this._background.tilePositionX -= this._speed * delta / 2000;
      GameScene.ship.angle = -90;
    }
    if(this.cursor.right.isDown || this.keys.D.isDown){
      GameScene.ship.x += this._speed * delta / 1000;
      this._background.tilePositionX += this._speed * delta / 2000;
      GameScene.ship.angle = 90;
    }
    if(this.cursor.up.isDown || this.keys.W.isDown){
      GameScene.ship.y -= this._speed * delta / 1000;
      this._background.tilePositionY -= this._speed * delta / 2000;
      GameScene.ship.angle = 0;
    }
    if(this.cursor.down.isDown || this.keys.S.isDown){
      GameScene.ship.y += this._speed * delta / 1000;
      this._background.tilePositionY += this._speed * delta / 2000;
      GameScene.ship.angle = 180;
    }

    Object.entries(GameInfo.powerUps).forEach(([type]) => {
      if(GameScene.ship.data.get(`${type}Expiry`) > this.time.now){
        let flashStart = GameScene.ship.data.get(`${type}FlashTime`);
        if(flashStart && this.time.now >= flashStart){
          let elapsed = this.time.now - flashStart;
          let flashInterval = 250;

          if (elapsed % flashInterval < flashInterval / 2) this.powerUpsIndicators[type].setAlpha(0);
          else this.powerUpsIndicators[type].setAlpha(1);

          this.flashObject(GameScene.ship, flashInterval);
        }
      }
    });

    const body = GameScene.ship.body as Phaser.Physics.Arcade.Body;
    body.setSize(GameScene.ship.width, GameScene.ship.height);

    if((this.cursor.left.isDown || this.keys.A.isDown) && (this.cursor.down.isDown || this.keys.S.isDown)){
      GameScene.ship.angle = -135;
    }
    if((this.cursor.right.isDown || this.keys.D.isDown) && (this.cursor.down.isDown || this.keys.S.isDown)){
      GameScene.ship.angle = 135;
      body.setSize(GameScene.ship.width - 50, GameScene.ship.height - 50);
      body.setOffset(-GameScene.ship.width / 2, -GameScene.ship.height / 2);
    }
    if((this.cursor.left.isDown || this.keys.A.isDown) && (this.cursor.up.isDown || this.keys.W.isDown)) GameScene.ship.angle = -45;
    if((this.cursor.right.isDown || this.keys.D.isDown) && (this.cursor.up.isDown || this.keys.W.isDown)) GameScene.ship.angle = 45;

    body.setOffset(0, 0);

    GameScene.asteroids.getChildren().forEach((asteroid: any) => {
      if(asteroid.x < -100 || asteroid.x > this.game.canvas.width + 100 ||
        asteroid.y < -100 || asteroid.y > this.game.canvas.height + 100){
        asteroid.destroy();
      }
    });
  }

  private flashObject(item: any, frequency: number){
    this.time.addEvent({
      delay: frequency,
      repeat: 1,
      callback: () => {
        if (item.tintFill) item.clearTint();
        else item.setTintFill(0xffffff);
      },
      callbackScope: this,
    });
  }

  private updateHearts(){
    this.heartsGroup.clear(true, true);
    const startX = 75;
    const startY = 125;
    const spacing = 55;

    for(let i = 0; i < this.hearts; i++){
      const heart = this.add.image(startX + (i * spacing), startY, 'heart-white').setScale(0.5).setScrollFactor(0).setDepth(1000);
      this.heartsGroup.add(heart);
    }
    this.updateShip(GameScene.ship);
  }

  pickUpTrash(ship: any, trash: any){
    if(!ship.active || !trash.active) return;
    if(trash.body) trash.destroy();
    const currentTrash = GameInfo.levels[this.currentLevel].trash;
    this.updateScore(GameInfo.levels[this.currentLevel].trash?.[trash.texture.key as keyof typeof currentTrash]);
  }

  private activateInvulnerability(duration: number) {
    GameScene.ship.setData('invulnerable', true);

    this.time.delayedCall(duration, () => {
        GameScene.ship.setData('invulnerable', false);
    });
}

  handleCollision(ship: any, asteroid: any) {
    if (!ship.active || !asteroid.active) return;

    if (ship.getData('invulnerable')) {
      if (asteroid.body) asteroid.destroy();

      const proximityRadius = 100;
      GameScene.asteroids.getChildren().forEach((otherAsteroid: any) => {
        const distance = Phaser.Math.Distance.Between(
          ship.x, ship.y,
          otherAsteroid.x, otherAsteroid.y
        );
        if (distance <= proximityRadius && otherAsteroid.active) {
          otherAsteroid.destroy();
        }
      });

      return;
    }

    if (asteroid.body) asteroid.destroy();

    if (GameScene.ship.getData('shield') == false) {
      this.activateInvulnerability(1000);

      this.time.addEvent({
        delay: 150,
        repeat: 1,
        callback: () => {
          if (GameScene.ship.tintFill) GameScene.ship.clearTint();
          else GameScene.ship.setTintFill(0xff0000);
        },
        callbackScope: this,
      });

      if (this.hearts > 0) {
        this.hearts -= 1;
        this.updateHearts();
      }

      const soundEffectsEnabled = localStorage.getItem('soundEffectsEnabled') === 'true';
      if (soundEffectsEnabled) {
        this.sound.play('collision', { volume: 0.5 }); 
      }

      this.cameras.main.shake(100, 0.005);
    }

    if (this.hearts <= 0) {
      this.registry.set("score", this.score);
      this.scene.stop(this);
      this.scene.stop("MinimapOverlay");
      this.scene.start("GameOverScene");
    }
  }

  private spawnPowerUps(){
    const screenWidth = this.game.canvas.width;
    const screenHeight = this.game.canvas.height;
    const padding = 50;

    let x: number, y: number;
    let targetX = screenWidth / 2;
    let targetY = screenHeight / 2;

    const edge = Phaser.Math.Between(0, 3);
    switch (edge) {
      case 0: // Top
        x = Phaser.Math.Between(-padding, screenWidth + padding);
        y = -padding;
        break;
      case 1: // Right
        x = screenWidth + padding;
        y = Phaser.Math.Between(-padding, screenHeight + padding);
        break;
      case 2: // Bottom
        x = Phaser.Math.Between(-padding, screenWidth + padding);
        y = screenHeight + padding;
        break;
      default: // Left
        x = -padding;
        y = Phaser.Math.Between(-padding, screenHeight + padding);
    }

    const keys = Object.keys(GameInfo.powerUps) as Array<keyof typeof GameInfo.powerUps>;
    const powerUpType = keys[Phaser.Math.Between(0, keys.length - 1)];

    const powerUp = GameScene.powerUps.create(x, y, `powerUp-${powerUpType}`).setScale(0.25);
    powerUp.body.setSize(powerUp.width, powerUp.height);
    powerUp.setData('type', powerUpType);

    this.physics.moveTo(powerUp, targetX, targetY, 100);
    powerUp.setAngularVelocity(Phaser.Math.Between(-100, 100));
  }

  private rocketEnhancement(ship: any, powerUp: any) {
    if (!ship.active || !powerUp.active || !powerUp.data) return;

    const type = powerUp.data.get('type');

    if (type === 'heart') {
        if (this.hearts < 3) {
            this.hearts += 1;
            this.updateHearts();
        }

        const soundEffectsEnabled = localStorage.getItem('soundEffectsEnabled') === 'true';
        if (soundEffectsEnabled) {
            this.sound.play('heart', { volume: 0.5 });
        }

        if (powerUp.body) powerUp.destroy();
        return;
    }

    let currentExpiry = ship.data.get(`${type}Expiry`) || 0;
    let remainingTime = currentExpiry - this.time.now;
    let powerUpTime = remainingTime > 0
        ? remainingTime + GameInfo.powerUps[type as keyof typeof GameInfo.powerUps]
        : GameInfo.powerUps[type as keyof typeof GameInfo.powerUps];
    let newExpiry = this.time.now + powerUpTime;

    if (ship.data.get(`${type}Timer`)) ship.data.get(`${type}Timer`).remove();

    ship.setData(type, true);
    ship.setData(`${type}Expiry`, newExpiry);
    ship.setData(`${type}FlashTime`, newExpiry - 1000);
    this.updateIndicators(ship);

    let powerUpTimer = this.time.delayedCall(powerUpTime, () => {
        ship.setData(type, false);
        ship.setData(`${type}Expiry`, 0);
        this.updateIndicators(ship);
        this.updateShip(ship);

        if (type === 'boost' && this.sound.get('boost')?.isPlaying) this.sound.stopByKey('boost');
    });

    ship.setData(`${type}Timer`, powerUpTimer);
    this.updateShip(ship);

    const soundEffectsEnabled = localStorage.getItem('soundEffectsEnabled') === 'true';
    if (soundEffectsEnabled) {
        if (type === 'shield') this.sound.play('shield', { volume: 0.5 });
        else if (type === 'doublePoints') this.sound.play('doublePoints', { volume: 0.5 });
    }

    if (powerUp.body) powerUp.destroy();
  }

  private spawnAsteroid(){
    const screenWidth = this.game.canvas.width;
    const screenHeight = this.game.canvas.height;
    const minDistanceFromShip = 300;
    const padding = 50;

    let x: number, y: number;
    let edge = Phaser.Math.Between(0, 3);

    switch(edge) {
      case 0: // Top
        x = Phaser.Math.Between(-padding, screenWidth + padding);
        y = -padding;
        break;
      case 1: // Right
        x = screenWidth + padding;
        y = Phaser.Math.Between(-padding, screenHeight + padding);
        break;
      case 2: // Bottom
        x = Phaser.Math.Between(-padding, screenWidth + padding);
        y = screenHeight + padding;
        break;
      default: // Left
        x = -padding;
        y = Phaser.Math.Between(-padding, screenHeight + padding);
    }

    const distanceToShip = Phaser.Math.Distance.Between(x, y, GameScene.ship.x, GameScene.ship.y);

    if(distanceToShip < minDistanceFromShip){
      switch(edge){
        case 0: case 2: // Top/Bottom
          x = x < screenWidth / 2 ?
            Phaser.Math.Between(screenWidth / 2 + minDistanceFromShip, screenWidth + padding) :
            Phaser.Math.Between(-padding, screenWidth / 2 - minDistanceFromShip);
          break;
        default: // Left/Right
          y = y < screenHeight / 2 ?
            Phaser.Math.Between(screenHeight / 2 + minDistanceFromShip, screenHeight + padding) :
            Phaser.Math.Between(-padding, screenHeight / 2 - minDistanceFromShip);
      }
    }

    const asteroid = GameScene.asteroids.create(x, y, 'asteroid').setScale(Phaser.Math.FloatBetween(0.1, 0.5));
    asteroid.setAngularVelocity(Phaser.Math.Between(-50, 50));
    asteroid.body.setSize(asteroid.width, asteroid.height);
    asteroid.body.setOffset(
      (asteroid.width - asteroid.width) / 2,
      (asteroid.height - asteroid.height) / 2
    );

    const targetPoint = new Phaser.Math.Vector2(
      Phaser.Math.Between(padding, screenWidth - padding),
      Phaser.Math.Between(padding, screenHeight - padding)
    );

    this.physics.moveTo(asteroid, targetPoint.x, targetPoint.y, this.asteroidSpeed);
  }

  private spawnTrash(){
    const screenWidth = this.game.canvas.width;
    const screenHeight = this.game.canvas.height;
    const minDistanceFromShip = 300;
    const padding = 50;

    let x: number, y: number;
    let edge = Phaser.Math.Between(0, 3);

    switch(edge) {
      case 0: // Top
        x = Phaser.Math.Between(-padding, screenWidth + padding);
        y = -padding;
        break;
      case 1: // Right
        x = screenWidth + padding;
        y = Phaser.Math.Between(-padding, screenHeight + padding);
        break;
      case 2: // Bottom
        x = Phaser.Math.Between(-padding, screenWidth + padding);
        y = screenHeight + padding;
        break;
      default: // Left
        x = -padding;
        y = Phaser.Math.Between(-padding, screenHeight + padding);
    }

    const distanceToShip = Phaser.Math.Distance.Between(x, y, GameScene.ship.x, GameScene.ship.y);

    if(distanceToShip < minDistanceFromShip){
      switch(edge){
        case 0: case 2: // Top/Bottom
          x = x < screenWidth / 2 ?
            Phaser.Math.Between(screenWidth / 2 + minDistanceFromShip, screenWidth + padding) :
            Phaser.Math.Between(-padding, screenWidth / 2 - minDistanceFromShip);
          break;
        default: // Left/Right
          y = y < screenHeight / 2 ?
            Phaser.Math.Between(screenHeight / 2 + minDistanceFromShip, screenHeight + padding) :
            Phaser.Math.Between(-padding, screenHeight / 2 - minDistanceFromShip);
      }
    }

    const currentTrash = GameInfo.levels[this.currentLevel].trash;
    const keys = Object.keys(currentTrash) as Array<keyof typeof currentTrash>;
    const randomTrash = keys[Phaser.Math.Between(0, keys.length - 1)];

    const trash = GameScene.trashGroup.create(x, y, randomTrash).setScale(Phaser.Math.FloatBetween(0.2, 0.25))
      .setInteractive().on('pointerdown', () => {
        trash.destroy();
        this.updateScore(GameInfo.levels[0].trash?.[trash.texture.key as keyof typeof currentTrash]);
      });
    trash.setAngularVelocity(Phaser.Math.Between(-50, 50));

    const targetPoint = new Phaser.Math.Vector2(
      Phaser.Math.Between(padding, screenWidth - padding),
      Phaser.Math.Between(padding, screenHeight - padding)
    );

    this.physics.moveTo(trash, targetPoint.x, targetPoint.y, this.trashSpeed);

    this.scene.launch("MinimapOverlay");
  }
}