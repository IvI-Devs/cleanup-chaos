import Intro from "./Intro";

export default class Minimap extends Phaser.Scene {
    constructor() { 
        super({ key: "Minimap" }); 
        this.cameraWidth = 0;
        this.cameraHeight = 0;
    }

    // Configurazione minimappa
    private minimap: Phaser.GameObjects.Graphics;
    private readonly minimapSize: number = 150;
    private readonly minimapPadding: number = 20;
    private readonly minimapBorder: number = 2;
    private minimapBg: Phaser.GameObjects.Rectangle;
    private minimapPlayerIndicator: Phaser.GameObjects.Graphics;
    private readonly triangleSize: number = 12;
    private readonly triangleHeight: number = 14;
    private readonly minimapZoomFactor: number = 1;
    private cameraWidth: number;
    private cameraHeight: number;

    // Gestione traiettoria
    private targetPoint: Phaser.Geom.Point | null = null;
    private pathGraphics: Phaser.GameObjects.Graphics;
    private isTargetGenerated: boolean = false;
    private minDistance: number = 0;
    private readonly minMargin: number = 100;

    create() {
        const camera = this.cameras.main;
        this.cameraWidth = camera.width;
        this.cameraHeight = camera.height;
        this.minDistance = this.cameraWidth * 2;

        // Sfondo minimappa
        this.minimapBg = this.add.rectangle(
            this.scale.width - this.minimapPadding - this.minimapSize/2,
            this.minimapPadding + this.minimapSize/2,
            this.minimapSize + this.minimapBorder*2,
            this.minimapSize + this.minimapBorder*2,
            0x000000
        )
        .setDepth(1000)
        .setScrollFactor(0)
        .setAlpha(0.7)
        .setVisible(true);

        // Minimappa principale
        this.minimap = this.add.graphics({
            x: this.scale.width - this.minimapPadding - this.minimapSize,
            y: this.minimapPadding
        })
        .setDepth(1001)
        .setScrollFactor(0)
        .setVisible(true);

        // Indicatore del player
        this.minimapPlayerIndicator = this.add.graphics()
            .setDepth(1002)
            .setScrollFactor(0)
            .setVisible(true);

        // Grafica per la traiettoria
        this.pathGraphics = this.add.graphics()
            .setDepth(1001)
            .setScrollFactor(0)
            .setVisible(true);

        // Bordo minimappa
        this.minimap.lineStyle(2, 0xffffff, 1);
        this.minimap.strokeRect(0, 0, this.minimapSize, this.minimapSize);
    }

    private generateRandomTarget() {
        if (this.isTargetGenerated || !Intro.ship) return;

        const worldBounds = this.physics.world.bounds;
        
        let attempts = 0;
        const maxAttempts = 200;
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
            
            if (distance >= this.minDistance) {
                validPointFound = true;
            }
            
            attempts++;
        }
        
        if (!validPointFound) {
            const angle = Phaser.Math.Between(0, 360);
            this.targetPoint = new Phaser.Geom.Point(
                Intro.ship.x + Math.cos(Phaser.Math.DegToRad(angle)) * this.minDistance,
                Intro.ship.y + Math.sin(Phaser.Math.DegToRad(angle)) * this.minDistance
            );
        }
        
        this.isTargetGenerated = true;
    }

    private drawPath(worldBounds: Phaser.Geom.Rectangle, scaleX: number, scaleY: number) {
        if (!this.targetPoint || !Intro.ship) return;
        
        // Coordinate convertite
        const startX = (Intro.ship.x - worldBounds.x) * scaleX;
        const startY = (Intro.ship.y - worldBounds.y) * scaleY;
        const endX = (this.targetPoint.x - worldBounds.x) * scaleX;
        const endY = (this.targetPoint.y - worldBounds.y) * scaleY;
        
        // Posizioni sullo schermo
        const screenStartX = this.scale.width - this.minimapPadding - this.minimapSize + startX;
        const screenStartY = this.minimapPadding + startY;
        const screenEndX = this.scale.width - this.minimapPadding - this.minimapSize + endX;
        const screenEndY = this.minimapPadding + endY;
        
        // Disegna traiettoria
        this.pathGraphics.clear()
            .lineStyle(4, 0x33ff33, 0.9)
            .beginPath()
            .moveTo(screenStartX, screenStartY)
            .lineTo(screenEndX, screenEndY)
            .strokePath();
            
        // Disegna marker di destinazione
        this.pathGraphics.fillStyle(0x33ff33, 0.9)
            .fillCircle(screenEndX, screenEndY, 6)
            .lineStyle(2, 0xffffff, 1)
            .strokeCircle(screenEndX, screenEndY, 6);
    }

    private drawRotatedTriangle(x: number, y: number, rotation: number) {
        const halfBase = this.triangleSize / 2;
        const points = [
            { x: 0, y: -this.triangleHeight/2 },
            { x: -halfBase, y: this.triangleHeight/2 },
            { x: halfBase, y: this.triangleHeight/2 }
        ];

        const rotatedPoints = points.map(p => ({
            x: x + (p.x * Math.cos(rotation) - p.y * Math.sin(rotation)),
            y: y + (p.x * Math.sin(rotation) + p.y * Math.cos(rotation))
        }));

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
        if (!group?.getChildren) return;

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
        const sceneActive = introScene?.scene.isActive();
        
        // Gestione visibilità elementi
        [
            this.minimapBg, 
            this.minimap, 
            this.minimapPlayerIndicator, 
            this.pathGraphics
        ].forEach(obj => obj.setVisible(!!sceneActive));

        if (!sceneActive || !Intro.asteroids || !Intro.trashGroup || !Intro.powerUps || !Intro.ship) {
            if (!sceneActive) this.isTargetGenerated = false;
            return;
        }

        // Genera target se necessario
        if (!this.isTargetGenerated) {
            this.generateRandomTarget();
        }

        // Prepara minimappa
        this.minimap.clear().lineStyle(2, 0xffffff, 1);
        this.minimap.strokeRect(0, 0, this.minimapSize, this.minimapSize);

        const worldBounds = this.physics.world.bounds;
        const scaleX = this.minimapSize / worldBounds.width;
        const scaleY = this.minimapSize / worldBounds.height;

        // Disegna elementi
        this.drawPath(worldBounds, scaleX, scaleY);
        this.drawMinimapObjects(Intro.asteroids, 0xff0000, 5, scaleX, scaleY, worldBounds);
        this.drawMinimapObjects(Intro.trashGroup, 0x00ffff, 5, scaleX, scaleY, worldBounds);
        this.drawMinimapObjects(Intro.powerUps, 0xffff00, 5, scaleX, scaleY, worldBounds);

        // Disegna player
        const playerX = (Intro.ship.x - worldBounds.x) * scaleX;
        const playerY = (Intro.ship.y - worldBounds.y) * scaleY;
        this.drawRotatedTriangle(
            this.scale.width - this.minimapPadding - this.minimapSize + playerX,
            this.minimapPadding + playerY,
            Intro.ship.rotation
        );
    }

    // Metodo per resettare il target (da chiamare quando viene raggiunto)
    public resetTarget() {
        this.isTargetGenerated = false;
        this.targetPoint = null;
    }
}