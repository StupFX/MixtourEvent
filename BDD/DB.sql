DROP DATABASE IF EXISTS MixtourDB;
CREATE DATABASE MixtourDB;


use MixtourDB;

CREATE TABLE Player (
    nickname VARCHAR(32) NOT NULL,
    password VARCHAR(32) NOT NULL,
    mail VARCHAR(100) NOT NULL,
    PRIMARY KEY(nickname)
);

CREATE TABLE Profil (
    nickname VARCHAR(32) NOT NULL,
    firstname VARCHAR(32) NOT NULL,
    lastname VARCHAR(32) NOT NULL,
    age INT(3) NOT NULL,
    address VARCHAR(80) NOT NULL,
    postcode CHAR(5) NOT NULL,
    city VARCHAR(30) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    PRIMARY KEY (nickname),
    CONSTRAINT fk1_Player_nickname
        FOREIGN KEY (nickname)
        REFERENCES Player(nickname)
);

CREATE TABLE Score (
    nickname VARCHAR(32) NOT NULL,
    score INT(5),
    PRIMARY KEY (nickname),
    CONSTRAINT fk2_Player_nickname
        FOREIGN KEY (nickname)
        REFERENCES Player(nickname)
);