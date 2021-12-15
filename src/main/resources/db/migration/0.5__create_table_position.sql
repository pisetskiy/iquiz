CREATE TABLE position
(
    id   BIGINT PRIMARY KEY,
    name VARCHAR(255),

    UNIQUE unique_value (name)

) ENGINE = InnoDB;
