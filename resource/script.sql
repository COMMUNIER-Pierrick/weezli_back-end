CREATE DATABASE `weezli_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `weezli_db`;

CREATE TABLE `users`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,
    `firstname` VARCHAR(150) NOT NULL,
    `lastname` VARCHAR(150) NOT NULL,
    `username` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(250) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `phone` VARCHAR(50) NULL,
    `date_of_birthday` DATETIME NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `url_profile_img` VARCHAR(150) NULL,
    `average_opinion` DOUBLE NOT NULL DEFAULT 0,
    `id_payment` INT NOT NULL,
    `id_choice` INT NOT NULL,
    `id_check` INT NOT NULL,
    `choice_date_started` DATETIME NULL,
    `choice_date_end` DATETIME NULL,
    `id_address` INT NOT NULL
)Engine = InnoDB;

ALTER TABLE `users` ADD UNIQUE (`username`);
ALTER TABLE `users` ADD UNIQUE (`email`);

CREATE TABLE `announce`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `id_package` INT NOT NULL,
    `views` INT NOT NULL DEFAULT 0,
    `id_type` INT NOT NULL,
    `price` DOUBLE NULL,
    `img_url` VARCHAR(255) NULL,
    `date_created` DATETIME DEFAULT CURRENT_TIMESTAMP
)Engine = InnoDB;

CREATE TABLE `types`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL
)Engine = InnoDB;

CREATE TABLE `address`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,
    `id_info` INT NOT NULL,
    `number` INT NULL,
    `street` VARCHAR(250) NULL,
    `additional_address` VARCHAR(250) NULL,
    `zipcode` VARCHAR(50) NULL,
    `city` VARCHAR(100) NOT NULL,
    `country` VARCHAR(100) NOT NULL
)Engine = InnoDB;

CREATE TABLE `info`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50)
)Engine = InnoDB;

CREATE TABLE `rel_package_address`(
    `id_package` INT NOT NULL,
    `id_address` INT NOT NULL
)Engine = InnoDB;

ALTER TABLE `rel_package_address` ADD PRIMARY KEY (`id_package`,`id_address`);

CREATE TABLE `size`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `filename` VARCHAR(250) NULL UNIQUE
)Engine = InnoDB;

CREATE TABLE `proposition`(
    `id_announce` int NOT NULL,
    `id_user` int NOT NULL,
    `proposition` DOUBLE NOT NULL,
    `id_status_proposition` int NOT NULL
)Engine = InnoDB;

ALTER TABLE `proposition` ADD PRIMARY KEY (`id_announce`,`id_user`);

CREATE TABLE `status_proposition`(
    `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL
)Engine = InnoDB;

CREATE TABLE `check_user`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `status_phone` BOOLEAN NOT NULL DEFAULT FALSE,
    `status_mail` BOOLEAN NOT NULL DEFAULT FALSE,
    `status_identity` BOOLEAN NOT NULL DEFAULT FALSE,
    `img_identity` VARCHAR(150) NULL,
    `status` ENUM('Pending', 'Active') NOT NULL DEFAULT 'Pending',
    `confirm_code` VARCHAR(50) NULL UNIQUE
)Engine = InnoDB;

CREATE TABLE `choice`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `price` DOUBLE NULL,
    `id_payment` VARCHAR(255) NULL
)Engine = InnoDB;

CREATE TABLE `payment`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `iban` VARCHAR(255) NULL,
    `number_card` VARCHAR(20) NULL,
    `expired_date_card` DATETIME NULL
)Engine = InnoDB;

CREATE TABLE `package`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `datetime_departure` DATETIME NULL,
    `datetime_arrival` DATETIME NOT NULL,
    `kg_available` DOUBLE NOT NULL,
    `description_condition` TEXT NULL,
    `id_transport` INT NULL
)Engine = InnoDB;

CREATE TABLE `transport`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `filename` VARCHAR(250) NULL UNIQUE
)Engine = InnoDB;

CREATE TABLE `orders`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `code_validated` INT NOT NULL,
    `id_status` INT NOT NULL,
    `id_announce` INT NOT NULL UNIQUE,
    `date_order` DATETIME NOT NULL,
    `qr_code` VARCHAR(250)
)Engine = InnoDB;

CREATE TABLE `status`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL
)Engine = InnoDB;

CREATE TABLE `opinion`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `number` DOUBLE NOT NULL,
    `comment` VARCHAR(255) NULL,
    `id_order` INT NOT NULL
)Engine = InnoDB;

CREATE TABLE `rel_opinion_users`(
    `id_opinion` INT NOT NULL,
    `id_user` INT NOT NULL
)Engine = InnoDB;

ALTER TABLE `rel_opinion_users` ADD PRIMARY KEY (`id_opinion`,`id_user`);

