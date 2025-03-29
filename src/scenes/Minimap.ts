import { GameInfo } from "../GameInfo";
import Intro from "./Intro";

export default class Minimap extends Phaser.Scene {
    constructor(){
      super({ key: "Minimap" });
      this.cameraWidth = 0;
      this.cameraHeight = 0;
    }

    private minimap: Phaser.GameObjects.Graphics;
    private readonly minimapSize: number = 150;
    private readonly minimapPadding: number = 20;
    private readonly minimapBorder: number = 2;
    private minimapBg: Phaser.GameObjects.Rectangle;
    private minimapPlayerIndicator: Phaser.GameObjects.Graphics;
    private readonly triangleSize: number = 12;
    private readonly triangleHeight: number = 14;
    private cameraWidth: number;
    private cameraHeight: number;
    private currentLevel: number = 0;

    private targetPoint: Phaser.Geom.Point | null = null;
    private pathGraphics: Phaser.GameObjects.Graphics;
    private isTargetGenerated: boolean = false;
    private readonly minDistance: number = 300;
    private readonly minMargin: number = 100;
    private readonly navigationForce: number = -10;
    private readonly targetReachedThreshold: number = 50;
    private targetMarker: Phaser.GameObjects.Image | null = null;

    create(){
      const camera = this.cameras.main;
      this.cameraWidth = camera.width;
      this.cameraHeight = camera.height;

      this.minimapBg = this.add.rectangle(
        this.scale.width - this.minimapPadding - this.minimapSize / 2,
        this.minimapPadding + this.minimapSize / 2,
        this.minimapSize + this.minimapBorder * 2,
        this.minimapSize + this.minimapBorder * 2,
        0x000000
      )
      .setDepth(1000)
      .setScrollFactor(0)
      .setAlpha(0.7)
      .setVisible(true);

      this.minimap = this.add.graphics().setDepth(1001).setScrollFactor(0).setVisible(true);
      this.minimapPlayerIndicator = this.add.graphics().setDepth(1002).setScrollFactor(0).setVisible(true);
      this.pathGraphics = this.add.graphics().setDepth(1001).setScrollFactor(0).setVisible(true);
    }

