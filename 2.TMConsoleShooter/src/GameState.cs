using System;

namespace MyApp
{
    // Simple game state holder for score and lives
    public class GameState
    {
        public int Score { get; private set; }
        public int Lives { get; private set; }

        public GameState(int startingLives = 3)
        {
            Lives = startingLives;
            Score = 0;
        }

        public void AddScore(int amount)
        {
            if (amount <= 0) return;
            Score += amount;
        }

        public void LoseLife()
        {
            if (Lives > 0) Lives -= 1;
        }

        public void AddLife()
        {
            Lives += 1;
        }

        public bool IsGameOver => Lives <= 0;
    }
}
