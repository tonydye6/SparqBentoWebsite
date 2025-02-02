import { useEffect, useRef } from 'react';

export function SparqInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Load assets with proper error handling
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    };

    // Game loop
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player
      if (playerImg) {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
      }

      // Draw bullets
      bullets.forEach((bullet, index) => {
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
          }
        });
      });

      // Draw enemies
      enemies.forEach((enemy) => {
        if (enemy.img) {
          ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
          enemy.x += enemy.direction || (enemy.direction = Math.random() > 0.5 ? -1 : 1);
          if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.direction! *= -1;
            enemy.y += 20;
          }
        }
      });

      requestAnimationFrame(draw);
    }

    // Player controls
    function handleKeyDown(e: KeyboardEvent) {
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
      loadImage('/public/sparqIcon.png'),
      loadImage('/public/Skull(Red).png'),
      loadImage('/public/bfpf.png'),
      loadImage('/public/bfpfr.png'),
      loadImage('/public/bfpfw.png')
    ]).then(([hero, ...invaders]) => {
      playerImg = hero;
      enemyImgs = invaders;

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
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Failed to load game assets', canvas.width/2, canvas.height/2);
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={350}
      height={500}
      className="max-w-full h-auto"
    />
  );
}