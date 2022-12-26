CREATE TABLE user
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(128) NOT NULL,
    email      VARCHAR(128) NOT NULL,
    password   VARCHAR(256) NOT NULL,
    role       VARCHAR(32)  NOT NULL,
    is_active  BOOLEAN      NOT NULL,
    last_login TIMESTAMP,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,


    UNIQUE user_username (username),
    UNIQUE user_email (email)


) ENGINE = InnoDB;

INSERT INTO user(id, username, email, password, role, is_active)
VALUES (1000, 'ADMIN USER', 'admin@gmail.com', '{noop}SUPER_PASSWORD', 'ADMIN', TRUE);
