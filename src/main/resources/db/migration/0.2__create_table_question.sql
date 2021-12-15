CREATE TABLE question
(
    id      BIGINT PRIMARY KEY,
    content VARCHAR(512) NOT NULL,
    type    VARCHAR(16)  NOT NULL
) ENGINE = InnoDB;
