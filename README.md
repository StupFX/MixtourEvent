# MixtourEvent

Événement autour du game Mixtour

## Commandes utiles
Lancer serveur:  `DEBUG=* npm start`

Accès MySQL `mysql --user=root --password=toto`


## Configurations
À ajouter dans .gitignore: 
```
.gitignore
.idea
node_modules/
```

MySQL:
```
drop database if exists dbUsers;

create database if not exists dbUsers;

use dbUsers;

drop table if exists tblUsers;

create table if not exists tblUsers(
   	userId INT(5) primary key auto_increment,
   	username varchar(100) unique,
   	password varchar(100) NOT NULL,
   	mail VARCHAR(100) NOT NULL,
   	firstname varchar(32) NOT NULL,
	lastname VARCHAR(32) NOT NULL,
    age INT(3) NOT NULL,
    address VARCHAR(80) NOT NULL,
    postcode CHAR(5) NOT NULL,
    city VARCHAR(30) NOT NULL,
    country VARCHAR(30) NOT NULL,
    nbPoint INT(5) DEFAULT 0
)engine=innodb;
```