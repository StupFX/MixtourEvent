DROP DATABASE IF EXISTS MixtourDB;
CREATE DATABASE MixtourDB;
DROP TABLE Players;

use MixtourDB





CREATE TABLE if not exists tblPlayers (
	playerId integer primary key auto_increment,
    username VARCHAR(32) unique,
    password VARCHAR(32) NOT NULL,
    mail VARCHAR(100) NOT NULL
)engine=innodb;

CREATE TABLE Profil (
	idProfil integer auto_increment
    username VARCHAR(32) NOT NULL,
    firstname VARCHAR(32) NOT NULL,
    lastname VARCHAR(32) NOT NULL,
    age INT(3) NOT NULL,
    address VARCHAR(80) NOT NULL,
    postcode CHAR(5) NOT NULL,
    city VARCHAR(30) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    PRIMARY KEY (idProfil),
    CONSTRAINT fk1_Player_nickname
        FOREIGN KEY (nickname)
        REFERENCES Player(nickname)
);

CREATE TABLE Score (
    username VARCHAR(32) NOT NULL,
    score INT(5),
    PRIMARY KEY (nickname),
    CONSTRAINT fk2_Player_nickname
        FOREIGN KEY (nickname)
        REFERENCES Player(nickname)
);




drop database if exists dbUsers;

create database if not exists dbUsers;

use dbUsers;

drop table if exists tblUsers;

create table if not exists tblUsers(
   userId integer primary key auto_increment,
   username varchar(100) unique,
   password varchar(100)
)engine=innodb;