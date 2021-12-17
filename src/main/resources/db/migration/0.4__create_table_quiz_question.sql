CREATE TABLE quiz_question
(
    id          BIGINT PRIMARY KEY,
    quiz_id     BIGINT NOT NULL,
    question_id BIGINT NOT NULL,

    UNIQUE unique_quiz_question (quiz_id, question_id),

    CONSTRAINT quiz_question_quiz_fk
        FOREIGN KEY (quiz_id) REFERENCES quiz (id),

    CONSTRAINT quiz_question_question_fk
        FOREIGN KEY (question_id) REFERENCES question (id)

) ENGINE = InnoDB;
