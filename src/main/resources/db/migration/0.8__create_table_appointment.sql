CREATE TABLE appointment
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT       NOT NULL,
    quiz_id     BIGINT       NOT NULL,
    state       VARCHAR(16)  NOT NULL,
    deadline    TIMESTAMP(3) NOT NULL,
    start_date  TIMESTAMP(3),
    end_date    TIMESTAMP(3),

    CONSTRAINT appointment_employee_fk
        FOREIGN KEY (employee_id) REFERENCES employee (id),

    CONSTRAINT appointment_quiz_fk
        FOREIGN KEY (quiz_id) REFERENCES quiz (id)

) ENGINE = InnoDB;
