package by.pisetskiy.iquiz.api.controller;

import by.pisetskiy.iquiz.api.dto.AnswerDto;
import by.pisetskiy.iquiz.api.dto.AppointmentDto;
import by.pisetskiy.iquiz.api.mapper.AppointmentMapper;
import by.pisetskiy.iquiz.api.mapper.QuestionMapper;
import by.pisetskiy.iquiz.api.request.AnswerRequest;
import by.pisetskiy.iquiz.service.AppointmentService;
import java.util.List;

import by.pisetskiy.iquiz.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import static by.pisetskiy.iquiz.api.RestEndpoints.*;
import static by.pisetskiy.iquiz.util.IQuizUtil.map;
import static by.pisetskiy.iquiz.util.Security.getUser;

@RestController
@RequestMapping(API_PREFIX + USER + APPOINTMENTS)
@RequiredArgsConstructor
public class UserAppointmentsController {

    private final AppointmentService service;
    private final AppointmentMapper mapper;

    private final QuestionService questionService;
    private final QuestionMapper questionMapper;

    @GetMapping
    public List<AppointmentDto> getAppointments() {
        var appointments = service.findByEmployeeId(getUser().getEmployee().getId());
        return map(appointments, mapper::toListDto);
    }

    @GetMapping(ID)
    public AppointmentDto getAppointment(@PathVariable Long id) {
        var appointment = service.findById(id);
        if (!appointment.getEmployee().equals(getUser().getEmployee())) throw new IllegalArgumentException();

        var dto = mapper.toDetailDto(appointment);

        var questions = questionService.findAllForAppointment(appointment);
        dto.setQuestions(map(questions, questionMapper::toDetailDto));
        dto.getQuestions().forEach(q -> q.getVariants().forEach(v -> v.setIsTrue(null)));

        var answers = service.findAllAnswers(appointment);
        dto.setAnswers(map(answers, mapper::answer));

        return dto;
    }

    @PostMapping(ID + "/start")
    public AppointmentDto start(@PathVariable Long id) {
        service.start(id);
        return getAppointment(id);
    }

    @PostMapping(ID + "/stop")
    public AppointmentDto stop(@PathVariable Long id) {
        service.stop(id);
        return getAppointment(id);
    }

    @PostMapping(ID + ANSWERS)
    public AnswerDto answer(@PathVariable Long id, @RequestBody AnswerRequest request) {
        var answer = service.answer(id, request);
        return mapper.answer(answer);
    }

}
