using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace MyApp
{
    class PlayerController
    {
        public int X { get; private set; }
        int Width;

        int MissilesPerShot = 3;
        int FireCooldownMs = 100;
        long fireTimer = 0;
        int MissileSpeed = 2;
        char MissileGlyph = '!';

        public PlayerController(int width, int startX)
        {
            Width = width;
            X = startX;
        }

        [DllImport("user32.dll")]
        static extern short GetAsyncKeyState(int vKey);

        const int VK_LEFT = 0x25;
        const int VK_RIGHT = 0x27;
        const int VK_A = 0x41;
        const int VK_D = 0x44;
        const int VK_SPACE = 0x20;

        bool IsKeyDown(int vk) => (GetAsyncKeyState(vk) & 0x8000) != 0;

        public void UpdateMovement()
        {
            if (IsKeyDown(VK_LEFT) || IsKeyDown(VK_A))
            {
                X = Math.Max(0, X - 1);
            }
            else if (IsKeyDown(VK_RIGHT) || IsKeyDown(VK_D))
            {
                X = Math.Min(Width - 1, X + 1);
            }
        }

        public List<Bullet> TryAutoFire(long deltaMs, int height)
        {
            var list = new List<Bullet>();
            fireTimer += deltaMs;
            if (IsKeyDown(VK_SPACE))
            {
                if (fireTimer >= FireCooldownMs)
                {
                    int center = X;
                    int[] offsets;
                    if (MissilesPerShot == 3) offsets = new int[] { -1, 0, 1 };
                    else if (MissilesPerShot == 2) offsets = new int[] { 0, 1 };
                    else
                    {
                        offsets = new int[MissilesPerShot];
                        int mid = MissilesPerShot / 2;
                        for (int i = 0; i < MissilesPerShot; i++) offsets[i] = i - mid;
                    }

                    foreach (var off in offsets)
                    {
                        int px = Math.Clamp(center + off, 0, Width - 1);
                        list.Add(new Bullet { X = px, Y = height - 2, Speed = MissileSpeed, Glyph = MissileGlyph });
                    }
                    fireTimer = 0;
                }
            }
            return list;
        }
    }
}
