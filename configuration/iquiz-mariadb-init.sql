CREATE DATABASE iquiz
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE USER 'iquiz_app_user' IDENTIFIED BY 'iquiz_app_password';
GRANT ALL PRIVILEGES ON *.* TO 'iquiz_app_user'@'%';
FLUSH PRIVILEGES;
