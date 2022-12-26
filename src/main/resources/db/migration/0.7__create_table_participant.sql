CREATE TABLE participant
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    game_id    BIGINT       NOT NULL,
    username   VARCHAR(128) NOT NULL,
    avatar     VARCHAR(512) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    UNIQUE participant_game_username(game_id, username),

    CONSTRAINT participant_game_fk
        FOREIGN KEY (game_id) REFERENCES game (id)

) ENGINE = InnoDB;
