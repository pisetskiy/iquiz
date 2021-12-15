CREATE TABLE position_quiz
(
    id          BIGINT PRIMARY KEY,
    position_id BIGINT NOT NULL,
    quiz_id     BIGINT NOT NULL,

    UNIQUE unique_position_quiz (position_id, quiz_id),

    CONSTRAINT position_quiz_position_fk
        FOREIGN KEY (position_id) REFERENCES position (id),

    CONSTRAINT position_quiz_quiz_fk
        FOREIGN KEY (quiz_id) REFERENCES quiz (id)

) ENGINE = InnoDB;
