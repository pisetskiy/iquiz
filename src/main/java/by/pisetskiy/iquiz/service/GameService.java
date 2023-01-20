package by.pisetskiy.iquiz.service;

import by.pisetskiy.iquiz.api.request.AnswerRequest;
import by.pisetskiy.iquiz.api.request.GameRequest;
import by.pisetskiy.iquiz.api.request.ParticipantRequest;
import by.pisetskiy.iquiz.api.request.SettingsRequest;
import by.pisetskiy.iquiz.model.entity.*;
import by.pisetskiy.iquiz.model.repository.*;
import by.pisetskiy.iquiz.util.IQuizUtil;
import by.pisetskiy.iquiz.util.Security;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GameService implements BaseService<Game, GameRequest> {

    private final GameRepository repository;
    private final ParticipantRepository participantRepository;
    private final QuestionRepository questionRepository;
    private final VariantRepository variantRepository;
    private final AnswerRepository answerRepository;
    private final ObjectMapper jsonMapper;

    @Override
    public List<Game> findAll() {
        return null;
    }

    @Override
    public Game findById(Long id) {
        Game game = repository.getById(id);
        game.getUser();
        game.getQuiz();
        game.getParticipants();
        return game;
    }

    public Game findByCode(String code) {
        Game game = repository.getByCode(code);
        game.getUser();
        game.getQuiz();
        game.getParticipants();
        return game;
    }

    @Override
    public Game create(GameRequest request) {
        var game = Game.builder()
                .user(Security.getUser())
                .quiz(Quiz.builder().id(request.getQuizId()).build())
                .code(createGameCode())
                .state(GameState.CREATED)
                .settings(getSettings(request.getSettings()))
                .build();
        return repository.save(game);
    }

    @Override
    public Game update(Long id, GameRequest request) {
        Game game = repository.getByCode(id.toString());
        if (game.getState() == GameState.CREATED && game.getUser().getId().equals(Security.getUser().getId())) {
            game.setState(GameState.valueOf(request.getState()));
            if (request.getSettings() != null) {
                game.setSettings(getSettings(request.getSettings()));
            }
        }

        return repository.save(game);
    }

    public Game startGame(String code) {
        Game game = repository.getByCode(code);
        if (game.getState() != GameState.CREATED)
            throw new RuntimeException();
        game.setState(GameState.STARTED);

        return repository.save(game);
    }

    public Participant addParticipant(String code, ParticipantRequest request) {
        Game game = repository.getByCode(code);
        if (game.getState() != GameState.CREATED)
            throw new RuntimeException();
        Participant participant = Participant.builder()
                .game(game)
                .username(request.getUsername())
                .avatar(request.getAvatar())
                .build();

        return participantRepository.save(participant);
    }

    public Participant updateParticipant(String code, Long participantId, ParticipantRequest request) {
        Game game = repository.getByCode(code);
        if (game.getState() != GameState.CREATED)
            throw new RuntimeException();
        Participant participant = participantRepository.getById(participantId);
        if (participant.getGame().getId().longValue() != game.getId().longValue())
            throw new RuntimeException();
        participant.setUsername(request.getUsername());
        participant.setAvatar(request.getAvatar());

        return participantRepository.save(participant);
    }

    @Transactional(readOnly = true)
    public List<Question> getGameQuestions(String code) {
        Game game = repository.getByCode(code);
        List<Question> questions = questionRepository.findAllByQuizIdWithVariants(game.getQuiz().getId());
        questions.removeIf(q -> Boolean.FALSE.equals(q.getIsActive()));

        return questions;
    }

    @Transactional(readOnly = true)
    public Question getGameQuestion(String code, Long questionId) {
        List<Question> gameQuestions = getGameQuestions(code);
        Question question = IQuizUtil.find(gameQuestions, questionId);
        return question;
    }

    @Transactional(readOnly = true)
    public List<Answer> getGameAnswers(String code) {
        Game game = repository.getByCode(code);
        List<Answer> answers = answerRepository.findAllByGame(game);

        return answers;
    }

    public Answer addGameAnswer(String code, Long questionId, AnswerRequest answerRequest) {
        Game game = repository.getByCode(code);
        if (game.getState() != GameState.STARTED)
            throw new RuntimeException();
        Question question = questionRepository.getById(questionId);
        if(!game.getQuiz().getId().equals(question.getQuiz().getId()))
            throw new RuntimeException();
        Participant participant = participantRepository.getById(answerRequest.getParticipantId());
        if (!game.getId().equals(participant.getGame().getId()))
            throw new RuntimeException();
        Variant variant = variantRepository.getById(answerRequest.getVariantId());
        if (!question.getId().equals(variant.getQuestion().getId()))
            throw new RuntimeException();

        Answer answer = Answer.builder()
                .game(game)
                .question(question)
                .participant(participant)
                .variant(variant)
                .build();

        answer = answerRepository.save(answer);

        answer.getGame().getId();
        answer.getQuestion().getId();
        answer.getParticipant().getId();
        answer.getVariant().getId();
        answer.getVariant().getIsTrue();

        return answer;
    }

    public List<Answer> getQuestionAnswers(String code, Long questionId) {
        Game game = repository.getByCode(code);
        List<Answer> answers = answerRepository.findAllByGame(game);
        answers.removeIf(a -> !questionId.equals(a.getQuestion().getId()));

        return answers;
    }

    private String createGameCode() {
        return System.currentTimeMillis() + "";
    }

    @SneakyThrows
    private String getSettings(SettingsRequest request) {
        if (request == null) request = new SettingsRequest();
        if (request.getMaxParticipantCount() == null) request.setMaxParticipantCount(16L);
        if (request.getQuestionDisplayTime() == null) request.setQuestionDisplayTime(10L);
        if (request.getAnswerWaitingTime() == null) request.setAnswerWaitingTime(10L);

        return jsonMapper.writeValueAsString(request);
    }

    private List<Participant> getParticipants(List<ParticipantRequest> requests) {
        return requests.stream().map(request -> {
            return Participant.builder()
                    .username(request.getUsername())
                    .avatar(request.getAvatar())
                    .build();
        }).collect(Collectors.toList());
    }
}
