package by.pisetskiy.iquiz.service;

import by.pisetskiy.iquiz.api.dto.GameDto;
import by.pisetskiy.iquiz.api.dto.QuestionDto;
import by.pisetskiy.iquiz.api.dto.SettingsDto;
import by.pisetskiy.iquiz.api.dto.VariantDto;
import by.pisetskiy.iquiz.api.mapper.GameMapper;
import by.pisetskiy.iquiz.api.mapper.QuestionMapper;
import by.pisetskiy.iquiz.model.entity.*;
import by.pisetskiy.iquiz.model.repository.AnswerRepository;
import by.pisetskiy.iquiz.model.repository.GameRepository;
import by.pisetskiy.iquiz.model.repository.QuestionRepository;
import by.pisetskiy.iquiz.model.repository.QuizRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameSchedulerService {

    private final SseService sseService;
    private final GameRepository gameRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final ObjectMapper jsonMapper;

    private final GameMapper gameMapper;
    private final QuestionMapper questionMapper;

    @Async
    @Transactional
    public void startGame(String code) {
        Game game = gameRepository.getByCode(code);
        if (game.getState() != GameState.STARTED) {
            return;
        }

        Quiz quiz = quizRepository.getById(game.getQuiz().getId());
        List<Question> questions = questionRepository.findAllByQuizId(quiz.getId());
        questions.removeIf(q -> !q.getIsActive());
        List<Answer> answers = answerRepository.findAllByGame(game);
        Map<Long, List<Answer>> answersByQuestion = answers.stream()
                .collect(Collectors.groupingBy(a -> a.getQuestion().getId()));
        questions.removeIf(q -> answersByQuestion.containsKey(q.getId()));

        SettingsDto settings = new SettingsDto();

        try {
            settings = jsonMapper.readValue(game.getSettings(), SettingsDto.class);
        } catch (Exception e) {
            settings.setMaxParticipantCount(16L);
            settings.setQuestionDisplayTime(30L);
            settings.setAnswerWaitingTime(15L);
        }

        for (Question question : questions) {
            QuestionDto questionDto = questionMapper.toDetailDto(question);

            sseService.sendMessage("game:" + game.getCode(), "SHOW_QUESTION", questionDto);

            try {
                Thread.sleep(settings.getQuestionDisplayTime() * 1000);
            } catch (Exception e) {
                e.printStackTrace();
            }

            sseService.sendMessage("game:" + game.getCode(), "WAIT_ANSWER", questionDto);

            try {
                Thread.sleep(settings.getAnswerWaitingTime() * 1000);
            } catch (Exception e) {
                e.printStackTrace();
            }

            sseService.sendMessage("game:" + game.getCode(), "SHOW_ANSWER", questionDto);

            try {
                Thread.sleep(10 * 1000);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        game.setState(GameState.FINISHED);
        gameRepository.save(game);

        GameDto gameDto = gameMapper.toDto(gameRepository.getByCode(code));
        sseService.sendMessage("game:" + game.getCode(), "FINISH_GAME", gameDto);
    }

}
