package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}
