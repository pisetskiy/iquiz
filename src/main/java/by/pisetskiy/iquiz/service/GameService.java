package by.pisetskiy.iquiz.service;

import by.pisetskiy.iquiz.api.request.GameRequest;
import by.pisetskiy.iquiz.api.request.ParticipantRequest;
import by.pisetskiy.iquiz.api.request.SettingsRequest;
import by.pisetskiy.iquiz.model.entity.Game;
import by.pisetskiy.iquiz.model.entity.GameState;
import by.pisetskiy.iquiz.model.entity.Participant;
import by.pisetskiy.iquiz.model.entity.Quiz;
import by.pisetskiy.iquiz.model.repository.GameRepository;
import by.pisetskiy.iquiz.model.repository.ParticipantRepository;
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

    public Participant addParticipant(Long code, ParticipantRequest request) {
        Participant participant = Participant.builder()
                .game(repository.getByCode(code.toString()))
                .username(request.getUsername())
                .avatar(request.getAvatar())
                .build();

        return participantRepository.save(participant);
    }

    public Participant updateParticipant(Long code, Long participantId, ParticipantRequest request) {
        Participant participant = participantRepository.getById(participantId);
        participant.setUsername(request.getUsername());
        participant.setAvatar(request.getAvatar());

        return participantRepository.save(participant);
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
