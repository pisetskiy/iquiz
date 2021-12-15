CREATE TABLE variant
(
    id          BIGINT PRIMARY KEY,
    question_id BIGINT      NOT NULL,
    value       VARCHAR(32) NOT NULL,
    is_true     BOOLEAN     NOT NULL,

    UNIQUE unique_variant (question_id, value),

    CONSTRAINT variant_question_fk
        FOREIGN KEY (question_id) REFERENCES question (id)

) ENGINE = InnoDB;
