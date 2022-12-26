CREATE TABLE answer
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    game_id        BIGINT    NOT NULL,
    question_id    BIGINT    NOT NULL,
    participant_id BIGINT    NOT NULL,
    variant_id     BIGINT    NOT NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP,

    UNIQUE answer_game_question_participant (game_id, question_id, participant_id),

    CONSTRAINT answer_game_fk
        FOREIGN KEY (game_id) REFERENCES game (id),
    CONSTRAINT answer_question_fk
        FOREIGN KEY (question_id) REFERENCES question (id),
    CONSTRAINT answer_participant_fk
        FOREIGN KEY (participant_id) REFERENCES participant (id),
    CONSTRAINT answer_variant_fk
        FOREIGN KEY (variant_id) REFERENCES variant (id)

) ENGINE = InnoDB;
