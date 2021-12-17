CREATE TABLE job_position_quiz
(
    id              BIGINT PRIMARY KEY,
    job_position_id BIGINT NOT NULL,
    quiz_id         BIGINT NOT NULL,

    UNIQUE unique_position_quiz (job_position_id, quiz_id),

    CONSTRAINT position_quiz_position_fk
        FOREIGN KEY (job_position_id) REFERENCES job_position (id),

    CONSTRAINT position_quiz_quiz_fk
        FOREIGN KEY (quiz_id) REFERENCES quiz (id)

) ENGINE = InnoDB;
