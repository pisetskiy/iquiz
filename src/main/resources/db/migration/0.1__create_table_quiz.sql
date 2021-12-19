CREATE TABLE quiz
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    time_limit SMALLINT     NOT NULL,

    UNIQUE unique_title (title)

) ENGINE = InnoDB;
