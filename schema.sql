CREATE TABLE `api_auth` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `api_token` VARCHAR(100) NOT NULL,
 `date_added` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 `date_modified` TIMESTAMP DEFAULT 0 NOT NULL,
   PRIMARY KEY (`id`));

CREATE TABLE `admin` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) DEFAULT NULL,
    `email` VARCHAR(100) NOT NULL,
    `mobile` VARCHAR(100) NOT NULL,
    `profile_url` VARCHAR(200) DEFAULT NULL,
    `password` VARCHAR(100) NOT NULL,
    `auth_token` VARCHAR(100) NOT NULL,
    `date_added` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `date_modified` TIMESTAMP DEFAULT 0 NOT NULL,
     PRIMARY KEY (`id`),
     UNIQUE INDEX `email_UNIQUE` (`email` ASC));

   CREATE TABLE `users` (
       `id` INT NOT NULL AUTO_INCREMENT,
       `first_name` VARCHAR(100) NOT NULL,
       `last_name` VARCHAR(100) DEFAULT NULL,
       `email` VARCHAR(100) NOT NULL,
       `active` BOOLEAN NOT NULL DEFAULT 1,
       `mobile` VARCHAR(100) NOT NULL,
       `created_by` enum('admin','user') default NULL,
       `profile_url` VARCHAR(200) DEFAULT NULL,
       `password` VARCHAR(100) NOT NULL,
       `auth_token` VARCHAR(100) NOT NULL,
       `date_added` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       `date_modified` TIMESTAMP DEFAULT 0 NOT NULL,
        PRIMARY KEY (`id`),
        UNIQUE INDEX `email_UNIQUE` (`email` ASC));


  CREATE TABLE `products` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `admin_id` INT NOT NULL,
    `product_name` VARCHAR(200) NOT NULL,
    `product_sku` VARCHAR(100) NOT NULL,
    `product_slug` VARCHAR(200) NOT NULL,
    `product_image` VARCHAR(300) DEFAULT NULL,
    `product_desc` VARCHAR(1000) DEFAULT NULL,
    `product_price` DECIMAL(8, 2) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT 1,
    `product_stock` VARCHAR(100) NOT NULL,
    `meal_type` ENUM('starter', 'main_course', 'dessert') DEFAULT 'starter',
    `meal_serving_type` ENUM('breakfast', 'lunch', 'dinner') DEFAULT 'breakfast',
    `date_added` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `date_modified` TIMESTAMP DEFAULT 0 NOT NULL,
     PRIMARY KEY (`id`),
     FOREIGN KEY (`admin_id`) REFERENCES admin(id));


     CREATE TABLE `orders` (
       `id` INT NOT NULL AUTO_INCREMENT,
       `user_id` INT NOT NULL,
       `product_id` INT NOT NUll,
       `price` INT NOT NULL,
       `quantity` INT DEFAULT NULL,
       `status` ENUM('pending', 'cancelled', 'rejected','completed') DEFAULT 'pending',
       `date_added` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       `date_modified` TIMESTAMP DEFAULT 0 NOT NULL,
        PRIMARY KEY (`id`),
        FOREIGN KEY (`user_id`) REFERENCES users(id),
        FOREIGN KEY (`product_id`) REFERENCES products(id));
