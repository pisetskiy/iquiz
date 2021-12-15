package by.pisetskiy.iquiz.api.controller;

import static by.pisetskiy.iquiz.constants.RestEndpoints.API_PREFIX;
import static by.pisetskiy.iquiz.constants.RestEndpoints.QUIZ;

import by.pisetskiy.iquiz.api.dto.QuizDto;
import by.pisetskiy.iquiz.api.mapper.QuizMapper;
import by.pisetskiy.iquiz.service.QuizService;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PREFIX)
@RequiredArgsConstructor
public class QuizController {

    private final QuizService service;
    private final QuizMapper mapper;

    @GetMapping(QUIZ)
    public List<QuizDto> listQuizes() {
        var quizes = service.getQuizes();
        return quizes.stream().map(mapper::toDto).collect(Collectors.toList());
    }
}
