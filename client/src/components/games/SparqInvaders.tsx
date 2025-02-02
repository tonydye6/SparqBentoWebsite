
import { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

export function SparqInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const [gameState, setGameState] = useState({
    currentScore: 0,
    highScore: parseInt(localStorage.getItem('sparqInvadersHighScore') || '0'),
    currentLevel: 1
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const player = {
      x: canvas.width / 2 - 40,
      y: canvas.height - 80,
      width: 80,
      height: 80
    };

    const bullets: Array<{ x: number; y: number; width: number; height: number }> = [];
    const enemies: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      img: HTMLImageElement;
      dx: number;
    }> = [];

    const playerImg = new Image();
    playerImg.src = '/game_hero.png';

    const loadEnemyImages = async () => {
      try {
        const images = await Promise.all(
          Array.from({ length: 8 }, (_, i) => {
            const img = new Image();
            img.src = `/invader_${i + 1}.png`;
            return new Promise<HTMLImageElement>((resolve, reject) => {
              img.onload = () => resolve(img);
              img.onerror = reject;
            });
          })
        );
        initEnemies(images);
      } catch (error) {
        console.error('Failed to load enemy images:', error);
      }
    };

    const initEnemies = (images: HTMLImageElement[]) => {
      const rows = 3;
      const cols = 8;
      const offsetX = 30;
      const offsetY = 150;
      const spacingX = 60;
      const spacingY = 50;

      enemies.length = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          enemies.push({
            x: offsetX + c * spacingX,
            y: offsetY + r * spacingY,
            width: 40,
            height: 40,
            img: images[Math.floor(Math.random() * images.length)],
            dx: 2
          });
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        bullets.push({
          x: player.x + player.width / 2 - 2,
          y: player.y,
          width: 4,
          height: 10
        });
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.x = Math.max(player.x - 10, 0);
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        player.x = Math.min(player.x + 10, canvas.width - player.width);
      }
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (playerImg.complete) {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
      }

      bullets.forEach((bullet, i) => {
        bullet.y -= 5;
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      enemies.forEach((enemy, i) => {
        enemy.x += enemy.dx;
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
          enemy.dx *= -1;
          enemy.y += 20;
        }
        if (enemy.img.complete) {
          ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
        }
      });

      // Clean up off-screen bullets
      bullets.forEach((bullet, i) => {
        if (bullet.y < 0) {
          bullets.splice(i, 1);
        }
      });

      // Collision detection
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = enemies.length - 1; j >= 0; j--) {
          const enemy = enemies[j];
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          ) {
            bullets.splice(i, 1);
            enemies.splice(j, 1);
            const newScore = gameState.currentScore + 100;
            setGameState(prev => ({
              ...prev,
              currentScore: newScore,
              highScore: Math.max(prev.highScore, newScore)
            }));
            localStorage.setItem('sparqInvadersHighScore', Math.max(gameState.highScore, newScore).toString());
            break;
          }
        }
      }

      if (enemies.length === 0) {
        setGameState(prev => ({
          ...prev,
          currentLevel: prev.currentLevel + 1
        }));
        loadEnemyImages();
      }

      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(`Score: ${gameState.currentScore}`, 10, 20);
      ctx.fillText(`High Score: ${gameState.highScore}`, 10, 40);
      ctx.fillText(`Level: ${gameState.currentLevel}`, 10, 60);

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    playerImg.onload = () => {
      loadEnemyImages();
      gameLoop();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []); // Empty dependency array to run only once

  return (
    <Card className="w-full h-full bg-black flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={350}
        height={635}
        style={{ backgroundColor: 'black' }}
      />
    </Card>
  );
}
