CREATE TABLE job_position
(
    id   BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,

    UNIQUE unique_name (name)

) ENGINE = InnoDB;
