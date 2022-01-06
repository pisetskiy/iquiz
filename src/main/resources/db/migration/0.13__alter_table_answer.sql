ALTER TABLE answer
    ADD UNIQUE answer_unique(appointment_id, question_id);