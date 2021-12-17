CREATE TABLE answer_variant
(
    id         BIGINT PRIMARY KEY,
    answer_id  BIGINT NOT NULL,
    variant_id BIGINT NOT NULL,

    CONSTRAINT answer_variant_answer_fk
        FOREIGN KEY (answer_id) REFERENCES answer (id),

    CONSTRAINT answer_variant_variant_fk
        FOREIGN KEY (variant_id) REFERENCES variant (id)

) ENGINE = InnoDB;
