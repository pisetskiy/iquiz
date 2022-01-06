package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.Question;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findAllByQuizId(Long quizId);

    @Query(value = "select distinct q " +
            "from Question q " +
            "join fetch q.quiz " +
            "join fetch q.variants " +
            "where q.quiz.id = :quizId")
    List<Question> findAllByQuizIdWithVariants(Long quizId);
}
