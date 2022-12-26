CREATE TABLE game
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT    NOT NULL,
    quiz_id    BIGINT    NOT NULL,
    settings   LONGTEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT game_user_fk
        FOREIGN KEY (user_id) REFERENCES user (id),
    CONSTRAINT game_quiz_fk
        FOREIGN KEY (quiz_id) REFERENCES quiz (id)

) ENGINE = InnoDB;
