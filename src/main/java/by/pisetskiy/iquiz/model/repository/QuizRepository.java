package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
}
