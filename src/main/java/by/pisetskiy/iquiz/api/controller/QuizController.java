package by.pisetskiy.iquiz.api.controller;

import static by.pisetskiy.iquiz.api.RestEndpoints.API_PREFIX;
import static by.pisetskiy.iquiz.api.RestEndpoints.QUIZZES;
import static by.pisetskiy.iquiz.util.IQuizUtil.map;

import by.pisetskiy.iquiz.api.dto.QuizDto;
import by.pisetskiy.iquiz.api.mapper.QuizMapper;
import by.pisetskiy.iquiz.api.request.QuizRequest;
import by.pisetskiy.iquiz.api.security.HasRoleAdmin;
import by.pisetskiy.iquiz.service.QuizService;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PREFIX + QUIZZES)
@RequiredArgsConstructor
@HasRoleAdmin
public class QuizController implements BaseController<QuizDto, QuizRequest> {

    private final QuizService service;
    private final QuizMapper mapper;

    @Override
    public List<QuizDto> findAll(Map<String,String> params) {
        var employeeId = Long.parseLong(params.getOrDefault("employeeId", "-1"));
        var quizzes = employeeId != -1 ? service.findByEmployeeId(employeeId) : service.findAll();
        return map(quizzes, mapper::toListDto);
    }

    @Override
    public QuizDto findById(Long id) {
        return mapper.toDetailDto(service.findById(id));
    }

    @Override
    public QuizDto create(QuizRequest request) {
        return mapper.toDetailDto(service.create(request));
    }

    @Override
    public QuizDto update(Long id, QuizRequest request) {
        return mapper.toDetailDto(service.update(id, request));
    }
}
