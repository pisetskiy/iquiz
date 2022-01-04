package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.JobPosition;
import by.pisetskiy.iquiz.model.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findAllByPositionsContains(JobPosition position);
}
