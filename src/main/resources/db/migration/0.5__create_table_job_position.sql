CREATE TABLE job_position
(
    id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,

    UNIQUE unique_title (title)

) ENGINE = InnoDB;
