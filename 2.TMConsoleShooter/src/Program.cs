using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;

namespace MyApp
{
    class Program
    {
        static void Main(string[] args)
        {
            var game = new ConsoleShooter(width: 40, height: 20);
            game.Run();
        }
    }

    class ConsoleShooter
    {
        readonly int Width;
        readonly int Height;
        char[,] buffer;
    int playerX;
    PlayerController player;
    GameState state;
    PlayerState playerState;
        bool running = true;
    List<Bullet> bullets = new List<Bullet>();
        List<Enemy> enemies = new List<Enemy>();
    List<Popup> popups = new List<Popup>();
        Random rnd = new Random();
    double enemySpeed = 0.25; // cells per frame (reduced further)
    GameMode mode;

        public ConsoleShooter(int width, int height)
        {
            Width = width;
            Height = height;
            buffer = new char[Height, Width];
            playerX = Width / 2;
            player = new PlayerController(Width, playerX);
            state = new GameState(startingLives: 5);
            playerState = new PlayerState(startingLives: 5);
            mode = GameMode.Normal();
            Console.CursorVisible = false;
        }

        public void Run()
        {
            // ensure console buffer/window are large enough
            TryEnsureConsoleSize();

            var sw = Stopwatch.StartNew();
            long lastSpawn = 0;
            long spawnInterval = mode.SpawnIntervalMs;
            long lastFrame = 0;
            int frameMs = 60;

            DrawBorder();

            while (running)
            {
                long now = sw.ElapsedMilliseconds;
                if (now - lastFrame >= frameMs)
                {
                    HandleInput();
                    Update(now - lastFrame);
                    Render();
                    lastFrame = now;
                }

                if (now - lastSpawn >= spawnInterval)
                {
                    SpawnEnemy();
                    lastSpawn = now;
                    // make it slightly harder over time
                    if (spawnInterval > 200) spawnInterval -= 5;
                }

                Thread.Sleep(1);
            }

            Console.SetCursorPosition(0, Height + 3);
            Console.CursorVisible = true;
            Console.WriteLine("Press any key to exit...");
            Console.ReadKey(true);
        }

    [System.Runtime.Versioning.SupportedOSPlatform("windows")]
    void TryEnsureConsoleSize()
        {
            try
            {
                int neededWidth = Width + 2;
                int neededHeight = Height + 6; // borders + HUD

                if (Console.WindowWidth < neededWidth || Console.WindowHeight < neededHeight)
                {
                    int newWidth = Math.Max(Console.WindowWidth, neededWidth);
                    int newHeight = Math.Max(Console.WindowHeight, neededHeight);
                    try
                    {
                        Console.SetWindowSize(newWidth, newHeight);
                    }
                    catch { /* ignore if unable to resize */ }
                    try
                    {
                        Console.BufferWidth = Math.Max(Console.BufferWidth, newWidth);
                        Console.BufferHeight = Math.Max(Console.BufferHeight, newHeight);
                    }
                    catch { /* ignore */ }
                }
            }
            catch { /* ignore any console-related errors */ }
        }

        void DrawBorder()
        {
            Console.Clear();
            for (int y = 0; y <= Height + 1; y++)
            {
                for (int x = 0; x <= Width + 1; x++)
                {
                    if (y == 0 || y == Height + 1 || x == 0 || x == Width + 1)
                    {
                        Console.SetCursorPosition(x, y);
                        Console.Write('#');
                    }
                }
            }
        }

        void HandleInput()
        {
            // only check for quit key here; movement and firing handled by PlayerController
            while (Console.KeyAvailable)
            {
                var key = Console.ReadKey(true).Key;
                if (key == ConsoleKey.Escape)
                {
                    running = false;
                }
            }
        }

        void Update(long deltaMs)
        {
            // delegate movement and auto-fire to PlayerController
            player.UpdateMovement();
            playerX = player.X;
            var newBullets = player.TryAutoFire(deltaMs, Height);
            if (newBullets != null && newBullets.Count > 0) bullets.AddRange(newBullets);

            // update bullets (respect Speed)
            for (int i = bullets.Count - 1; i >= 0; i--)
            {
                bullets[i].Y -= bullets[i].Speed;
                if (bullets[i].Y < 0) bullets.RemoveAt(i);
            }

            // update enemies (use fractional Y for smoother, adjustable speed)
            for (int i = enemies.Count - 1; i >= 0; i--)
            {
                enemies[i].Yd += enemySpeed * mode.EnemySpeedMultiplier;
                int ey = (int)Math.Round(enemies[i].Yd);
                // collision with player row
                if (ey >= Height - 1)
                {
                    enemies.RemoveAt(i);
                    playerState.LoseLife();
                    if (playerState.IsDead) GameOver();
                }
            }

            // bullet-enemy collisions
            for (int b = bullets.Count - 1; b >= 0; b--)
            {
                bool removedBullet = false;
                for (int e = enemies.Count - 1; e >= 0; e--)
                {
                    int ey = (int)Math.Round(enemies[e].Yd);
                    if (bullets[b].X == enemies[e].X && bullets[b].Y == ey)
                    {
                        bullets.RemoveAt(b);
                        // record popup at enemy location
                        int popupY = (int)Math.Round(enemies[e].Yd);
                        popups.Add(new Popup { X = enemies[e].X, Y = popupY, Text = "+10", RemainingMs = 600 });
                        enemies.RemoveAt(e);
                        state.AddScore(mode.ScorePerEnemy);
                        removedBullet = true;
                        break;
                    }
                }
                if (removedBullet) break;
            }

            // update popups
            for (int i = popups.Count - 1; i >= 0; i--)
            {
                popups[i].RemainingMs -= (int)deltaMs;
                if (popups[i].RemainingMs <= 0) popups.RemoveAt(i);
            }
        }

