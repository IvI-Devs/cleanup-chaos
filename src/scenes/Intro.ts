import { GameData } from "../GameData";
import { GameInfo } from "../GameInfo";

export default class Intro extends Phaser.Scene {
  constructor(public registry: Phaser.Data.DataManager){ super({ key: "Intro" }); }
  public score: number = 0;
  public hearts: number = 3;

  private _background: Phaser.GameObjects.TileSprite;
  private _ship: Phaser.GameObjects.Image;
  private _scoreText: Phaser.GameObjects.Text;
  private cursor: Phaser.Types.Input.Keyboard.CursorKeys;
  private _speed: number = 250;

  private asteroids: Phaser.Physics.Arcade.Group;
  private trashGroup: Phaser.Physics.Arcade.Group;
  private heartsGroup: Phaser.GameObjects.Group;
  private powerUps: Phaser.Physics.Arcade.Group;
  private asteroidSpeed: number = 150;
  private trashSpeed: number = 150;

  private powerUpsIndicators: Record<string, Phaser.GameObjects.Image> = {};

  private keys: {
    W: Phaser.Input.Keyboard.Key,
    A: Phaser.Input.Keyboard.Key,
    S: Phaser.Input.Keyboard.Key,
    D: Phaser.Input.Keyboard.Key
  };

  create(){
    this.score = 0;
    this.hearts = 3;
    this.registry.set("score", 0);
    this.cursor = this.input.keyboard.createCursorKeys();
    this._background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'bg-01-wider').setOrigin(0, 0);
    this._scoreText = this.add.text(50, 50, `Score: ${this.score}`)
      .setFontSize(35).setFontFamily(GameInfo.default.font).setDepth(1000);

    this.createPowerUpIndicators();

    this.asteroids = this.physics.add.group();
    this.trashGroup = this.physics.add.group();
    this.powerUps = this.physics.add.group();
    this.heartsGroup = this.add.group();

    this.updateScore(this.score);
    this.createShip();
    this.updateHearts();

    this.physics.world.setBounds(50, 50, this.scale.width - 50 * 2, this.scale.height - 50 * 2);
    this.physics.world.enable(this._ship);

    this.physics.add.overlap(this._ship, this.asteroids, (ship, asteroid) => this.handleCollision(ship, asteroid), undefined, this);
    this.physics.add.overlap(this._ship, this.trashGroup, (ship, trash) => this.pickUpTrash(ship, trash), undefined, this);
    this.physics.add.overlap(this._ship, this.powerUps, (ship, powerUp) => this.rocketEnhancement(ship, powerUp), undefined, this);

