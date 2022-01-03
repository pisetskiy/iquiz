package by.pisetskiy.iquiz.api.controller;

import static by.pisetskiy.iquiz.api.RestEndpoints.API_PREFIX;
import static by.pisetskiy.iquiz.api.RestEndpoints.QUESTIONS;
import static by.pisetskiy.iquiz.util.IQuizUtil.map;

import by.pisetskiy.iquiz.api.dto.QuestionDto;
import by.pisetskiy.iquiz.api.mapper.QuestionMapper;
import by.pisetskiy.iquiz.api.request.QuestionRequest;
import by.pisetskiy.iquiz.service.QuestionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PREFIX + QUESTIONS)
@RequiredArgsConstructor
public class QuestionController implements BaseController<QuestionDto, QuestionRequest> {

    private final QuestionService service;
    private final QuestionMapper mapper;

    @Override
    public List<QuestionDto> findAll() {
        return map(service.findAll(), mapper::toListDto);
    }

    @GetMapping()
    public List<QuestionDto> findAll(@RequestParam Long quizId) {
        return map(service.findAll(quizId), mapper::toListDto);
    }

    @Override
    public QuestionDto findById(Long id) {
        return mapper.toDetailDto(service.findById(id));
    }

    @Override
    public QuestionDto create(QuestionRequest request) {
        return mapper.toDetailDto(service.create(request));
    }

    @Override
    public QuestionDto update(Long id, QuestionRequest request) {
        return mapper.toDetailDto(service.update(id, request));
    }
}
