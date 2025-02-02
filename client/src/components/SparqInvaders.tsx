import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";

export function SparqInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game settings
    const player = { x: 150, y: 450, width: 50, height: 50 };
    const bullets: Array<{ x: number, y: number, width: number, height: number }> = [];
    const enemies: Array<{ x: number, y: number, width: number, height: number, img: HTMLImageElement, direction?: number }> = [];
    let playerImg: HTMLImageElement;
    let enemyImgs: HTMLImageElement[] = [];
    let gameLoop: number;

    // Load assets with proper error handling
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    };

    // Load or initialize high score
    const loadHighScore = () => {
      const savedScore = localStorage.getItem('sparqInvadersHighScore');
      if (savedScore) {
        setHighScore(parseInt(savedScore, 10));
      }
    };

    // Save high score
    const saveHighScore = (score: number) => {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('sparqInvadersHighScore', score.toString());
      }
    };

    // Game loop
    function draw() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player
      if (playerImg) {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
      }

      // Draw bullets
      bullets.forEach((bullet, index) => {
        if (!ctx) return;

        ctx.fillStyle = 'red';
        bullet.y -= 5;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove bullets that are off screen
        if (bullet.y < 0) {
          bullets.splice(index, 1);
        }

        // Check for collisions with enemies
        enemies.forEach((enemy, enemyIndex) => {
          if (bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y) {
            bullets.splice(index, 1);
            enemies.splice(enemyIndex, 1);
            scoreRef.current += 100;
            setCurrentScore(scoreRef.current);
            saveHighScore(scoreRef.current);
          }
        });
      });

      // Draw enemies
      enemies.forEach((enemy) => {
        if (!ctx) return;
        if (enemy.img) {
          ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
          enemy.x += enemy.direction || (enemy.direction = Math.random() > 0.5 ? -1 : 1);
          if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.direction! *= -1;
            enemy.y += 20;
          }
        }
      });

      // Draw scores
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(`Score: ${scoreRef.current}`, 10, 20);
      ctx.fillText(`High Score: ${highScore}`, 10, 40);

      gameLoop = requestAnimationFrame(draw);
    }

    // Player controls
    function handleKeyDown(e: KeyboardEvent) {
      if (!canvas) return;

      if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.x = Math.max(player.x - 10, 0);
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        player.x = Math.min(player.x + 10, canvas.width - player.width);
      }
      if (e.key === ' ' || e.key === 'w' || e.key === 'ArrowUp') {
        bullets.push({
          x: player.x + player.width / 2 - 2,
          y: player.y,
          width: 4,
          height: 10
        });
      }
    }

    // Initialize the game
    Promise.all([
      loadImage('/sparqIcon.png'),
      loadImage('/Skull(Red).png'),
      loadImage('/bfpf.png'),
      loadImage('/bfpfr.png'),
      loadImage('/bfpfw.png')
    ]).then(([hero, ...invaders]) => {
      playerImg = hero;
      enemyImgs = invaders;
      loadHighScore();

      // Initialize enemies after images are loaded
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
          enemies.push({
            x: i * 60 + 20,
            y: j * 60 + 20,
            width: 40,
            height: 40,
            img: enemyImgs[j % enemyImgs.length],
            direction: 1
          });
        }
      }

      // Start game loop and add event listener
      document.addEventListener('keydown', handleKeyDown);
      draw();
    }).catch(error => {
      console.error('Failed to load game assets:', error);
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Failed to load game assets', canvas.width/2, canvas.height/2);
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (gameLoop) {
        cancelAnimationFrame(gameLoop);
      }
    };
  }, [highScore]);

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <div className="mb-4 w-full flex justify-between px-4">
        <div className="text-sm">
          <div>Score: {currentScore}</div>
          <div>High Score: {highScore}</div>
        </div>
        <div className="text-sm text-right">
          <div>Controls:</div>
          <div>← → or A/D: Move</div>
          <div>Space/W/↑: Shoot</div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={350}
        height={500}
        className="max-w-full h-auto"
      />
    </div>
  );
}