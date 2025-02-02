import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Enemy extends GameObject {
  img: HTMLImageElement | null;
  direction: number;
  points: number;
  type: number;
}

export function SparqInvaders() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const CANVAS_WIDTH = 350;
  const CANVAS_HEIGHT = 500;
  const ENEMY_ROWS = 4;
  const ENEMY_COLS = 6;
  const ENEMY_PADDING = 40;
  const ENEMY_TOP_OFFSET = 50;

  const gameLoop = useRef<number>();
  const lastTime = useRef<number>(0);
  const pressedKeys = useRef<Set<string>>(new Set());
  const player = useRef<GameObject>({
    x: CANVAS_WIDTH / 2 - 20,
    y: CANVAS_HEIGHT - 60,
    width: 40,
    height: 40
  });

  const bullets = useRef<GameObject[]>([]);
  const enemies = useRef<Enemy[]>([]);
  const playerImage = useRef<HTMLImageElement | null>(null);
  const enemyImages = useRef<HTMLImageElement[]>([]);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      console.log(`Attempting to load image: ${src}`);
      const img = new Image();
      img.onload = () => {
        console.log(`Successfully loaded image: ${src}`);
        resolve(img);
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        reject(new Error(`Failed to load image: ${src}`));
      };
      // Try with and without leading slash
      img.src = src.startsWith('/') ? src : `/${src}`;
    });
  };

  const tryLoadAssets = async () => {
    try {
      console.log('Starting asset loading...');

      // Try different paths for player image
      const playerPaths = ['images/game_hero.png', '/images/game_hero.png', 'public/images/game_hero.png'];
      for (const path of playerPaths) {
        try {
          playerImage.current = await loadImage(path);
          console.log('Player image loaded successfully');
          break;
        } catch (e) {
          console.error(`Failed to load player image from ${path}`);
        }
      }

      // Try loading enemy images
      const enemyPaths = [
        'images/invader_1.png',
        'images/invader_2.png',
        'images/invader_3.png',
        'images/invader_4.png'
      ];

      for (const path of enemyPaths) {
        try {
          const img = await loadImage(path);
          enemyImages.current.push(img);
        } catch (e) {
          console.error(`Failed to load enemy image: ${path}`);
        }
      }

      console.log('Asset loading complete');
      console.log('Player image:', playerImage.current);
      console.log('Enemy images:', enemyImages.current);

      return true;
    } catch (error) {
      console.error('Asset loading failed:', error);
      return false;
    }
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    if (playerImage.current) {
      ctx.drawImage(
        playerImage.current,
        player.current.x,
        player.current.y,
        player.current.width,
        player.current.height
      );
    } else {
      // Fallback triangle shape
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.moveTo(player.current.x + player.current.width / 2, player.current.y);
      ctx.lineTo(player.current.x, player.current.y + player.current.height);
      ctx.lineTo(player.current.x + player.current.width, player.current.y + player.current.height);
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: Enemy) => {
    if (enemy.img) {
      ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    } else {
      // Fallback rectangle shape
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(enemy.x + 10, enemy.y + 10, 3, 0, Math.PI * 2);
      ctx.arc(enemy.x + enemy.width - 10, enemy.y + 10, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const initEnemies = () => {
    console.log('Initializing enemies...');
    enemies.current = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        const enemyType = row % enemyImages.current.length;
        enemies.current.push({
          x: col * ENEMY_PADDING + ENEMY_PADDING,
          y: row * ENEMY_PADDING + ENEMY_TOP_OFFSET,
          width: 30,
          height: 30,
          img: enemyImages.current[enemyType] || null,
          direction: 1,
          points: (ENEMY_ROWS - row) * 100,
          type: enemyType
        });
      }
    }
    console.log(`Initialized ${enemies.current.length} enemies`);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ') e.preventDefault();
    if (!isPlaying) return;
    pressedKeys.current.add(e.key);
    if (e.key === ' ') createBullet();
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    pressedKeys.current.delete(e.key);
  };

  const createBullet = () => {
    if (!isPlaying) return;
    bullets.current.push({
      x: player.current.x + player.current.width / 2 - 2,
      y: player.current.y,
      width: 4,
      height: 10
    });
  };

  const updatePlayer = (deltaTime: number) => {
    if (!isPlaying) return;
    const moveSpeed = 300;
    if (pressedKeys.current.has('ArrowLeft') || pressedKeys.current.has('a')) {
      player.current.x = Math.max(0, player.current.x - moveSpeed * deltaTime);
    }
    if (pressedKeys.current.has('ArrowRight') || pressedKeys.current.has('d')) {
      player.current.x = Math.min(
        CANVAS_WIDTH - player.current.width,
        player.current.x + moveSpeed * deltaTime
      );
    }
  };

  const updateBullets = (deltaTime: number) => {
    const bulletSpeed = 400;
    bullets.current = bullets.current.filter(bullet => {
      bullet.y -= bulletSpeed * deltaTime;
      return bullet.y > 0;
    });
  };

  const updateEnemies = (deltaTime: number) => {
    if (!isPlaying) return;
    let shouldChangeDirection = false;
    const enemySpeed = 100;

    enemies.current.forEach(enemy => {
      enemy.x += enemy.direction * enemySpeed * deltaTime;
      if (enemy.x <= 0 || enemy.x + enemy.width >= CANVAS_WIDTH) {
        shouldChangeDirection = true;
      }
    });

    if (shouldChangeDirection) {
      enemies.current.forEach(enemy => {
        enemy.direction *= -1;
        enemy.y += 20;
      });
    }
  };

  const checkCollisions = () => {
    bullets.current.forEach((bullet, bulletIndex) => {
      enemies.current.forEach((enemy, enemyIndex) => {
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          bullets.current.splice(bulletIndex, 1);
          enemies.current.splice(enemyIndex, 1);
          setScore(prev => prev + enemy.points);
        }
      });
    });
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawPlayer(ctx);

    ctx.fillStyle = '#ff0000';
    bullets.current.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    enemies.current.forEach(enemy => {
      drawEnemy(ctx, enemy);
    });

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 30);
  };

  const gameUpdate = (timestamp: number) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const deltaTime = (timestamp - lastTime.current) / 1000;
    lastTime.current = timestamp;

    updatePlayer(deltaTime);
    updateBullets(deltaTime);
    updateEnemies(deltaTime);
    checkCollisions();
    draw(ctx);

    if (isPlaying) {
      gameLoop.current = requestAnimationFrame(gameUpdate);
    }
  };

  const startGame = async () => {
    console.log('Starting game...');
    initEnemies();
    setIsPlaying(true);
    lastTime.current = performance.now();
    gameLoop.current = requestAnimationFrame(gameUpdate);
    console.log('Game started');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    console.log('Loading initial assets...');
    tryLoadAssets().catch(console.error);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current);
      }
    };
  }, []);

  return (
    <Card className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-4">
      <canvas
        ref={canvasRef}
        className="border border-gray-700 rounded-lg bg-black mb-4"
        style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
      />
      {!isPlaying && (
        <Button 
          onClick={startGame}
          className="bg-primary hover:bg-primary/90 text-white mb-4"
        >
          Start Game
        </Button>
      )}
      <div className="text-center">
        <p className="text-white text-sm">Use Arrow Keys or A/D to move</p>
        <p className="text-white text-sm">Space to shoot</p>
      </div>
    </Card>
  );
}