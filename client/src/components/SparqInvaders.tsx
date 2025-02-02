import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
export function SparqInvaders() {
const canvasRef = useRef<HTMLCanvasElement>(null);
const [currentScore, setCurrentScore] = useState(0);
const [highScore, setHighScore] = useState(0);
useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;
const ctx = canvas.getContext('2d');
if (!ctx) return;
text
// Game state
const player = { x: canvas.width / 2 - 40, y: canvas.height - 200, width: 80, height: 80 };
const bullets: Array<{ x: number, y: number, width: number, height: number }> = [];
const enemies: Array<{ x: number, y: number, width: number, height: number, img: HTMLImageElement, dx: number }> = [];
let playerImg: HTMLImageElement;
let enemyImg: HTMLImageElement;
let animationFrameId: number;

// Image loader promise
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  });
};

// Initialize game: load assets and create enemy formation
const initGame = async () => {
  try {
    playerImg = await loadImage('/game_hero.png');
    enemyImg = await loadImage('/invader_1.png');
    // Create enemies in a grid formation
    const rows = 3;
    const cols = 8;
    const offsetX = 30;
    const offsetY = 150;  // Moved down the spawn position
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
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Update and draw bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.y -= 5;
    ctx.fillStyle = 'red';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    // Remove bullets off screen
    if (bullet.y + bullet.height < 0) {
      bullets.splice(i, 1);
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
        // Collision detected:
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        setCurrentScore(prev => prev + 100);
        break;
      }
    }
  }

  // Draw scores
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(`Score: ${currentScore}`, 10, 20);
  ctx.fillText(`High Score: ${highScore}`, 10, 40);

  animationFrameId = requestAnimationFrame(gameLoop);
};

// Handle keyboard input for player movement and shooting
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    player.x = Math.max(player.x - 10, 0);
  }
  if (e.key === 'ArrowRight' || e.key === 'd') {
    player.x = Math.min(player.x + 10, canvas.width - player.width);
  }
  if (e.key === ' ') {
    bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10
    });
  }
};

document.addEventListener('keydown', handleKeyDown);
initGame();

return () => {
  document.removeEventListener('keydown', handleKeyDown);
  cancelAnimationFrame(animationFrameId);
};
}, [currentScore, highScore]);
return (
<Card className="bento-card">
<canvas ref={canvasRef} width={350} height={635} style={{ backgroundColor: 'black' }} />
<div style={{ color: 'white', padding: '10px', textAlign: 'center' }}>
<p>Score: {currentScore}</p>
<p>High Score: {highScore}</p>
</div>
</Card>
);
}