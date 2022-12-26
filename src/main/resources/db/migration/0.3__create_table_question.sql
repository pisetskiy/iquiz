CREATE TABLE question
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id    BIGINT       NOT NULL,
    content    VARCHAR(512) NOT NULL,
    type       VARCHAR(16)  NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT question_quiz_fk
        FOREIGN KEY (quiz_id) REFERENCES quiz (id)

) ENGINE = InnoDB;