        void SpawnEnemy()
        {
            int x = rnd.Next(0, Width);
            enemies.Add(new Enemy { X = x, Yd = 0.0 });
        }

        void Render()
        {
            // clear buffer
            for (int y = 0; y < Height; y++)
                for (int x = 0; x < Width; x++)
                    buffer[y, x] = ' ';

            // draw player
            buffer[Height - 1, playerX] = 'A';

            // draw bullets
            foreach (var b in bullets)
            {
                if (b.Y >= 0 && b.Y < Height && b.X >= 0 && b.X < Width)
                    buffer[b.Y, b.X] = b.Glyph;
            }

            // draw enemies (use rounded Yd)
            foreach (var e in enemies)
            {
                int ey = (int)Math.Round(e.Yd);
                if (ey >= 0 && ey < Height && e.X >= 0 && e.X < Width)
                    buffer[ey, e.X] = 'V';
            }

            // popups will be drawn as colored explosions after the buffer is written

            // write buffer to console
            for (int y = 0; y < Height; y++)
            {
                Console.SetCursorPosition(1, 1 + y);
                for (int x = 0; x < Width; x++)
                    Console.Write(buffer[y, x]);
            }

            // HUD
            Console.SetCursorPosition(0, Height + 2);
            Console.Write(new string(' ', Console.WindowWidth));
            Console.SetCursorPosition(0, Height + 2);
            Console.Write($"Score: {state.Score}   Lives: {playerState.Lives}   (Move: ←/→ or A/D, Fire: Space, Quit: Esc)");

            // draw popups as star-shaped explosions on top of buffer/HUD
            var prevColor = Console.ForegroundColor;
            foreach (var p in popups)
            {
                if (p.Y >= 0 && p.Y < Height && p.X >= 0 && p.X < Width)
                {
                    try
                    {
                        Console.ForegroundColor = ConsoleColor.Yellow;
                        // fresh popup: draw a larger star (longer tips)
                        if (p.RemainingMs > 300)
                        {
                            // coordinates for longer star tips
                            (int dx, int dy)[] coords = new (int, int)[]
                            {
                                (0,0), (0,-2), (0,2), (-2,0), (2,0),
                                (-1,-1), (1,-1), (-1,1), (1,1)
                            };
                            foreach (var c in coords)
                            {
                                int tx = p.X + c.dx;
                                int ty = p.Y + c.dy;
                                if (tx >= 0 && tx < Width && ty >= 0 && ty < Height)
                                {
                                    Console.SetCursorPosition(1 + tx, 1 + ty);
                                    Console.Write('*');
                                }
                            }
                        }
                        else
                        {
                            // fading popup: small star (center + 4 directions)
                            (int dx, int dy)[] coords = new (int, int)[]
                            {
                                (0,0), (0,-1), (0,1), (-1,0), (1,0)
                            };
                            foreach (var c in coords)
                            {
                                int tx = p.X + c.dx;
                                int ty = p.Y + c.dy;
                                if (tx >= 0 && tx < Width && ty >= 0 && ty < Height)
                                {
                                    Console.SetCursorPosition(1 + tx, 1 + ty);
                                    Console.Write('*');
                                }
                            }
                        }
                    }
                    catch { }
                }
            }
            Console.ForegroundColor = prevColor;
        }

        void GameOver()
        {
            running = false;
            Console.SetCursorPosition(Width / 2 - 5, Height / 2);
            Console.Write("GAME OVER");
            Console.SetCursorPosition(Width / 2 - 8, Height / 2 + 1);
            Console.Write($"Final Score: {state.Score}");
        }
    }

    class Bullet { public int X; public int Y; public int Speed = 1; public char Glyph = '|'; }
    class Enemy { public int X; public double Yd; }
    class Popup { public int X; public int Y; public string Text = string.Empty; public int RemainingMs; }
}