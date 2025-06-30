import { GameInfo } from "../GameInfo";
import GameScene from "./GameScene";

export default class Minimap extends Phaser.Scene {
    constructor(){
      super({ key: "MinimapOverlay" });
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

    private pathGraphics: Phaser.GameObjects.Graphics;
    private isTargetGenerated: boolean = false;
    private readonly minDistance: number = 300;
    private readonly minMargin: number = 100;
    private readonly navigationForce: number = -10;
    private readonly targetReachedThreshold: number = 80;
    private targetPoint: Phaser.Geom.Point | null = null;
    private targetMarker: Phaser.GameObjects.Image | null = null;
    private minimapFlagMarker: Phaser.GameObjects.Image | null = null;

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
      if(this.isTargetGenerated || !GameScene.ship) return;
      const worldBounds = this.physics.world.bounds;
      if(this.targetMarker){ this.targetMarker.destroy(); this.targetMarker = null; }
      
      const gameScene = this.scene.get("GameScene") as GameScene;
      
      // Generate a target point that's visible but not too close to the ship
      const shipX = GameScene.ship.x;
      const shipY = GameScene.ship.y;
      const minDistance = 200;
      const maxDistance = 400;
      
      let attempts = 0;
      let flagX, flagY, clampedX, clampedY;
      
      do {
        // Random angle and distance
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const distance = Phaser.Math.FloatBetween(minDistance, maxDistance);
        
        flagX = shipX + Math.cos(angle) * distance;
        flagY = shipY + Math.sin(angle) * distance;
        
        // Ensure the flag is within world bounds with some padding
        const padding = 100;
        clampedX = Phaser.Math.Clamp(flagX, worldBounds.x + padding, worldBounds.x + worldBounds.width - padding);
        clampedY = Phaser.Math.Clamp(flagY, worldBounds.y + padding, worldBounds.y + worldBounds.height - padding);
        
        attempts++;
      } while (this.isInMinimapArea(clampedX, clampedY) && attempts < 20);
      
      this.targetPoint = new Phaser.Geom.Point(clampedX, clampedY);

      this.targetMarker = gameScene.add.image(this.targetPoint.x, this.targetPoint.y, 'flag')
        .setDepth(2000)
        .setScale(0.05)
        .setAlpha(1);

      gameScene.tweens.add({
          targets: this.targetMarker,
          scale: { from: 0.05, to: 0.08 },
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
      });

      this.isTargetGenerated = true;
    }

    private addScoreToMainScene(points: number, x?: number, y?: number){
      const gameScene = this.scene.get("GameScene") as GameScene;
      if (gameScene && gameScene.updateScore) {
        // For flag points, bypass the double points multiplier
        // Update score directly without applying power-up multipliers
        gameScene.score += points;
        gameScene['_scoreText'].setText(`Score: ${gameScene.score}`);
        gameScene['checkLevelCompletion']();

        // Use provided coordinates or default to center of screen
        const popupX = x !== undefined ? x : this.scale.width / 2;
        const popupY = y !== undefined ? y : this.scale.height / 2;

        const scorePopup = gameScene.add.text(
          popupX,
          popupY,
          `+${points}`,
          {
            fontSize: `${Math.min(this.scale.width / 25, 48)}px`,
            fontFamily: GameInfo.default.font,
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2
          }
        )
        .setOrigin(0.5)
        .setDepth(1001);

        gameScene.tweens.add({
          targets: scorePopup,
          y: popupY - 100,
          alpha: 0,
          duration: 1000,
          onComplete: () => scorePopup.destroy()
        });
      }
    }

    private checkTargetReached(){
      if (!this.targetPoint || !GameScene.ship) return;
      
      const distance = Phaser.Math.Distance.Between(
        GameScene.ship.x,
        GameScene.ship.y,
        this.targetPoint.x,
        this.targetPoint.y
      );

      if (distance < this.targetReachedThreshold) {
        // Play pickup sound
        const gameScene = this.scene.get("GameScene") as GameScene;
        const soundEffectsEnabled = localStorage.getItem('soundEffectsEnabled') === 'true';
        if (soundEffectsEnabled && gameScene) {
          gameScene.sound.play('pickup', { volume: 0.8 });
        }
        
        this.addScoreToMainScene(1000, this.targetPoint.x, this.targetPoint.y);
        this.resetTarget();
        
        // Spawn new target after delay to avoid duplicates
        setTimeout(() => {
          if (!this.isTargetGenerated && localStorage.getItem('gameMode') === 'arcade') {
            this.generateRandomTarget();
          }
        }, 1000);
      }
    }


    private navigateToTarget(){
      if (!this.targetPoint || !GameScene.ship?.body) return;
      const body = GameScene.ship.body as Phaser.Physics.Arcade.Body;
      const distance = Phaser.Math.Distance.Between(
        GameScene.ship.x,
        GameScene.ship.y,
        this.targetPoint.x,
        this.targetPoint.y
      );

      if (distance < this.targetReachedThreshold) {
        body.setAcceleration(0, 0);
        // Target reached handling is now done in GameScene
        this.resetTarget();
        return;
      }

      const angle = Phaser.Math.Angle.Between(GameScene.ship.x, GameScene.ship.y, this.targetPoint.x, this.targetPoint.y);
      const forceX = Math.cos(angle) * this.navigationForce;
      const forceY = Math.sin(angle) * this.navigationForce;
      body.setAcceleration(forceX, forceY);
    }

