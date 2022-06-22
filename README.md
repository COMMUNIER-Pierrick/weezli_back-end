# WEEZLI

## Installation et configuration

faire un ```npm install``` dans le dossier ```api```
- run ```npx sequelize init:config```
- edit ```config.json```
- run ```npx sequelize db:create``` to create database with the ```config.json```

Création des tables:
- dans ```api``` lancer ```npx sequelize db:migrate```
- Si après le migrate il faut modifier, supprimer des columns, il faut d'abord supprimer l'ancien migrate: ```npx sequelize db:migrate:undo``` ou ```npx sequelize db:migrate:undo:all```

## Description

Weezli est une application mettant en relation une personne **A** qui prend un vol et veut vendre *x poids* de son 
bagage et une personne **B** qui veut acheter *x poids* de bagage de **A**.
L'application organise aussi la remise du colis par **A** à la personne **C** à qui le colis est destiné.

## Architecture

Le projet est organisé en 2 parties, il y a une API REST réalisée avec **NodeJS** et utilisant une base de donnée 
**MySQL**. Et il y a un frontend réalisé avec **Flutter** qui est permet de créer une application native (mobile, web, 
desktop).

Ajouter dans api un fichier .env :

DB_HOST=<br>
DB_PORT=<br>
DB_USER=<br>
DB_PASSWORD=<br>
DB_NAME=<br>
TOKEN_SECRET=<br>
REFRESH_TOKEN_SECRET=<br>
FRONT_URL=<br>
BACK_URL=

## FIGMAS
https://www.figma.com/file/1oZC4cIhixK6XxEWYEKrEz/weezly

## STRIPE SAVE CARD 
https://stripe.com/docs/payments/save-during-payment
https://stripe.com/docs/payments/sepa-debit/set-up-payment

## SOCKET FRONT
https://pub.dev/packages/socket_io_client
