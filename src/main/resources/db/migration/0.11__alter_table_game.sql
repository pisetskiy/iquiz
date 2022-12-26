ALTER TABLE game
    ADD code  VARCHAR(64) NOT NULL,
    ADD state VARCHAR(16) NOT NULL;

ALTER TABLE game
    ADD UNIQUE game_code (code);