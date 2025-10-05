using System;

namespace MyApp
{
    // Encapsulates game rules and difficulty settings
    public class GameMode
    {
        public string Name { get; }
        public int SpawnIntervalMs { get; set; } = 1400;
        public double EnemySpeedMultiplier { get; set; } = 1.0;
        public int ScorePerEnemy { get; set; } = 10;

        public GameMode(string name)
        {
            Name = name;
        }

        public static GameMode Easy()
        {
            return new GameMode("Easy")
            {
                SpawnIntervalMs = 2000,
                EnemySpeedMultiplier = 0.6,
                ScorePerEnemy = 5
            };
        }

        public static GameMode Normal()
        {
            return new GameMode("Normal")
            {
                SpawnIntervalMs = 1400,
                EnemySpeedMultiplier = 1.0,
                ScorePerEnemy = 10
            };
        }

        public static GameMode Hard()
        {
            return new GameMode("Hard")
            {
                SpawnIntervalMs = 900,
                EnemySpeedMultiplier = 1.6,
                ScorePerEnemy = 20
            };
        }
    }
}
