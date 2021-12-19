CREATE TABLE answer
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT  NOT NULL,
    question_id    BIGINT  NOT NULL,
    answer_date    TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
    is_true        BOOLEAN NOT NULL,

    CONSTRAINT answer_appointment_fk
        FOREIGN KEY (appointment_id) REFERENCES appointment (id),

    CONSTRAINT answer_question_fk
        FOREIGN KEY (question_id) REFERENCES question (id)

) ENGINE = InnoDB;
