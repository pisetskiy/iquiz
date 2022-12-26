package by.pisetskiy.iquiz.api.controller;

import static by.pisetskiy.iquiz.api.RestEndpoints.*;
import static by.pisetskiy.iquiz.util.IQuizUtil.map;

import by.pisetskiy.iquiz.api.dto.QuizDto;
import by.pisetskiy.iquiz.api.mapper.QuizMapper;
import by.pisetskiy.iquiz.api.request.QuizRequest;
import by.pisetskiy.iquiz.api.security.HasRoleAdmin;
import by.pisetskiy.iquiz.model.entity.Quiz;
import by.pisetskiy.iquiz.service.QuizService;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(API_PREFIX + QUIZZES)
@RequiredArgsConstructor
public class QuizController implements BaseController<QuizDto, QuizRequest> {

    private final QuizService service;
    private final QuizMapper mapper;

    @Override
    public List<QuizDto> findAll(Map<String,String> params) {
        var quizzes = service.findAll(params);
        return map(quizzes, mapper::toListDto);
    }

    @Override
    public QuizDto findById(Long id) {
        return mapper.toDetailDto(service.findById(id));
    }

    @Override
    public QuizDto create(QuizRequest request) {
        Quiz quiz = service.create(request);
        return mapper.toDetailDto(service.findById(quiz.getId()));
    }

    @Override
    public QuizDto update(Long id, QuizRequest request) {
        service.update(id, request);
        return mapper.toDetailDto(service.findById(id));
    }

    @PostMapping(ID + FAVORITES)
    public QuizDto toFavorites(@PathVariable Long id) {
        service.toFavorites(id);
        return mapper.toDetailDto(service.findById(id));
    }

    @DeleteMapping(ID + FAVORITES)
    public QuizDto fromFavorites(@PathVariable Long id) {
        service.fromFavorites(id);
        return mapper.toDetailDto(service.findById(id));
    }
}
