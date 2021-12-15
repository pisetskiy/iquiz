package by.pisetskiy.iquiz.service;

import by.pisetskiy.iquiz.model.entity.Quiz;
import by.pisetskiy.iquiz.model.repository.QuizRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository repository;

    public List<Quiz> getQuizes() {
        return repository.findAll();
    }
}
