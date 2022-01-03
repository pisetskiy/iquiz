package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.Question;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findAllByQuizId(Long quizId);
}
