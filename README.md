# Baloogo

## Installation et configuration

faire un ```npm install``` dans le dossier ```api```
- run ```npx sequelize init:config```
- edit ```config.json```
- run ```npx sequelize db:create``` to create database with the ```config.json```

Création des tables:
- dans ```api``` lancer ```npx sequelize db:migrate```
- Si après le migrate il faut modifier, supprimer des columns, il faut d'abord supprimer l'ancien migrate: ```npx sequelize db:migrate:undo``` ou ```npx sequelize db:migrate:undo:all```

## Description

Baloogo est une application mettant en relation une personne **A** qui prend un vol et veut vendre *x poids* de son 
bagage et une personne **B** qui veut acheter *x poids* de bagage de **A**.
L'application organise aussi la remise du colis par **A** à la personne **C** à qui le colis est destiné.

## Architecture

Le projet est organisé en 2 parties, il y a une API REST réalisée avec **NodeJS** et utilisant une base de donnée 
**MySQL**. Et il y a un frontend réalisé avec **Flutter** qui est permet de créer une application native (mobile, web, 
desktop).

Ajouter dans api un fichier .env :

DB_HOST=

DB_PORT=

DB_USER=

DB_PASSWORD=

DB_NAME=

TOKEN_SECRET=

REFRESH_TOKEN_SECRET=

FRONT_URL=

BACK_URL=



## FIGMAS
https://www.figma.com/file/TXyf2UF2fatYPIOdfgVLPW/wizzly?node-id=0%3A1

