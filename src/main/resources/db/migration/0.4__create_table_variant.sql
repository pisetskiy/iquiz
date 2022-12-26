CREATE TABLE variant
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT       NOT NULL,
    content     VARCHAR(128) NOT NULL,
    is_true     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    UNIQUE variant_content (question_id, content),

    CONSTRAINT variant_question_fk
        FOREIGN KEY (question_id) REFERENCES question (id)

) ENGINE = InnoDB;
