using System;

namespace MyApp
{
    // Manages player's personal state (lives, invincibility etc.)
    public class PlayerState
    {
        public int Lives { get; private set; }
        public bool IsInvincible { get; private set; }

        public PlayerState(int startingLives = 3)
        {
            Lives = startingLives;
            IsInvincible = false;
        }

        public void LoseLife()
        {
            if (IsInvincible) return;
            if (Lives > 0) Lives -= 1;
        }

        public void AddLife()
        {
            Lives += 1;
        }

        public void SetInvincible(bool on)
        {
            IsInvincible = on;
        }

        public bool IsDead => Lives <= 0;
    }
}
