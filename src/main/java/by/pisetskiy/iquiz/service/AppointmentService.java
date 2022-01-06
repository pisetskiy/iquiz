package by.pisetskiy.iquiz.service;

import by.pisetskiy.iquiz.api.request.AnswerRequest;
import by.pisetskiy.iquiz.api.request.AppointmentRequest;
import by.pisetskiy.iquiz.model.entity.*;
import by.pisetskiy.iquiz.model.repository.AnswerRepository;
import by.pisetskiy.iquiz.model.repository.AppointmentRepository;
import by.pisetskiy.iquiz.model.repository.QuestionRepository;
import by.pisetskiy.iquiz.model.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static by.pisetskiy.iquiz.model.entity.AppointmentState.*;
import static by.pisetskiy.iquiz.util.IQuizUtil.*;
import static by.pisetskiy.iquiz.util.Security.getUser;

@Service
@RequiredArgsConstructor
public class AppointmentService implements BaseService<Appointment, AppointmentRequest> {

    private final AnswerRepository answerRepository;
    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;
    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;


    @Override
    public List<Appointment> findAll() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> findByEmployeeId(Long employeeId) {
        return appointmentRepository.findAllByEmployeeId(employeeId);
    }

    @Override
    public Appointment findById(Long id) {
        var appointment = appointmentRepository.getById(id);
        appointment.getQuiz();
        appointment.getEmployee();
        return appointment;
    }

    @Override
    public Appointment create(AppointmentRequest request) {
        var quiz = quizRepository.getById(request.getQuiz());
        if (quiz.getQuestionsCount() < 1) throw new IllegalArgumentException("Quiz has no questions");
        var appointment = Appointment.builder()
                .employee(mapper(Employee::new).apply(request.getEmployee()))
                .quiz(quiz)
                .state(CREATED)
                .deadline(toDate(request.getDeadline()))
                .build();
        appointment = appointmentRepository.save(appointment);
        emailService.sendAppointmentCreatedEmail(appointment);
        return appointment;
    }

    @Override
    public Appointment update(Long id, AppointmentRequest request) {
        var appointment = appointmentRepository.getById(id);
        if (appointment.getState() != CREATED) {
            appointment.setEmployee(mapper(Employee::new).apply(request.getEmployee()));
            appointment.setQuiz(mapper(Quiz::new).apply(request.getQuiz()));
            appointment.setDeadline(toDate(request.getDeadline()));
            appointment = appointmentRepository.save(appointment);
        }

        return appointment;
    }

    public Appointment start(Long id) {
        var appointment = appointmentRepository.getById(id);

        if (!appointment.getEmployee().equals(getUser().getEmployee()))
            throw new IllegalArgumentException("Appointment can't be started");
        if (appointment.isExpired())
            throw new IllegalArgumentException("Appointment can't be started");
        if (!List.of(CREATED, STARTED).contains(appointment.getState()))
            throw new IllegalArgumentException("Appointment can't be started");

        if (appointment.getState() == CREATED) {
            appointment.setState(AppointmentState.STARTED);
            appointment.setStartDate(LocalDateTime.now());
            appointment = appointmentRepository.save(appointment);
        }

        return appointment;
    }

    public Appointment stop(Long id) {
        var appointment = appointmentRepository.getById(id);

        if (!appointment.getEmployee().equals(getUser().getEmployee()))
            throw new IllegalArgumentException("Appointment can't be started");
        if (!List.of(STARTED, PASSED).contains(appointment.getState()))
            throw new IllegalArgumentException("Appointment can't be started");

        if (appointment.getState() == STARTED) {
            appointment.setState(PASSED);
            appointment.setEndDate(LocalDateTime.now());
            appointment = appointmentRepository.save(appointment);
        }

        return appointment;
    }

    public List<Answer> findAllAnswers(Appointment appointment) {
        return answerRepository.findAllByAppointment(appointment);
    }

    public Answer answer(Long id, AnswerRequest request) {
        var appointment = appointmentRepository.getById(id);

        if (!appointment.getEmployee().equals(getUser().getEmployee()))
            throw new IllegalArgumentException("Can't create answer");
        if (!appointment.isInProcess())
            throw new IllegalArgumentException("Can't create answer");

        var questions = questionRepository.findAllByQuizIdWithVariants(appointment.getQuiz().getId());
        var question = find(questions, request.getQuestion());

        if (question == null)
            throw new IllegalArgumentException("Can't create answer");

        var variants = find(question.getVariants(), request.getVariants());
        if (variants.isEmpty() || variants.size() != request.getVariants().size())
            throw new IllegalArgumentException("Can't create answer");

        var answer = Answer.builder()
                .appointment(appointment)
                .question(question)
                .variants(new HashSet<>(variants))
                .isTrue(checkAnswerCorrect(question, variants))
                .build();

        return answerRepository.save(answer);
    }

    private boolean checkAnswerCorrect(Question question, Collection<Variant> variants) {
        var correctVariants = question.getVariants()
                .stream()
                .filter(v -> Boolean.TRUE.equals(v.getIsTrue()))
                .collect(Collectors.toSet());
        var actualVariants = new HashSet<>(variants);

        return Objects.equals(correctVariants, actualVariants);
    }
}
