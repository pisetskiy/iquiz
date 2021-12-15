CREATE TABLE quiz
(
    id        BIGINT PRIMARY KEY,
    title     VARCHAR(255) NOT NULL,
    is_active BOOLEAN      NOT NULL,

    UNIQUE unique_title (title)

) ENGINE = InnoDB;