    this.keys = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    this.time.addEvent({ delay: 1500, callback: this.spawnAsteroid, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 1500, callback: this.spawnTrash, callbackScope: this, loop: true });
    this.time.addEvent({ delay: GameInfo.powerUpsGenerationDelay, callback: this.spawnPowerUps, callbackScope: this, loop: true });
  }

  private updateScore(score: number): void { this.score += score; this._scoreText.setText(`Score: ${this.score}`); }

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
    this._ship = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height / 2, "ship-base").setScale(0.5);
    const body = this._ship.body as Phaser.Physics.Arcade.Body;
    body.setSize(this._ship.width, this._ship.height);
    body.setCollideWorldBounds(true);

    this._ship.setData('shield', false);
    this._ship.setData('speedBoost', false);
  }

  private updateShip(ship: any): void {
    if(ship.data.get('shield') !== false){
      if(this.hearts == 3){ ship.setTexture("ship-base-shielded"); }
      if(this.hearts == 2){ this._ship.setTexture("ship-slight-damage-shielded"); }
      if(this.hearts == 1){ this._ship.setTexture("ship-damaged-shielded"); }
    }
    else{
      if(this.hearts == 3){ this._ship.setTexture("ship-base"); }
      if(this.hearts == 2){ this._ship.setTexture("ship-slight-damage"); }
      if(this.hearts == 1){ this._ship.setTexture("ship-damaged"); }
    }

  }

  update(time: number, delta: number){
    if(this.cursor.space.isDown && this._ship.getData('speed')) this._speed = 650;
    else this._speed = 250;

    if(this.cursor.left.isDown || this.keys.A.isDown){
      this._ship.x -= this._speed * delta / 1000;
      this._background.tilePositionX -= this._speed * delta / 2000;
      this._ship.angle = -90;
    }
    if(this.cursor.right.isDown || this.keys.D.isDown){
      this._ship.x += this._speed * delta / 1000;
      this._background.tilePositionX += this._speed * delta / 2000;
      this._ship.angle = 90;
    }
    if(this.cursor.up.isDown || this.keys.W.isDown){
      this._ship.y -= this._speed * delta / 1000;
      this._background.tilePositionY -= this._speed * delta / 2000;
      this._ship.angle = 0;
    }
    if(this.cursor.down.isDown || this.keys.S.isDown){
      this._ship.y += this._speed * delta / 1000;
      this._background.tilePositionY += this._speed * delta / 2000;
      this._ship.angle = 180;
    }

    Object.entries(GameInfo.powerUps).forEach(([type]) => {
      if(this._ship.data.get(`${type}Expiry`) > this.time.now){
        let flashStart = this._ship.data.get(`${type}FlashTime`);
        if(flashStart && this.time.now >= flashStart){
          let elapsed = this.time.now - flashStart;
          let flashInterval = 250;

          if (elapsed % flashInterval < flashInterval / 2) this.powerUpsIndicators[type].setAlpha(0);
          else this.powerUpsIndicators[type].setAlpha(1);

          this.flashObject(this._ship, flashInterval); // to fix
        }
      }
    });

    const body = this._ship.body as Phaser.Physics.Arcade.Body;
    body.setSize(this._ship.width, this._ship.height);

    if((this.cursor.left.isDown || this.keys.A.isDown) && (this.cursor.down.isDown || this.keys.S.isDown)){
      this._ship.angle = -135;
      // body.setSize(this._ship.width - 50, this._ship.height - 50); // to update
    }
    if((this.cursor.right.isDown || this.keys.D.isDown) && (this.cursor.down.isDown || this.keys.S.isDown)){
      this._ship.angle = 135;
      body.setSize(this._ship.width - 50, this._ship.height - 50);
      body.setOffset(-this._ship.width / 2, -this._ship.height / 2);
    }
    if((this.cursor.left.isDown || this.keys.A.isDown) && (this.cursor.up.isDown || this.keys.W.isDown)) this._ship.angle = -45;
    if((this.cursor.right.isDown || this.keys.D.isDown) && (this.cursor.up.isDown || this.keys.W.isDown)) this._ship.angle = 45;

    body.setOffset(0, 0);

    this.asteroids.getChildren().forEach((asteroid: any) => {
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
    if(this.hearts <= 0){
      this.registry.set("score", this.score);
      this.scene.stop(this);
      this.scene.start("GameOver");
    }

    this.heartsGroup.clear(true, true);
    const startX = 75;
    const startY = 125;
    const spacing = 55;

    for(let i = 0; i < this.hearts; i++){
      const heart = this.add.image(startX + (i * spacing), startY, 'heart-white').setScale(0.5).setScrollFactor(0).setDepth(1000);
      this.heartsGroup.add(heart);
    }
    this.updateShip(this._ship);
  }

  pickUpTrash(ship: any, trash: any){
    if(!ship.active || !trash.active) return;
    if(trash.body) trash.destroy();
    this.updateScore(GameInfo.trash[trash.texture.key as keyof typeof GameInfo.trash]);
  }

  handleCollision(ship: any, asteroid:any){
    if(!ship.active || !asteroid.active) return;
    if(asteroid.body) asteroid.destroy(); // to do: asteroid destruction animation

    if(this._ship.getData('shield') == false){
      this.time.addEvent({
        delay: 150,
        repeat: 1,
        callback: () => {
          if (this._ship.tintFill) this._ship.clearTint();
          else this._ship.setTintFill(0xff0000);
        },
        callbackScope: this,
      });

      if(this.hearts > 0){
        this.hearts -= 1;
        this.updateHearts();
      }

      if (this.sound.get('collision')) this.sound.play('collision', { volume: 0.5, detune: 200 });
      this.cameras.main.shake(100, 0.005);
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

      const powerUp = this.powerUps.create(x, y, `powerUp-${powerUpType}`).setScale(0.25);
      powerUp.body.setSize(powerUp.width, powerUp.height);
      powerUp.setData('type', powerUpType);

      this.physics.moveTo(powerUp, targetX, targetY, 100);
      powerUp.setAngularVelocity(Phaser.Math.Between(-100, 100));
  }

  private rocketEnhancement(ship: any, powerUp: any){
    if(!ship.active || !powerUp.active || !powerUp.data) return;

    const type = powerUp.data.get('type');
    let currentExpiry = ship.data.get(`${type}Expiry`) || 0;
    let remainingTime = currentExpiry - this.time.now; // if remainingTime > 0
    let powerUpTime = remainingTime > 0 ? remainingTime + GameInfo.powerUps[type as keyof typeof GameInfo.powerUps] : GameInfo.powerUps[type as keyof typeof GameInfo.powerUps];
    let newExpiry = this.time.now + powerUpTime;

    if(ship.data.get(`${type}Timer`)) ship.data.get(`${type}Timer`).remove();

    ship.setData(type, true);
    ship.setData(`${type}Expiry`, newExpiry);
    ship.setData(`${type}FlashTime`, newExpiry - 1000);
    this.updateIndicators(ship);

    let powerUpTimer = this.time.delayedCall(powerUpTime, () => {
      ship.setData(type, false);
      ship.setData(`${type}Expiry`, 0);
      this.updateIndicators(ship);
      this.updateShip(ship);
    });

    ship.setData(`${type}Timer`, powerUpTimer);

    this.updateShip(ship);
    if(powerUp.body) powerUp.destroy();
  }

  private spawnAsteroid(){
    const screenWidth = this.game.canvas.width;
    const screenHeight = this.game.canvas.height;
    const minDistanceFromShip = 300;
    const padding = 50;

    let x: number, y: number;
    let edge = Phaser.Math.Between(0, 3); // 0 = top, 1 = right, 2 = bottom, 3 = left

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

    const distanceToShip = Phaser.Math.Distance.Between(x, y, this._ship.x, this._ship.y);

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

    const asteroid = this.asteroids.create(x, y, 'asteroid').setScale(Phaser.Math.FloatBetween(0.1, 0.5));
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

  private spawnTrash() {
    const screenWidth = this.game.canvas.width;
    const screenHeight = this.game.canvas.height;
    const minDistanceFromShip = 300;
    const padding = 50;

    let x: number, y: number;
    let edge = Phaser.Math.Between(0, 3); // 0=top, 1=right, 2=bottom, 3=left

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

    const distanceToShip = Phaser.Math.Distance.Between(x, y, this._ship.x, this._ship.y);

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

    const keys = Object.keys(GameInfo.trash) as Array<keyof typeof GameInfo.trash>;
    const randomTrash = keys[Phaser.Math.Between(0, keys.length - 1)];

    const trash = this.trashGroup.create(x, y, randomTrash).setScale(Phaser.Math.FloatBetween(0.2, 0.25))
      .setInteractive().on('pointerdown', () => { trash.destroy(); this.updateScore(GameInfo.trash[randomTrash]); });
    trash.setAngularVelocity(Phaser.Math.Between(-50, 50));

    const targetPoint = new Phaser.Math.Vector2(
      Phaser.Math.Between(padding, screenWidth - padding),
      Phaser.Math.Between(padding, screenHeight - padding)
    );

    this.physics.moveTo(trash, targetPoint.x, targetPoint.y, this.trashSpeed);
  }

}