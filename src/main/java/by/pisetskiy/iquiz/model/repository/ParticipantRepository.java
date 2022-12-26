package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
}
