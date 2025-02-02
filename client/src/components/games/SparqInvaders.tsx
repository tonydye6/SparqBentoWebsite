import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed?: number;
}

interface Enemy extends GameObject {
  img: HTMLImageElement;
  direction: number;
  points: number;
  type: number;
}

interface GameState {
  isPlaying: boolean;
  hasStarted: boolean;
  level: number;
  lives: number;
  screenShake: number;
}

export function SparqInvaders() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    hasStarted: false,
    level: 1,
    lives: 3,
    screenShake: 0
  });

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
    x: CANVAS_WIDTH / 2 - 25,
    y: CANVAS_HEIGHT - 60,
    width: 40,
    height: 40,
    speed: 5
  });

  const bullets = useRef<GameObject[]>([]);
  const enemies = useRef<Enemy[]>([]);
  const particles = useRef<GameObject[]>([]);
  const assets = useRef<{
    player: HTMLImageElement | null;
    enemies: HTMLImageElement[];
  }>({ player: null, enemies: [] });

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log(`Successfully loaded: ${src}`);
        resolve(img);
      };
      img.onerror = (e) => {
        console.error(`Failed to load image: ${src}`, e);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  };

  const initAssets = async () => {
    try {
      console.log('Starting asset loading...');

      const playerImg = await loadImage('/images/game_hero.svg');
      console.log('Player ship loaded');

      const enemyPromises = [
        loadImage('/images/invader_1.svg'),
        loadImage('/images/invader_2.svg'),
        loadImage('/images/invader_3.svg'),
        loadImage('/images/invader_4.svg')
      ];

      const enemyImgs = await Promise.all(enemyPromises);
      console.log('All enemy images loaded');

      assets.current = {
        player: playerImg,
        enemies: enemyImgs
      };

      return true;
    } catch (error) {
      console.error('Failed to load game assets:', error);
      toast({
        title: "Asset Loading Error",
        description: "Please refresh the page to try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const initEnemies = () => {
    enemies.current = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        const enemyType = row % assets.current.enemies.length;
        enemies.current.push({
          x: col * ENEMY_PADDING + ENEMY_PADDING,
          y: row * ENEMY_PADDING + ENEMY_TOP_OFFSET,
          width: 30,
          height: 30,
          img: assets.current.enemies[enemyType],
          direction: 1,
          points: (ENEMY_ROWS - row) * 100,
          type: enemyType,
          speed: 1
        });
      }
    }
    console.log(`Initialized ${enemies.current.length} enemies`);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
    if (!gameState.isPlaying) return;

    pressedKeys.current.add(e.key);
    if (e.key === ' ') {
      createBullet();
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    pressedKeys.current.delete(e.key);
  };

  const createBullet = () => {
    if (!gameState.isPlaying) return;

    bullets.current.push({
      x: player.current.x + player.current.width / 2 - 2,
      y: player.current.y,
      width: 4,
      height: 10
    });
  };

  const updatePlayer = (deltaTime: number) => {
    if (!gameState.isPlaying) return;

    const moveSpeed = 300;
    const keys = pressedKeys.current;

    if (keys.has('ArrowLeft') || keys.has('a')) {
      player.current.x = Math.max(0, player.current.x - moveSpeed * deltaTime);
    }
    if (keys.has('ArrowRight') || keys.has('d')) {
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
    if (!gameState.isPlaying) return;

    let shouldChangeDirection = false;
    const enemySpeed = 100 * (1 + gameState.level * 0.1);

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

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#000033');
    gradient.addColorStop(1, '#000066');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw player
    if (assets.current.player && gameState.isPlaying) {
      ctx.drawImage(
        assets.current.player,
        player.current.x,
        player.current.y,
        player.current.width,
        player.current.height
      );
    }

    // Draw bullets
    ctx.fillStyle = '#ff0000';
    bullets.current.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemies
    enemies.current.forEach(enemy => {
      ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw UI
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Lives: ${gameState.lives}`, CANVAS_WIDTH - 100, 30);
  };

  const gameUpdate = (timestamp: number) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const deltaTime = (timestamp - lastTime.current) / 1000;
    lastTime.current = timestamp;

    if (gameState.isPlaying) {
      updatePlayer(deltaTime);
      updateBullets(deltaTime);
      updateEnemies(deltaTime);
      checkCollisions();
    }

    draw(ctx);
    gameLoop.current = requestAnimationFrame(gameUpdate);
  };

  const startGame = async () => {
    console.log('Starting game...');

    if (!assets.current.player) {
      const loaded = await initAssets();
      if (!loaded) return;
    }

    initEnemies();
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      hasStarted: true
    }));

    if (!gameLoop.current) {
      gameLoop.current = requestAnimationFrame(gameUpdate);
    }

    console.log('Game started successfully');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const savedHighScore = localStorage.getItem('sparqInvadersHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    // Start the game loop immediately
    gameLoop.current = requestAnimationFrame(gameUpdate);

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
      {!gameState.isPlaying && (
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