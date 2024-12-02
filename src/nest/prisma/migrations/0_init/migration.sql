-- CreateTable
CREATE TABLE `Booking` (
    `booking_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pod_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `rating` DECIMAL(2, 1) NULL,
    `comment` VARCHAR(255) NULL,
    `booking_date` DATETIME(0) NOT NULL,
    `booking_status` ENUM('Pending', 'Confirmed', 'Canceled', 'Complete', 'Ongoing', 'Paused') NULL DEFAULT 'Pending',

    INDEX `pod_id`(`pod_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking_Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_id` INTEGER NULL,
    `payment_id` INTEGER NULL,
    `product_id` INTEGER NULL,
    `slot_id` INTEGER NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,

    INDEX `booking_id`(`booking_id`),
    INDEX `payment_id`(`payment_id`),
    INDEX `product_id`(`product_id`),
    INDEX `slot_id`(`slot_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking_Slot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_id` INTEGER NOT NULL,
    `payment_id` INTEGER NOT NULL,
    `slot_id` INTEGER NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('Not Yet', 'Checked In', 'Checked Out', 'Absent', 'Refunded') NULL DEFAULT 'Not Yet',

    INDEX `booking_id`(`booking_id`),
    INDEX `payment_id`(`payment_id`),
    INDEX `slot_id`(`slot_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `notification_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `message` VARCHAR(255) NOT NULL,
    `is_read` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `POD` (
    `pod_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pod_name` VARCHAR(255) NOT NULL,
    `type_id` INTEGER NULL,
    `description` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `is_available` BOOLEAN NULL DEFAULT true,
    `store_id` INTEGER NULL,

    INDEX `store_id`(`store_id`),
    INDEX `type_id`(`type_id`),
    PRIMARY KEY (`pod_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `POD_Type` (
    `type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(255) NOT NULL,
    `capacity` INTEGER NOT NULL,

    UNIQUE INDEX `type_name`(`type_name`),
    PRIMARY KEY (`type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `POD_Utility` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pod_id` INTEGER NULL,
    `utility_id` INTEGER NULL,

    INDEX `pod_id`(`pod_id`),
    INDEX `utility_id`(`utility_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_id` INTEGER NULL,
    `transaction_id` VARCHAR(255) NULL,
    `zp_trans_id` VARCHAR(255) NULL,
    `total_cost` DECIMAL(10, 2) NOT NULL,
    `payment_url` VARCHAR(2048) NULL,
    `payment_date` DATETIME(0) NOT NULL,
    `payment_status` ENUM('Unpaid', 'Paid', 'Failed', 'Refunded') NULL DEFAULT 'Unpaid',
    `payment_for` ENUM('Slot', 'Product') NULL,
    `refunded_date` DATETIME(0) NULL,
    `refunded_amount` DECIMAL(10, 2) NULL DEFAULT 0.00,

    UNIQUE INDEX `transaction_id`(`transaction_id`),
    UNIQUE INDEX `zp_trans_id`(`zp_trans_id`),
    INDEX `booking_id`(`booking_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(255) NOT NULL,
    `category_id` INTEGER NULL,
    `image` VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `store_id` INTEGER NULL,
    `stock` INTEGER NULL,

    INDEX `category_id`(`category_id`),
    INDEX `store_id`(`store_id`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(30) NOT NULL,

    UNIQUE INDEX `role_name`(`role_name`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Slot` (
    `slot_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pod_id` INTEGER NULL,
    `start_time` DATETIME(0) NOT NULL,
    `end_time` DATETIME(0) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `is_available` BOOLEAN NULL DEFAULT true,

    INDEX `pod_id`(`pod_id`),
    PRIMARY KEY (`slot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Store` (
    `store_id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_name` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `hotline` CHAR(10) NOT NULL,
    `image` VARCHAR(255) NULL,

    UNIQUE INDEX `hotline`(`hotline`),
    PRIMARY KEY (`store_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Store_Price` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_hour` INTEGER NOT NULL,
    `end_hour` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `store_id` INTEGER NULL,
    `type_id` INTEGER NULL,
    `days_of_week` SMALLINT NULL,
    `priority` INTEGER NOT NULL,

    INDEX `store_id`(`store_id`),
    INDEX `type_id`(`type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `user_name` VARCHAR(255) NOT NULL,
    `avatar` VARCHAR(255) NULL,
    `role_id` INTEGER NULL,
    `phone_number` CHAR(10) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `role_id`(`role_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Utility` (
    `utility_id` INTEGER NOT NULL AUTO_INCREMENT,
    `utility_name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `utility_name`(`utility_name`),
    PRIMARY KEY (`utility_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`pod_id`) REFERENCES `POD`(`pod_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking_Product` ADD CONSTRAINT `booking_product_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `Booking`(`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking_Product` ADD CONSTRAINT `booking_product_ibfk_2` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking_Product` ADD CONSTRAINT `booking_product_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking_Product` ADD CONSTRAINT `booking_product_ibfk_4` FOREIGN KEY (`slot_id`) REFERENCES `Slot`(`slot_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking_Slot` ADD CONSTRAINT `booking_slot_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `Booking`(`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking_Slot` ADD CONSTRAINT `booking_slot_ibfk_2` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking_Slot` ADD CONSTRAINT `booking_slot_ibfk_3` FOREIGN KEY (`slot_id`) REFERENCES `Slot`(`slot_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `POD` ADD CONSTRAINT `pod_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `POD_Type`(`type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `POD` ADD CONSTRAINT `pod_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `Store`(`store_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `POD_Utility` ADD CONSTRAINT `pod_utility_ibfk_1` FOREIGN KEY (`utility_id`) REFERENCES `Utility`(`utility_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `POD_Utility` ADD CONSTRAINT `pod_utility_ibfk_2` FOREIGN KEY (`pod_id`) REFERENCES `POD`(`pod_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `Booking`(`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `Store`(`store_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `Category`(`category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Slot` ADD CONSTRAINT `slot_ibfk_1` FOREIGN KEY (`pod_id`) REFERENCES `POD`(`pod_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Store_Price` ADD CONSTRAINT `store_price_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `Store`(`store_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Store_Price` ADD CONSTRAINT `store_price_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `POD_Type`(`type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `Role`(`role_id`) ON DELETE SET NULL ON UPDATE CASCADE;