    private generateRandomTarget() {
      if(this.isTargetGenerated || !Intro.ship) return;
      const worldBounds = this.physics.world.bounds;
      if(this.targetMarker){ this.targetMarker.destroy(); this.targetMarker = null; }
      let attempts = 0;
      const maxAttempts = 100;
      let validPointFound = false;

      while (!validPointFound && attempts < maxAttempts) {
        this.targetPoint = new Phaser.Geom.Point(
          Phaser.Math.Between(this.minMargin, worldBounds.width - this.minMargin),
          Phaser.Math.Between(this.minMargin, worldBounds.height - this.minMargin)
        );

        const distance = Phaser.Math.Distance.Between(
          Intro.ship.x,
          Intro.ship.y,
          this.targetPoint.x,
          this.targetPoint.y
        );

        if(distance >= this.minDistance) validPointFound = true;
        attempts++;
      }

      if (!validPointFound) {
        const angle = Phaser.Math.Between(0, 360);
        this.targetPoint = new Phaser.Geom.Point(
          Intro.ship.x + Math.cos(Phaser.Math.DegToRad(angle)) * this.minDistance,
          Intro.ship.y + Math.sin(Phaser.Math.DegToRad(angle)) * this.minDistance
        );
      }

        this.targetMarker = this.add.image(this.targetPoint.x, this.targetPoint.y, 'target-marker')
        .setDepth(999)
        .setScale(0.5)
        .setAlpha(0.8);

        this.tweens.add({
            targets: this.targetMarker,
            scale: 0.6,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

      this.isTargetGenerated = true;
    }

    private addScoreToMainScene(points: number){
      const introScene = this.scene.get("Intro") as Intro;
      if (introScene && introScene.updateScore) {
        introScene.updateScore(points);

        const scorePopup = this.add.text(
          this.scale.width / 2,
          this.scale.height / 2,
          `+${points}`,
          { font: '48px', color: '#00ff00', fontFamily: GameInfo.default.font }
        )
        .setOrigin(0.5)
        .setDepth(1001);

        this.tweens.add({
          targets: scorePopup,
          y: this.scale.height / 2 - 100,
          alpha: 0,
          duration: 1000,
          onComplete: () => scorePopup.destroy()
        });
      }
    }

    private navigateToTarget(){
      if (!this.targetPoint || !Intro.ship?.body) return;

      const body = Intro.ship.body as Phaser.Physics.Arcade.Body;

      const distance = Phaser.Math.Distance.Between(
        Intro.ship.x,
        Intro.ship.y,
        this.targetPoint.x,
        this.targetPoint.y
      );

        if (distance < this.targetReachedThreshold) {
            body.setAcceleration(0, 0);
            this.addScoreToMainScene(1000);
            this.resetTarget();
            return;
        }

      const angle = Phaser.Math.Angle.Between(Intro.ship.x, Intro.ship.y, this.targetPoint.x, this.targetPoint.y);
      const forceX = Math.cos(angle) * this.navigationForce;
      const forceY = Math.sin(angle) * this.navigationForce;
      body.setAcceleration(forceX, forceY);
    }

    private drawMinimapObjects(group: Phaser.Physics.Arcade.Group | undefined, color: number, size: number) {
      if (!group?.getChildren || !Intro.ship) return;

      const worldBounds = this.physics.world.bounds;
      const scale = this.minimapSize / Math.max(worldBounds.width, worldBounds.height);

      const centerX = this.scale.width - this.minimapPadding - this.minimapSize / 2;
      const centerY = this.minimapPadding + this.minimapSize / 2;

      const offsetX = (worldBounds.width * scale) / 2;
      const offsetY = (worldBounds.height * scale) / 2;

      group.getChildren().forEach((obj: Phaser.GameObjects.GameObject) => {
          const sprite = obj as Phaser.GameObjects.Sprite;

          const minimapX = centerX - offsetX + (sprite.x * scale);
          const minimapY = centerY - offsetY + (sprite.y * scale);

          if (minimapX >= centerX - this.minimapSize/2 &&
              minimapX <= centerX + this.minimapSize/2 &&
              minimapY >= centerY - this.minimapSize/2 &&
              minimapY <= centerY + this.minimapSize/2) {

              this.minimap.fillStyle(color, 1);
              this.minimap.fillRect(
                  minimapX - size/2,
                  minimapY - size/2,
                  size,
                  size
              );
          }
      });
  }

  private drawPath() {
    if (this.currentLevel !== 0 || !this.targetPoint || !Intro.ship) return;

    const worldBounds = this.physics.world.bounds;
    const scale = this.minimapSize / Math.max(worldBounds.width, worldBounds.height);
    const centerX = this.scale.width - this.minimapPadding - this.minimapSize / 2;
    const centerY = this.minimapPadding + this.minimapSize / 2;

    const offsetX = (worldBounds.width * scale) / 2;
    const offsetY = (worldBounds.height * scale) / 2;
    const playerMinimapX = centerX - offsetX + (Intro.ship.x * scale);
    const playerMinimapY = centerY - offsetY + (Intro.ship.y * scale);

    const targetMinimapX = centerX - offsetX + (this.targetPoint.x * scale);
    const targetMinimapY = centerY - offsetY + (this.targetPoint.y * scale);

    this.pathGraphics.clear()
      .lineStyle(4, 0x33ff33, 0.9)
      .beginPath()
      .moveTo(playerMinimapX, playerMinimapY)
      .lineTo(targetMinimapX, targetMinimapY)
      .strokePath()
      .fillStyle(0x33ff33, 0.9)
      .fillCircle(targetMinimapX, targetMinimapY, 6)
      .lineStyle(2, 0xffffff, 1)
      .strokeCircle(targetMinimapX, targetMinimapY, 6);
}

    private drawPlayerIndicator() {
      if (!Intro.ship) return;

      const worldBounds = this.physics.world.bounds;
      const scale = this.minimapSize / Math.max(worldBounds.width, worldBounds.height);
      const centerX = this.scale.width - this.minimapPadding - this.minimapSize / 2;
      const centerY = this.minimapPadding + this.minimapSize / 2;

      const offsetX = (worldBounds.width * scale) / 2;
      const offsetY = (worldBounds.height * scale) / 2;
      const minimapX = centerX - offsetX + (Intro.ship.x * scale);
      const minimapY = centerY - offsetY + (Intro.ship.y * scale);

      const rotation = Intro.ship.rotation;

      const halfBase = this.triangleSize / 2;
      const points = [
          { x: 0, y: -this.triangleHeight / 2 },
          { x: -halfBase, y: this.triangleHeight / 2 },
          { x: halfBase, y: this.triangleHeight / 2 }
      ];

      const rotatedPoints = points.map(p => ({
          x: minimapX + (p.x * Math.cos(rotation) - p.y * Math.sin(rotation)),
          y: minimapY + (p.x * Math.sin(rotation) + p.y * Math.cos(rotation))
      }));

      this.minimapPlayerIndicator.clear().fillStyle(0xffffff, 1)
          .fillTriangle(
              rotatedPoints[0].x, rotatedPoints[0].y,
              rotatedPoints[1].x, rotatedPoints[1].y,
              rotatedPoints[2].x, rotatedPoints[2].y
          );
  }

    update(){
      const sceneActive = this.scene.get("Intro").scene.isActive();
      [this.minimapBg, this.minimap, this.minimapPlayerIndicator, this.pathGraphics].forEach(obj => obj.setVisible(sceneActive));

      if (!sceneActive || !Intro.ship || !Intro.asteroids || !Intro.trashGroup || !Intro.powerUps) {
        if(!sceneActive) this.isTargetGenerated = false;
        return;
      }

      if(localStorage.getItem('gameMode') === 'arcade'){
        if(!this.isTargetGenerated) this.generateRandomTarget();
        if(this.currentLevel === 0) this.navigateToTarget();
      }

      this.minimap.clear().lineStyle(2, 0xffffff, 1)
      .strokeRect(
        this.scale.width - this.minimapPadding - this.minimapSize,
        this.minimapPadding,
        this.minimapSize,
        this.minimapSize
      );

      this.drawMinimapObjects(Intro.asteroids, 0xff0000, 4);
      this.drawMinimapObjects(Intro.trashGroup, 0x00ffff, 4);
      this.drawMinimapObjects(Intro.powerUps, 0xffff00, 4);

      if(localStorage.getItem('gameMode') === 'arcade') this.drawPath();
      this.drawPlayerIndicator();
    }

    public resetTarget() {
      this.isTargetGenerated = false;
      this.targetPoint = null;
      if(Intro.ship?.body) (Intro.ship.body as Phaser.Physics.Arcade.Body).setAcceleration(0, 0);
    }
}