    private drawMinimapObjects(group: Phaser.Physics.Arcade.Group | undefined, color: number, size: number) {
      if (!group?.getChildren || !GameScene.ship) return;

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
    if (!this.targetPoint || !GameScene.ship) return;

    const worldBounds = this.physics.world.bounds;
    const scale = this.minimapSize / Math.max(worldBounds.width, worldBounds.height);
    const centerX = this.scale.width - this.minimapPadding - this.minimapSize / 2;
    const centerY = this.minimapPadding + this.minimapSize / 2;

    const offsetX = (worldBounds.width * scale) / 2;
    const offsetY = (worldBounds.height * scale) / 2;
    const playerMinimapX = centerX - offsetX + (GameScene.ship.x * scale);
    const playerMinimapY = centerY - offsetY + (GameScene.ship.y * scale);

    const targetMinimapX = centerX - offsetX + (this.targetPoint.x * scale);
    const targetMinimapY = centerY - offsetY + (this.targetPoint.y * scale);

    this.pathGraphics.clear()
      .lineStyle(3, 0x00ff00, 0.8)
      .beginPath()
      .moveTo(playerMinimapX, playerMinimapY)
      .lineTo(targetMinimapX, targetMinimapY)
      .strokePath();
      
    // Create or update minimap flag marker
    if (!this.minimapFlagMarker) {
      this.minimapFlagMarker = this.add.image(targetMinimapX, targetMinimapY, 'flag')
        .setDepth(1003)
        .setScale(0.03)
        .setScrollFactor(0);
    } else {
      this.minimapFlagMarker.setPosition(targetMinimapX, targetMinimapY);
    }
}

    private drawPlayerIndicator() {
      if (!GameScene.ship) return;

      const worldBounds = this.physics.world.bounds;
      const scale = this.minimapSize / Math.max(worldBounds.width, worldBounds.height);
      const centerX = this.scale.width - this.minimapPadding - this.minimapSize / 2;
      const centerY = this.minimapPadding + this.minimapSize / 2;

      const offsetX = (worldBounds.width * scale) / 2;
      const offsetY = (worldBounds.height * scale) / 2;
      const minimapX = centerX - offsetX + (GameScene.ship.x * scale);
      const minimapY = centerY - offsetY + (GameScene.ship.y * scale);

      const rotation = GameScene.ship.rotation;

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
      const sceneActive = this.scene.get("GameScene").scene.isActive();
      [this.minimapBg, this.minimap, this.minimapPlayerIndicator, this.pathGraphics].forEach(obj => obj.setVisible(sceneActive));
      
      // Hide minimap flag marker when game is paused
      if (this.minimapFlagMarker) {
        this.minimapFlagMarker.setVisible(sceneActive);
      }

      if (!sceneActive || !GameScene.ship || !GameScene.asteroids || !GameScene.trashGroup || !GameScene.powerUps) {
        return;
      }

      if(localStorage.getItem('gameMode') === 'arcade'){
        if(!this.isTargetGenerated) this.generateRandomTarget();
        this.checkTargetReached();
      }

      this.minimap.clear().lineStyle(2, 0xffffff, 1)
      .strokeRect(
        this.scale.width - this.minimapPadding - this.minimapSize,
        this.minimapPadding,
        this.minimapSize,
        this.minimapSize
      );

      this.drawMinimapObjects(GameScene.asteroids, 0xff0000, 4);
      this.drawMinimapObjects(GameScene.trashGroup, 0x00ffff, 4);
      this.drawMinimapObjects(GameScene.powerUps, 0xffff00, 4);

      if(localStorage.getItem('gameMode') === 'arcade') this.drawPath();
      this.drawPlayerIndicator();
    }

    public resetTarget() {
      this.isTargetGenerated = false;
      this.targetPoint = null;
      if(this.targetMarker) {
        this.targetMarker.destroy();
        this.targetMarker = null;
      }
      if(this.minimapFlagMarker) {
        this.minimapFlagMarker.destroy();
        this.minimapFlagMarker = null;
      }
      if(GameScene.ship?.body) (GameScene.ship.body as Phaser.Physics.Arcade.Body).setAcceleration(0, 0);
    }

    private isInMinimapArea(x: number, y: number): boolean {
      // Calculate minimap area bounds
      const minimapLeft = this.scale.width - this.minimapPadding - this.minimapSize;
      const minimapRight = this.scale.width - this.minimapPadding;
      const minimapTop = this.minimapPadding;
      const minimapBottom = this.minimapPadding + this.minimapSize;
      
      // Add some extra margin around the minimap
      const margin = 50;
      
      return x >= minimapLeft - margin && 
             x <= minimapRight + margin && 
             y >= minimapTop - margin && 
             y <= minimapBottom + margin;
    }
}