CREATE TABLE employee
(
    id          BIGINT PRIMARY KEY,
    position_id BIGINT      NOT NULL,
    first_name  VARCHAR(32) NOT NULL,
    middle_name VARCHAR(32) NOT NULL,
    last_name   VARCHAR(32) NOT NULL,

    CONSTRAINT employee_position_fk
        FOREIGN KEY (position_id) REFERENCES position (id)

) ENGINE = InnoDB;