CREATE TABLE `rel_package_sizes`(
    `id_package` INT NOT NULL,
    `id_size` INT NOT NULL
)Engine = InnoDB;

ALTER TABLE `rel_package_sizes` ADD PRIMARY KEY (`id_package`,`id_size`);

CREATE TABLE `messages`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `text` TEXT NOT NULL,
    `date_created` DATETIME NOT NULL,
    `id_author` INT NOT NULL,
    `id_channel` INT NOT NULL
)Engine = InnoDB;

CREATE TABLE `channels`(
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `ids_users` VARCHAR(100) NOT NULL
)Engine = InnoDB;

ALTER TABLE `channels` ADD UNIQUE (`ids_users`);

CREATE TABLE `rel_user_channels`(
    `id_user` int NOT NULL,
    `id_channel` int NOT NULL
)Engine = InnoDB;

ALTER TABLE `rel_user_channels` ADD PRIMARY KEY (`id_user`,`id_channel`);

CREATE TABLE `rel_user_announce`(
    `id_user` int NOT NULL,
    `id_announce` int NOT NULL
)Engine = InnoDB;

ALTER TABLE `rel_user_announce` ADD PRIMARY KEY (`id_user`,`id_announce`);

ALTER TABLE `users` ADD CONSTRAINT `fk_user_payment` FOREIGN KEY (`id_payment`) REFERENCES `payment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `users` ADD CONSTRAINT `fk_user_choice` FOREIGN KEY (`id_choice`) REFERENCES `choice`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `users` ADD CONSTRAINT `fk_user_address` FOREIGN KEY (`id_address`) REFERENCES `address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `users` ADD CONSTRAINT `fk_user_check` FOREIGN KEY (`id_check`) REFERENCES `check_user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION; /* Le on delete no action c'est pour refusé de supprimer le parent donc user*/

ALTER TABLE `announce` ADD CONSTRAINT `fk_announce_id_package` FOREIGN KEY (`id_package`) REFERENCES `package`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `announce` ADD CONSTRAINT `fk_announce_id_type` FOREIGN KEY (`id_type`) REFERENCES `types`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `messages` ADD CONSTRAINT `fk_message_id_author` FOREIGN KEY (`id_author`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `messages` ADD CONSTRAINT `fk_messages_id_channel` FOREIGN KEY (`id_channel`) REFERENCES  `channels`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `opinion` ADD CONSTRAINT `fk_opinion_id_order` FOREIGN KEY (`id_order`) REFERENCES `orders`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `rel_user_channels` ADD CONSTRAINT `fk_rel_user_channels_id_user` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `rel_user_channels` ADD CONSTRAINT `fk_rel_user_channels_id_channel` FOREIGN KEY (`id_channel`) REFERENCES `channels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `rel_opinion_users` ADD CONSTRAINT `fk_rel_opinion_user_id_opinion` FOREIGN KEY (`id_opinion`) REFERENCES `opinion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `rel_opinion_users` ADD CONSTRAINT `fk_rel_opinion_user_id_user` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `rel_package_sizes` ADD CONSTRAINT `fk_rel_sender_size_id_sender` FOREIGN KEY (`id_package`) REFERENCES `package`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `rel_package_sizes` ADD CONSTRAINT `fk_rel_sender_size_id_size` FOREIGN KEY (`id_size`) REFERENCES `size`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `rel_package_address` ADD CONSTRAINT `fk_rel_package_address_id_package` FOREIGN KEY (`id_package`) REFERENCES `package`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `rel_package_address` ADD CONSTRAINT `fk_rel_package_address_id_address` FOREIGN KEY (`id_address`) REFERENCES `address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `address` ADD CONSTRAINT `fk_address_info` FOREIGN KEY (`id_info`) REFERENCES `info`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `package` ADD CONSTRAINT `fk_package_transport` FOREIGN KEY (`id_transport`) REFERENCES `transport`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `orders` ADD CONSTRAINT `fk_orders_id_status` FOREIGN KEY (`id_status`)  REFERENCES `status`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `orders` ADD CONSTRAINT `fk_orders_id_announce` FOREIGN KEY (`id_announce`) REFERENCES `announce`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `rel_user_announce` ADD CONSTRAINT `fk_rel_user_announce_id_announce` FOREIGN KEY (`id_announce`) REFERENCES `announce`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `rel_user_announce` ADD CONSTRAINT `fk_rel_user_announce_id_user` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `proposition` ADD CONSTRAINT `fk_proposition_id_announce` FOREIGN KEY (`id_announce`) REFERENCES `announce`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `proposition` ADD CONSTRAINT `fk_proposition_id_user` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `proposition` ADD CONSTRAINT `fk_status_proposition_id_user` FOREIGN KEY (`id_status_proposition`) REFERENCES `status_proposition`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
