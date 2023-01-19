package by.pisetskiy.iquiz.service;

import static by.pisetskiy.iquiz.util.IQuizUtil.map;
import static by.pisetskiy.iquiz.util.IQuizUtil.mapper;

import by.pisetskiy.iquiz.api.request.QuizRequest;
import by.pisetskiy.iquiz.model.entity.Favorites;
import by.pisetskiy.iquiz.model.entity.Question;
import by.pisetskiy.iquiz.model.entity.Quiz;
import by.pisetskiy.iquiz.model.entity.User;
import by.pisetskiy.iquiz.model.repository.FavoritesRepository;
import by.pisetskiy.iquiz.model.repository.QuizRepository;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import by.pisetskiy.iquiz.util.Security;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuizService implements BaseService<Quiz, QuizRequest> {

    private final QuizRepository repository;
    private final FavoritesRepository favoritesRepository;


    @Override
    public List<Quiz> findAll() {
        return repository.findAll();
    }

    public List<Quiz> findAll(Map<String, String> params) {
        List<Quiz> quizzes = repository.findAllEager();
        Map<Long, Favorites> favorites = Collections.emptyMap();
        if (Security.isAuthenticated()) {
            favorites = favoritesRepository.findAllByUser(Security.getUser()).stream()
                    .collect(Collectors.toMap(
                            favorites1 -> favorites1.getQuiz().getId(),
                            favorites1 -> favorites1
                    ));
        }
        for (Quiz quiz : quizzes) {
            quiz.setFavorites(favorites.get(quiz.getId()));
        }


        if (params.containsKey("user") && Security.isAuthenticated()) {
            return quizzes.stream().filter(quiz -> quiz.getUser().getId().equals(Security.getUser().getId())).collect(Collectors.toList());
        }
        if (params.containsKey("favorites")) {
            return quizzes.stream().filter(quiz -> quiz.getFavorites() != null).collect(Collectors.toList());
        }

        return quizzes;
    }

    @Override
    public Quiz findById(Long id) {
        var quiz = repository.getById(id);
        quiz.getUser().getEmail();
        quiz.setFavorites(favoritesRepository.getByUserAndQuiz(Security.getUser(), quiz));
        return repository.getById(id);
    }

    @Override
    public Quiz create(QuizRequest request) {
        var quiz = Quiz.builder()
                .user(Security.getUser())
                .title(request.getTitle())
                .description(trimIfNotNull(request.getDescription()))
                .bannerFile(trimIfNotNull(request.getBannerFile()))
                .isActive(request.getIsActive())
                .isPublic(request.getIsPublic())
                .build();
        return repository.save(quiz);
    }

    @Override
    public Quiz update(Long id, QuizRequest request) {
        var quiz = repository.getById(id);
        if (!quiz.getUser().getId().equals(Security.getUser().getId())) {
            return quiz;
        }
        quiz.setTitle(request.getTitle());
        quiz.setDescription(trimIfNotNull(request.getDescription()));
        quiz.setBannerFile(trimIfNotNull(request.getBannerFile()));
        quiz.setIsActive(request.getIsActive());
        quiz.setIsPublic(request.getIsPublic());
        quiz.setUpdatedAt(LocalDateTime.now());
        return repository.save(quiz);
    }

    public void toFavorites(Long id) {
        Quiz quiz = repository.getById(id);
        Favorites favorites = favoritesRepository.getByUserAndQuiz(Security.getUser(), quiz);
        if (favorites == null) {
            favorites = Favorites.builder()
                    .user(Security.getUser())
                    .quiz(quiz)
                    .build();
            favoritesRepository.save(favorites);
        }
    }

    public void fromFavorites(Long id) {
        Quiz quiz = repository.getById(id);
        Favorites favorites = favoritesRepository.getByUserAndQuiz(Security.getUser(), quiz);
        if (favorites != null) {
            favoritesRepository.delete(favorites);
        }
    }

    private String trimIfNotNull(String text) {
        return text == null ? text : text.trim();
    }
}
