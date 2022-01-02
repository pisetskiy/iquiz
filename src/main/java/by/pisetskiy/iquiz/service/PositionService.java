package by.pisetskiy.iquiz.service;

import static by.pisetskiy.iquiz.util.IQuizUtil.map;
import static by.pisetskiy.iquiz.util.IQuizUtil.mapper;

import by.pisetskiy.iquiz.api.request.PositionRequest;
import by.pisetskiy.iquiz.api.request.QuizRequest;
import by.pisetskiy.iquiz.model.entity.JobPosition;
import by.pisetskiy.iquiz.model.entity.Quiz;
import by.pisetskiy.iquiz.model.repository.JobPositionRepository;
import java.util.List;

import by.pisetskiy.iquiz.model.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PositionService implements BaseService<JobPosition, PositionRequest> {

    private final JobPositionRepository repository;

    private final QuizRepository quizRepository;

    @Override
    public List<JobPosition> findAll() {
        return repository.findAll();
    }

    @Override
    public JobPosition findById(Long id) {
        var position = repository.getById(id);
        position.getQuizzes();
        return position;
    }

    @Override
    public JobPosition create(PositionRequest request) {
        var quizIds = map(request.getQuizzes(), QuizRequest::getId);
        var position = JobPosition.builder()
                .title(request.getTitle())
                .build();
        quizRepository.findAllById(quizIds).forEach(position::addQuiz);
        return repository.save(position);
    }

    @Override
    public JobPosition update(Long id, PositionRequest request) {
        var quizIds = map(request.getQuizzes(), QuizRequest::getId);
        var position = repository.getById(id);
        position.setTitle(request.getTitle());
        quizRepository.findAllById(map(position.getQuizzes(), Quiz::getId)).forEach(position::removeQuiz);
        quizRepository.findAllById(quizIds).forEach(position::addQuiz);
        return repository.save(position);
    }
}
