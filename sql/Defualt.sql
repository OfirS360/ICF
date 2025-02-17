CREATE SCHEMA IF NOT EXISTS `ICF`;

USE `ICF`;
CREATE TABLE IF NOT EXISTS `Users` (
    `Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Name` VARCHAR(20),
    `Password` VARCHAR(255) NOT NULL,
    `Rank` INT NOT NULL,
    `Age` INT NOT NULL,
    `Role` VARCHAR(50) NOT NULL,
    `Position` VARCHAR(50) NOT NULL,
    `Status` BOOLEAN NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `RegisterForms` (
	`Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `FullName` VARCHAR(50) NOT NULL,
    `Age` INT NOT NULL,
    `ArmaExperience` BOOL NOT NULL,
    `PreviousClans` VARCHAR(255) NULL,
    `ClanIssues` VARCHAR(255) NULL,
    `JoinReason` VARCHAR(255) NOT NULL,
    `MilitaryExperience` BOOL NOT NULL,
    `WeeklyHours` VARCHAR(255) NOT NULL,
    `FridayAvilable` BOOL NOT NULL,
    `Avilavility` BOOL NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;