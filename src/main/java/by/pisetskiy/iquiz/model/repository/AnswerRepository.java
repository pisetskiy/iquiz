package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.Answer;
import by.pisetskiy.iquiz.model.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findAllByAppointment(Appointment appointment);
}
