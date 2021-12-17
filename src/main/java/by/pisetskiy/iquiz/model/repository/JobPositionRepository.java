package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.JobPosition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobPositionRepository extends JpaRepository<JobPosition, Long> {
}
