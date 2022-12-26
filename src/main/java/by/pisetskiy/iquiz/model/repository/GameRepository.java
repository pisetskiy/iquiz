package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
    Game getByCode(String code);
}
