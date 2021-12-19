CREATE TABLE employee
(
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_position_id BIGINT      NOT NULL,
    first_name      VARCHAR(32) NOT NULL,
    middle_name     VARCHAR(32) NOT NULL,
    last_name       VARCHAR(32) NOT NULL,
    email           varchar(64) NOT NULL,

    UNIQUE employee_email (email),

    CONSTRAINT employee_job_position_fk
        FOREIGN KEY (job_position_id) REFERENCES job_position (id)

) ENGINE = InnoDB;
