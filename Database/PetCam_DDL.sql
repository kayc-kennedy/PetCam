-- MySQL Script generated by MySQL Workbench
-- Tue May 31 00:19:51 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema petcam
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `petcam` ;

-- -----------------------------------------------------
-- Schema petcam
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `petcam` DEFAULT CHARACTER SET utf8 ;
USE `petcam` ;

-- -----------------------------------------------------
-- Table `petcam`.`usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `petcam`.`usuario` ;

CREATE TABLE IF NOT EXISTS `petcam`.`usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nome_usuario` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(100) NOT NULL,
  `data_criacao` DATE NOT NULL DEFAULT (now()),
  `tipo_usuario` CHAR(1) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `id_usuario_UNIQUE` (`id_usuario` ASC) VISIBLE,
  UNIQUE INDEX `nome_usuario_UNIQUE` (`nome_usuario` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `petcam`.`petshop`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `petcam`.`petshop` ;

CREATE TABLE IF NOT EXISTS `petcam`.`petshop` (
  `id_petshop` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `nome` VARCHAR(200) NOT NULL,
  `status` CHAR(1) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id_petshop`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_petshop_Usuario1_idx` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_petshop_Usuario1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `petcam`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `petcam`.`cliente`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `petcam`.`cliente` ;

CREATE TABLE IF NOT EXISTS `petcam`.`cliente` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `id_petshop` INT NOT NULL,
  `nome` VARCHAR(200) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `status` CHAR(1) NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_cliente_Usuario1_idx` (`id_usuario` ASC) VISIBLE,
  INDEX `fk_cliente_petshop1_idx` (`id_petshop` ASC) VISIBLE,
  CONSTRAINT `fk_cliente_Usuario1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `petcam`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_cliente_petshop1`
    FOREIGN KEY (`id_petshop`)
    REFERENCES `petcam`.`petshop` (`id_petshop`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `petcam`.`animal`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `petcam`.`animal` ;

CREATE TABLE IF NOT EXISTS `petcam`.`animal` (
  `id_animal` INT NOT NULL AUTO_INCREMENT,
  `id_cliente` INT NOT NULL,
  `nome` VARCHAR(200) NULL,
  `raca` VARCHAR(45) NOT NULL,
  `cor` VARCHAR(45) NULL,
  `data_nascimento` DATE NULL,
  `sexo` CHAR(1) NOT NULL,
  `status` CHAR(1) NULL,
  PRIMARY KEY (`id_animal`),
  INDEX `fk_animal_cliente1_idx` (`id_cliente` ASC) VISIBLE,
  CONSTRAINT `fk_animal_cliente1`
    FOREIGN KEY (`id_cliente`)
    REFERENCES `petcam`.`cliente` (`id_cliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `petcam`.`camera`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `petcam`.`camera` ;

CREATE TABLE IF NOT EXISTS `petcam`.`camera` (
  `id_camera` INT NOT NULL AUTO_INCREMENT,
  `id_petshop` INT NOT NULL,
  `link_rtsp_gravado` VARCHAR(300) NOT NULL,
  `link_rtsp_aovivo` VARCHAR(300) NOT NULL,
  `status` CHAR(1) NOT NULL,
  `setor` VARCHAR(100) NULL,
  PRIMARY KEY (`id_camera`),
  INDEX `fk_Camera_petshop1_idx` (`id_petshop` ASC) VISIBLE,
  CONSTRAINT `fk_Camera_petshop1`
    FOREIGN KEY (`id_petshop`)
    REFERENCES `petcam`.`petshop` (`id_petshop`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `petcam`.`acesso_camera`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `petcam`.`acesso_camera` ;

CREATE TABLE IF NOT EXISTS `petcam`.`acesso_camera` (
  `id_acesso_camera` INT NOT NULL AUTO_INCREMENT,
  `id_petshop` INT NOT NULL,
  `id_animal` INT NOT NULL,
  `status` CHAR(1) NOT NULL,
  PRIMARY KEY (`id_acesso_camera`),
  INDEX `fk_acesso_camera_petshop1_idx` (`id_petshop` ASC) VISIBLE,
  INDEX `fk_acesso_camera_animal1_idx` (`id_animal` ASC) VISIBLE,
  CONSTRAINT `fk_acesso_camera_petshop1`
    FOREIGN KEY (`id_petshop`)
    REFERENCES `petcam`.`petshop` (`id_petshop`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_acesso_camera_animal1`
    FOREIGN KEY (`id_animal`)
    REFERENCES `petcam`.`animal` (`id_animal`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `petcam`.`gravacao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `petcam`.`gravacao` ;

CREATE TABLE IF NOT EXISTS `petcam`.`gravacao` (
  `id_gravacao` INT NOT NULL AUTO_INCREMENT,
  `id_animal` INT NOT NULL,
  `id_acesso_camera` INT NOT NULL,
  `id_camera` INT NOT NULL,
  `data_hora_inicio` DATE NULL DEFAULT (now()),
  `data_hora_fim` DATE NULL,
  `id_processo` INT(10) NOT NULL,
  `nome_arquivo` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id_gravacao`),
  INDEX `fk_monitoramento_acesso_camera1_idx` (`id_acesso_camera` ASC) VISIBLE,
  INDEX `fk_monitoramento_Camera1_idx` (`id_camera` ASC) VISIBLE,
  INDEX `fk_monitoramento_animal1_idx` (`id_animal` ASC) VISIBLE,
  CONSTRAINT `fk_monitoramento_acesso_camera1`
    FOREIGN KEY (`id_acesso_camera`)
    REFERENCES `petcam`.`acesso_camera` (`id_acesso_camera`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_monitoramento_Camera1`
    FOREIGN KEY (`id_camera`)
    REFERENCES `petcam`.`camera` (`id_camera`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_monitoramento_animal1`
    FOREIGN KEY (`id_animal`)
    REFERENCES `petcam`.`animal` (`id_animal`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET SQL_SAFE_UPDATES = 0;

