CREATE TABLE favorites
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT       NOT NULL,
    quiz_id    BIGINT       NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    UNIQUE favorites_user_quiz (user_id, quiz_id),

    CONSTRAINT favorites_user_fk
        FOREIGN KEY (user_id) REFERENCES user (id),
    CONSTRAINT favorites_quiz_fk
        FOREIGN KEY (quiz_id) REFERENCES quiz (id)

) ENGINE = InnoDB;
