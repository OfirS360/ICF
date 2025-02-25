CREATE SCHEMA IF NOT EXISTS `ICF`;

USE `ICF`;
CREATE TABLE IF NOT EXISTS `Users` (
    `SteamId` VARCHAR(17) NOT NULL PRIMARY KEY,
    `Name` VARCHAR(20) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,
    `Rank` INT NOT NULL,
    `Age` INT NOT NULL,
    `Role` VARCHAR(50) NOT NULL,
    `Position` VARCHAR(50) NOT NULL,
    `Status` BOOLEAN NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `RegistrationForm` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL,
    `age` INT NOT NULL,
    `arma_experience` VARCHAR(255) NOT NULL,
    `arma_hours` INT NOT NULL,
    `previous_clans` VARCHAR(255),
    `clan_issues` TEXT,
    `join_reason` TEXT NOT NULL,
    `military_experience` TEXT,
    `weekly_hours` VARCHAR(5) NOT NULL,
    `friday_availability` BOOLEAN NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- git add .
-- git commit -m "Trigger deployment"
-- git push origin main
