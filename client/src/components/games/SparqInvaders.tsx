import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";

export function SparqInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const playerRef = useRef<{ x: number, y: number, width: number, height: number }>();
  const bulletsRef = useRef<Array<{ x: number, y: number, width: number, height: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game state
    playerRef.current = { x: canvas.width / 2 - 80, y: canvas.height - 160, width: 160, height: 160 };
    bulletsRef.current = [];
    const enemies: Array<{ x: number, y: number, width: number, height: number, img: HTMLImageElement, dx: number }> = [];
    let playerImg: HTMLImageElement;
    let enemyImg: HTMLImageElement;
    let animationFrameId: number;

    // Image loader promise
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    };

    // Handle keyboard input for player movement and shooting
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playerRef.current) return;

      // Prevent default actions for game controls
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const moveSpeed = 20;

      if (e.key === 'ArrowLeft' || e.key === 'a') {
        playerRef.current.x = Math.max(playerRef.current.x - moveSpeed, 0);
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        playerRef.current.x = Math.min(playerRef.current.x + moveSpeed, canvas.width - playerRef.current.width);
      }
      if (e.key === ' ' && bulletsRef.current) {
        bulletsRef.current.push({
          x: playerRef.current.x + playerRef.current.width / 2 - 2,
          y: playerRef.current.y,
          width: 4,
          height: 10
        });
      }
    };

    // Initialize game: load assets and create enemy formation
    const initGame = async () => {
      try {
        playerImg = await loadImage('game_hero.png');
        enemyImg = await loadImage('invader_1.png');

        // Create enemies in a grid formation
        const rows = 3;
        const cols = 8;
        const offsetX = 30;
        const offsetY = 30;
        const spacingX = 60;
        const spacingY = 50;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            enemies.push({
              x: offsetX + c * spacingX,
              y: offsetY + r * spacingY,
              width: 40,
              height: 40,
              img: enemyImg,
              dx: 1  // initial horizontal speed
            });
          }
        }

        // Start the game loop
        gameLoop();
      } catch (error) {
        console.error('Error loading game assets:', error);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Failed to load game assets', canvas.width / 2, canvas.height / 2);
      }
    };

    const gameLoop = () => {
      if (!ctx || !canvas || !playerRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the player
      if (playerImg) {
        ctx.drawImage(playerImg, playerRef.current.x, playerRef.current.y, playerRef.current.width, playerRef.current.height);
      }

      // Update and draw bullets
      if (bulletsRef.current) {
        for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
          const bullet = bulletsRef.current[i];
          bullet.y -= 5;
          ctx.fillStyle = 'red';
          ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
          // Remove bullets off screen
          if (bullet.y + bullet.height < 0) {
            bulletsRef.current.splice(i, 1);
          }
        }
      }

      // Update and draw enemies
      enemies.forEach((enemy) => {
        enemy.x += enemy.dx;
        // Bounce enemy off left/right boundaries
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
          enemy.dx *= -1;
          enemy.y += 20;
        }
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
      });

      // Collision detection between bullets and enemies
      if (bulletsRef.current) {
        for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
          const bullet = bulletsRef.current[i];
          for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            if (
              bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y
            ) {
              // Collision detected:
              bulletsRef.current.splice(i, 1);
              enemies.splice(j, 1);
              setCurrentScore(prev => prev + 100);
              break;
            }
          }
        }
      }

      // Scores are now displayed in the UI overlay

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    // Add event listener for keyboard controls
    window.addEventListener('keydown', handleKeyDown);

    // Initialize the game
    initGame();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentScore, highScore]);

  return (
    <div className="col-span-8 row-span-4">
      <Card className="w-full h-full bg-black flex items-center justify-center">
        <div className="relative" style={{ width: '350px', height: '1035px' }}> {/* Updated height */}
          <canvas 
            ref={canvasRef} 
            width={350} 
            height={1035} 
            style={{ backgroundColor: 'black' }}
          />
          <div className="absolute top-4 right-4 text-white text-right">
            <p>Current Score: {currentScore}</p>
            <p>High Score: {highScore}</p>
          </div>
          <div className="absolute top-4 left-4 text-white">
            <p>Level: 1</p>
          </div>
          <div className="absolute bottom-8 left-0 right-0 text-center text-white bg-black/50 py-2">
            <p className="font-bold mb-1">Controls</p>
            <p className="text-sm">← or A: Move Left | → or D: Move Right | Space: Shoot</p>
          </div>
        </div>
      </Card>
    </div>
  );
}