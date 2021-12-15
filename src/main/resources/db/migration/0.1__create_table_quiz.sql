CREATE TABLE quiz
(
    id            SERIAL,
    title         VARCHAR(255) NOT NULL,

    created_by    VARCHAR(255) NOT NULL,
    created_date  TIMESTAMP(3) NOT NULL DEFAULT current_timestamp(3),
    modified_by   VARCHAR(255),
    modified_date TIMESTAMP(3),

    UNIQUE unique_title (title)

) ENGINE = InnoDB;

INSERT INTO quiz(title, created_by) VALUES('INITIAL QUIZ INSTANCE', 'APP');
