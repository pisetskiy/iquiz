CREATE TABLE user
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(128) NOT NULL,
    password    VARCHAR(256) NOT NULL,
    role        VARCHAR(32)  NOT NULL,
    employee_id BIGINT       NOT NULL,

    UNIQUE user_username (username),
    UNIQUE user_employee (employee_id),

    CONSTRAINT user_employee_fk
        FOREIGN KEY (employee_id) REFERENCES employee (id)

) ENGINE = InnoDB;

INSERT INTO job_position(id, title)
VALUES (1000, 'Администратор');

INSERT INTO employee(id, job_position_id, first_name, middle_name, last_name, email)
VALUES (1000, 1000, 'Иван', 'Иванович', 'Иванов', 'iiivanov@it.company.com');

INSERT INTO user(id, username, password, role, employee_id)
VALUES (1000, 'iiivanov', '{noop}Adminus-Maximus', 'ADMIN', 1000);
