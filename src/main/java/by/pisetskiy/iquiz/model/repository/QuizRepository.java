package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.Quiz;
import by.pisetskiy.iquiz.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    @Query(value = "select distinct q " +
            "from Quiz q " +
            "join fetch q.user " +
            "order by q.id desc")
    List<Quiz> findAllEager();
}
