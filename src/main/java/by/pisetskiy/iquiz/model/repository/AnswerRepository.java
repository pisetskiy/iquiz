package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.Answer;
import by.pisetskiy.iquiz.model.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    @Query(value = "select a " +
            "from Answer a " +
            "join fetch a.game " +
            "join fetch a.question " +
            "join fetch a.participant " +
            "join fetch a.variant " +
            "where a.game = :game")
    List<Answer> findAllByGame(Game game);
}
