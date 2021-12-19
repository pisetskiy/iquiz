package by.pisetskiy.iquiz.service;

import by.pisetskiy.iquiz.api.request.AppointmentRequest;
import by.pisetskiy.iquiz.model.entity.Appointment;
import by.pisetskiy.iquiz.model.entity.AppointmentState;
import by.pisetskiy.iquiz.model.entity.Employee;
import by.pisetskiy.iquiz.model.entity.Quiz;
import by.pisetskiy.iquiz.model.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static by.pisetskiy.iquiz.util.IQuizUtil.mapper;
import static by.pisetskiy.iquiz.util.IQuizUtil.toDateTime;

@Service
@RequiredArgsConstructor
public class AppointmentService implements BaseService<Appointment, AppointmentRequest> {

    private final AppointmentRepository repository;

    @Override
    public List<Appointment> findAll() {
        return repository.findAll();
    }

    @Override
    public Appointment findById(Long id) {
        return repository.getById(id);
    }

    @Override
    public Appointment create(AppointmentRequest request) {
        var appointment = Appointment.builder()
                .employee(mapper(Employee::new).apply(request.getEmployee()))
                .quiz(mapper(Quiz::new).apply(request.getQuiz()))
                .state(AppointmentState.CREATED)
                .deadline(toDateTime(request.getDeadline()))
                .build();
        return repository.save(appointment);
    }

    @Override
    public Appointment update(Long id, AppointmentRequest request) {
        var appointment = repository.getById(id);
        appointment.setEmployee(mapper(Employee::new).apply(request.getEmployee()));
        appointment.setQuiz(mapper(Quiz::new).apply(request.getQuiz()));
        appointment.setState(AppointmentState.CREATED);
        appointment.setDeadline(toDateTime(request.getDeadline()));

        return repository.save(appointment);
    }
}
