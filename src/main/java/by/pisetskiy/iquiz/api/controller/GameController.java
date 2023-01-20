package by.pisetskiy.iquiz.api.controller;

import by.pisetskiy.iquiz.api.dto.AnswerDto;
import by.pisetskiy.iquiz.api.dto.GameDto;
import by.pisetskiy.iquiz.api.dto.ParticipantDto;
import by.pisetskiy.iquiz.api.dto.QuestionDto;
import by.pisetskiy.iquiz.api.mapper.GameMapper;
import by.pisetskiy.iquiz.api.mapper.QuestionMapper;
import by.pisetskiy.iquiz.api.request.AnswerRequest;
import by.pisetskiy.iquiz.api.request.EventRequest;
import by.pisetskiy.iquiz.api.request.GameRequest;
import by.pisetskiy.iquiz.api.request.ParticipantRequest;
import by.pisetskiy.iquiz.model.entity.Answer;
import by.pisetskiy.iquiz.model.entity.Game;
import by.pisetskiy.iquiz.model.entity.Participant;
import by.pisetskiy.iquiz.model.entity.Question;
import by.pisetskiy.iquiz.service.GameSchedulerService;
import by.pisetskiy.iquiz.service.GameService;
import by.pisetskiy.iquiz.service.SseService;
import by.pisetskiy.iquiz.util.IQuizUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static by.pisetskiy.iquiz.api.RestEndpoints.*;

@RestController
@RequestMapping(API_PREFIX + GAMES)
@RequiredArgsConstructor
public class GameController implements BaseController<GameDto, GameRequest> {

    private final GameService service;
    private final GameSchedulerService gameSchedulerService;
    private final SseService sseService;
    private final GameMapper gameMapper;
    private final QuestionMapper questionMapper;

    @Override
    public List<GameDto> findAll(Map<String, String> params) {
        return null;
    }

    @Override
    public GameDto findById(Long id) {
        return gameMapper.toDto(service.findByCode(id.toString()));
    }

    @Override
    public GameDto create(GameRequest request) {
        Game game = service.create(request);
        return gameMapper.toDto(service.findById(game.getId()));
    }

    @Override
    public GameDto update(Long id, GameRequest request) {
        Game game = service.update(id, request);
        GameDto dto = gameMapper.toDto(service.findByCode(game.getCode()));
        sseService.sendMessage("game:" + id, "UPDATE_GAME", dto);
//        gameSchedulerService.startGame(game.getCode());
        return dto;
    }

    @GetMapping(ID + "/events")
    public SseEmitter getGameEvents(@PathVariable String id) {
        Game game = service.findByCode(id);
        List<Question> questions = service.getGameQuestions(id);
        List<Answer> answers = service.getGameAnswers(id);

        GameDto gameDto = gameMapper.toDto(game);
        List<QuestionDto> questionDtos = IQuizUtil.map(questions, questionMapper::toDetailDto);
        List<AnswerDto> answerDtos = IQuizUtil.map(answers, gameMapper::answerToDto);

        Map<String, Object> data = Map.of(
                "game", gameDto,
                "questions", questionDtos,
                "answers", answerDtos
        );

        SseEmitter sseEmitter = sseService.getEventEmitter("game:" + id);
        sseService.sendMessage("game:" + id, "GET_GAME", data);
        return sseEmitter;
    }

    @PostMapping(ID + PARTICIPANTS)
    public ParticipantDto addParticipant(@PathVariable String id, @RequestBody ParticipantRequest request) {
        Participant participant = service.addParticipant(id, request);
        ParticipantDto participantDto = gameMapper.participantToDto(participant);
        sseService.sendMessage("game:" + id, "ADD_PARTICIPANT", participantDto);
        return participantDto;
    }

    @PutMapping(ID + PARTICIPANTS + "/{participantId}")
    public ParticipantDto updateParticipant(@PathVariable String id, @PathVariable Long participantId, @RequestBody ParticipantRequest request) {
        Participant participant = service.updateParticipant(id, participantId, request);
        ParticipantDto participantDto = gameMapper.participantToDto(participant);
        sseService.sendMessage("game:" + id, "UPDATE_PARTICIPANT", participantDto);

        return participantDto;
    }

    @PostMapping(ID + "/start")
    public void startGame(@PathVariable String id) {
        Game game = service.startGame(id);
        List<Question> questions = service.getGameQuestions(id);
        List<Answer> answers = service.getGameAnswers(id);

        GameDto gameDto = gameMapper.toDto(game);
        List<QuestionDto> questionDtos = IQuizUtil.map(questions, questionMapper::toDetailDto);
        List<AnswerDto> answerDtos = IQuizUtil.map(answers, gameMapper::answerToDto);

        Map<String, Object> data = Map.of(
                "game", gameDto,
                "questions", questionDtos,
                "answers", answerDtos
        );

        sseService.sendMessage("game:" + id, "START_GAME", data);
        gameSchedulerService.startGame(id);
    }

    @PostMapping(ID + "/questions/{questionId}/showQuestion")
    public void showQuestion(@PathVariable String id, @PathVariable Long questionId) {
        Question question = service.getGameQuestion(id, questionId);
        QuestionDto questionDto = questionMapper.toDetailDto(question);
        sseService.sendMessage("game:" + id, "SHOW_QUESTION", questionDto);
    }

    @PostMapping(ID + "/questions/{questionId}/showVariants")
    public void showVariants(@PathVariable String id, @PathVariable Long questionId) {
        Question question = service.getGameQuestion(id, questionId);
        QuestionDto questionDto = questionMapper.toDetailDto(question);
        sseService.sendMessage("game:" + id, "SHOW_VARIANTS", questionDto);
    }

    @PostMapping(ID + "/questions/{questionId}/addAnswer")
    public AnswerDto addAnswer(@PathVariable String id, @PathVariable Long questionId, @RequestBody AnswerRequest answerRequest) {
        Answer answer = service.addGameAnswer(id, questionId, answerRequest);
        AnswerDto answerDto = gameMapper.answerToDto(answer);
        sseService.sendMessage("game:" + id, "ANSWER_QUESTION", answerDto);
        return answerDto;
    }

    @PostMapping(ID + "/questions/{questionId}/showAnswers")
    public void showAnswers(@PathVariable String id, @PathVariable Long questionId) {
        List<Answer> answers = service.getQuestionAnswers(id, questionId);
        List<AnswerDto> answerDtos = IQuizUtil.map(answers, gameMapper::answerToDto);
        sseService.sendMessage("game:" + id, "SHOW_ANSWERS", answerDtos);
    }
}
