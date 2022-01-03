package by.pisetskiy.iquiz.service;

import static by.pisetskiy.iquiz.util.IQuizUtil.map;
import static by.pisetskiy.iquiz.util.IQuizUtil.mapper;

import by.pisetskiy.iquiz.api.request.QuestionRequest;
import by.pisetskiy.iquiz.api.request.VariantRequest;
import by.pisetskiy.iquiz.model.entity.Question;
import by.pisetskiy.iquiz.model.entity.QuestionType;
import by.pisetskiy.iquiz.model.entity.Quiz;
import by.pisetskiy.iquiz.model.entity.Variant;
import by.pisetskiy.iquiz.model.repository.QuestionRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionService implements BaseService<Question, QuestionRequest> {

    private final QuestionRepository repository;

    @Override
    public List<Question> findAll() {
        return repository.findAll();
    }

    public List<Question> findAll(Long quizId) {
        return repository.findAllByQuizId(quizId);
    }

    @Override
    public Question findById(Long id) {
        var question = repository.getById(id);
        question.getVariants();
        return question;
    }

    @Override
    public Question create(QuestionRequest request) {
        var question = Question.builder()
                .quiz(mapper(Quiz::new).apply(request.getQuizId()))
                .content(request.getContent())
                .type(QuestionType.valueOf(request.getType()))
                .build();
        question.addVariants(map(request.getVariants(), this::variant));

        return repository.save(question);
    }

    @Override
    public Question update(Long id, QuestionRequest request) {
        var question = repository.getById(id);
        question.setContent(request.getContent());
        question.setType(QuestionType.valueOf(request.getType()));
        question.removeVariants(new ArrayList<>(question.getVariants()));
        question.addVariants(map(request.getVariants(), this::variant));
        return repository.save(question);
    }

    private Variant variant(VariantRequest request) {
        return Variant.builder()
                .id(request.getId())
                .value(request.getValue())
                .isTrue(request.getIsTrue())
                .build();
    }
}
