package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.Favorites;
import by.pisetskiy.iquiz.model.entity.Quiz;
import by.pisetskiy.iquiz.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoritesRepository extends JpaRepository<Favorites, Long> {

    List<Favorites> findAllByUser(User user);

    Favorites getByUserAndQuiz(User user, Quiz quiz);
}
