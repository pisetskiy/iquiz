package by.pisetskiy.iquiz.service;

import static by.pisetskiy.iquiz.util.IQuizUtil.map;
import static by.pisetskiy.iquiz.util.IQuizUtil.mapper;

import by.pisetskiy.iquiz.api.request.QuizRequest;
import by.pisetskiy.iquiz.model.entity.Question;
import by.pisetskiy.iquiz.model.entity.Quiz;
import by.pisetskiy.iquiz.model.repository.QuizRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuizService implements BaseService<Quiz, QuizRequest> {

    private final QuizRepository repository;

    @Override
    public List<Quiz> findAll() {
        return repository.findAll();
    }

    @Override
    public Quiz findById(Long id) {
        var quiz = repository.getById(id);
        quiz.getQuestions();
        return quiz;
    }

    @Override
    public Quiz create(QuizRequest request) {
        var quiz = Quiz.builder()
                .title(request.getTitle())
                .timeLimit(request.getTimeLimit())
                .questions(map(request.getQuestions(), mapper(Question::new)))
                .build();
        return repository.save(quiz);
    }

    @Override
    public Quiz update(Long id, QuizRequest request) {
        var quiz = repository.getById(id);
        quiz.setTitle(request.getTitle());
        quiz.setTimeLimit(request.getTimeLimit());
        quiz.setQuestions(map(request.getQuestions(), mapper(Question::new)));
        return repository.save(quiz);
    }
}
