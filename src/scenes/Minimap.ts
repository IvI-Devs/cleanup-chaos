import Intro from "./Intro";

export default class Minimap extends Phaser.Scene {
    constructor() { super({ key: "Minimap" }); }

    private minimap: Phaser.GameObjects.Graphics;
    private minimapSize: number = 150;
    private minimapPadding: number = 20;
    private minimapBorder: number = 2;
    private minimapBg: Phaser.GameObjects.Rectangle;
    private minimapPlayerIndicator: Phaser.GameObjects.Graphics;
    private triangleSize: number = 12; // Base del triangolo
    private triangleHeight: number = 14; // Altezza del triangolo
    private minimapZoomFactor: number = 1;

    create() {
      if (!this.scene.isActive("Intro")) {
        this.minimap.clear();
        this.minimapPlayerIndicator.setVisible(false);
        return;
    }
        this.minimapBg = this.add.rectangle(
            this.scale.width - this.minimapPadding - this.minimapSize/2,
            this.minimapPadding + this.minimapSize/2,
            this.minimapSize + this.minimapBorder*2,
            this.minimapSize + this.minimapBorder*2,
            0x000000
        )
        .setDepth(1000)
        .setScrollFactor(0)
        .setAlpha(0.7);

        this.minimap = this.add.graphics({
            x: this.scale.width - this.minimapPadding - this.minimapSize,
            y: this.minimapPadding
        })
        .setDepth(1001)
        .setScrollFactor(0);

        this.minimapPlayerIndicator = this.add.graphics()
            .setDepth(1002)
            .setScrollFactor(0);
    }

    private drawRotatedTriangle(x: number, y: number, rotation: number) {
        const halfBase = this.triangleSize / 2;
        
        // Punti del triangolo isoscele (punta verso l'alto inizialmente)
        const points = [
            { x: 0, y: -this.triangleHeight/2 },  // Punta
            { x: -halfBase, y: this.triangleHeight/2 },  // Base sinistra
            { x: halfBase, y: this.triangleHeight/2 }     // Base destra
        ];

        // Ruota i punti
        const rotatedPoints = points.map(p => {
            return {
                x: x + (p.x * Math.cos(rotation) - p.y * Math.sin(rotation)),
                y: y + (p.x * Math.sin(rotation) + p.y * Math.cos(rotation))
            };
        });

        // Disegna il triangolo ruotato
        this.minimapPlayerIndicator.clear()
            .fillStyle(0xffffff, 1)
            .fillTriangle(
                rotatedPoints[0].x, rotatedPoints[0].y,
                rotatedPoints[1].x, rotatedPoints[1].y,
                rotatedPoints[2].x, rotatedPoints[2].y
            );
    }

    private drawMinimapObjects(
        group: Phaser.Physics.Arcade.Group | undefined,
        color: number, 
        size: number,
        scaleX: number,
        scaleY: number,
        worldBounds: Phaser.Geom.Rectangle
    ) {
        if (!group || !group.getChildren) return;

        group.getChildren().forEach((obj: Phaser.GameObjects.GameObject) => {
            const sprite = obj as Phaser.GameObjects.Sprite;
            const x = (sprite.x - worldBounds.x) * scaleX;
            const y = (sprite.y - worldBounds.y) * scaleY;
            
            if (x >= 0 && x <= this.minimapSize && y >= 0 && y <= this.minimapSize) {
                this.minimap.fillStyle(color, 1);
                this.minimap.fillRect(x, y, size, size);
            }
        });
    }

    update(time: number, delta: number) {
    const introScene = this.scene.get("Intro");
    if (!introScene || !introScene.scene.isActive()) {
        this.minimap.clear();
        this.minimapPlayerIndicator.setVisible(false);
        return;
    }
    
    if (!Intro.asteroids || !Intro.trashGroup || !Intro.powerUps || !Intro.ship) {
        return;
    }

    this.minimap.clear();
        
        this.minimap.lineStyle(2, 0xffffff, 1);
        this.minimap.strokeRect(0, 0, this.minimapSize, this.minimapSize);

        const worldBounds = this.physics.world.bounds;
        const scaleX = this.minimapSize / worldBounds.width * this.minimapZoomFactor;
        const scaleY = this.minimapSize / worldBounds.height * this.minimapZoomFactor;

        if (Intro.asteroids) { this.drawMinimapObjects(Intro.asteroids, 0xff0000, 5, scaleX, scaleY, worldBounds); }
        if (Intro.trashGroup) { this.drawMinimapObjects(Intro.trashGroup, 0x00ffff, 5, scaleX, scaleY, worldBounds); }
        if (Intro.powerUps) { this.drawMinimapObjects(Intro.powerUps, 0xffff00, 5, scaleX, scaleY, worldBounds); }
        if (Intro.ship) {
            const playerX = (Intro.ship.x - worldBounds.x) * scaleX;
            const playerY = (Intro.ship.y - worldBounds.y) * scaleY;
            
            // Posizione nella minimappa
            const screenX = this.scale.width - this.minimapPadding - this.minimapSize + playerX;
            const screenY = this.minimapPadding + playerY;
            
            // 3. Disegna il triangolo ruotato
            this.drawRotatedTriangle(
                screenX, 
                screenY, 
                Intro.ship.rotation // Usa l'angolo di rotazione della nave
            );
        }
    }
}
