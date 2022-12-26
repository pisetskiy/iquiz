CREATE TABLE quiz
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    title       VARCHAR(256) NOT NULL,
    description VARCHAR(512),
    banner_file VARCHAR(512),
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    is_public   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP,

    UNIQUE quiz_title (title),
    CONSTRAINT quiz_user_fk
        FOREIGN KEY (user_id) REFERENCES user (id)

) ENGINE = InnoDB;
