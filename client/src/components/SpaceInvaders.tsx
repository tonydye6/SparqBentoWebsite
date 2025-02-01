import { useEffect, useRef, useState } from "react";

interface SpaceInvadersProps {
  width?: number;
  height?: number;
}

export function SpaceInvaders({ width = 350, height = 500 }: SpaceInvadersProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const gameStateRef = useRef({
    player: { x: 150, y: 450, width: 50, height: 50, speed: 5 },
    bullets: [] as { x: number, y: number, width: number, height: number }[],
    enemies: [] as { x: number, y: number, width: number, height: number, img: HTMLImageElement, direction: number }[],
    assets: {
      player: new Image(),
      enemies: [] as HTMLImageElement[],
      loaded: false,
      loadedCount: 0,
      totalCount: 5 // player + 4 enemy types
    },
    keys: {
      left: false,
      right: false,
      space: false
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError("Could not initialize game context");
      return;
    }

    const gameState = gameStateRef.current;

    // Helper function to create placeholder colored rectangles
    const createColoredRect = (color: string) => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 40;
      tempCanvas.height = 40;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.fillStyle = color;
        tempCtx.fillRect(0, 0, 40, 40);
      }
      const img = new Image();
      img.src = tempCanvas.toDataURL();
      return img;
    };

    // Initialize with colored rectangles while loading actual assets
    gameState.assets.player = createColoredRect('#00ff00');
    gameState.assets.enemies = [
      createColoredRect('#ff0000'),
      createColoredRect('#ff3333'),
      createColoredRect('#ff6666'),
      createColoredRect('#ff9999')
    ];
    gameState.assets.loaded = true;

    // Initialize enemies with colored rectangles
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        gameState.enemies.push({
          x: i * 60 + 20,
          y: j * 60 + 20,
          width: 40,
          height: 40,
          img: gameState.assets.enemies[j % gameState.assets.enemies.length],
          direction: Math.random() > 0.5 ? 1 : -1
        });
      }
    }

    setLoading(false);

    // Event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') gameState.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') gameState.keys.right = true;
      if (e.key === ' ') {
        e.preventDefault();
        if (!gameState.keys.space) {
          gameState.bullets.push({
            x: gameState.player.x + gameState.player.width / 2 - 2,
            y: gameState.player.y,
            width: 4,
            height: 10
          });
        }
        gameState.keys.space = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') gameState.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') gameState.keys.right = false;
      if (e.key === ' ') gameState.keys.space = false;
    };

    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('keyup', handleKeyUp);

    // Game loop
    let animationFrameId: number;

    function gameLoop() {
      if (!canvas || !ctx || !gameState.assets.loaded) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update player position
      if (gameState.keys.left) {
        gameState.player.x = Math.max(0, gameState.player.x - gameState.player.speed);
      }
      if (gameState.keys.right) {
        gameState.player.x = Math.min(
          canvas.width - gameState.player.width,
          gameState.player.x + gameState.player.speed
        );
      }

      // Draw player
      ctx.drawImage(
        gameState.assets.player,
        gameState.player.x,
        gameState.player.y,
        gameState.player.width,
        gameState.player.height
      );

      // Update and draw bullets
      gameState.bullets = gameState.bullets.filter(bullet => {
        bullet.y -= 5;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Check collision with enemies
        gameState.enemies = gameState.enemies.filter(enemy => {
          const hit = (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          );
          return !hit;
        });

        return bullet.y > 0;
      });

      // Update and draw enemies
      gameState.enemies.forEach(enemy => {
        enemy.x += enemy.direction;
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
          enemy.direction *= -1;
          enemy.y += 20;
        }
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return <div className="text-white">Loading game...</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg outline-none"
      tabIndex={0}
      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
    />
  );
}