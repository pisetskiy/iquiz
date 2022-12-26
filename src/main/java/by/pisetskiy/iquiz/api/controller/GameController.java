package by.pisetskiy.iquiz.api.controller;

import by.pisetskiy.iquiz.api.dto.GameDto;
import by.pisetskiy.iquiz.api.dto.ParticipantDto;
import by.pisetskiy.iquiz.api.mapper.GameMapper;
import by.pisetskiy.iquiz.api.request.GameRequest;
import by.pisetskiy.iquiz.api.request.ParticipantRequest;
import by.pisetskiy.iquiz.model.entity.Game;
import by.pisetskiy.iquiz.service.GameSchedulerService;
import by.pisetskiy.iquiz.service.GameService;
import by.pisetskiy.iquiz.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

import static by.pisetskiy.iquiz.api.RestEndpoints.*;

@RestController
@RequestMapping(API_PREFIX + GAMES)
@RequiredArgsConstructor
public class GameController implements BaseController<GameDto, GameRequest> {

    private final GameService service;
    private final GameSchedulerService gameSchedulerService;
    private final SseService sseService;
    private final GameMapper mapper;

    @Override
    public List<GameDto> findAll(Map<String, String> params) {
        return null;
    }

    @Override
    public GameDto findById(Long id) {
        return mapper.toDto(service.findByCode(id.toString()));
    }

    @Override
    public GameDto create(GameRequest request) {
        Game game = service.create(request);
        return mapper.toDto(service.findById(game.getId()));
    }

    @Override
    public GameDto update(Long id, GameRequest request) {
        Game game = service.update(id, request);
        GameDto dto = mapper.toDto(service.findByCode(game.getCode()));
        sseService.sendMessage("game:"+id, "UPDATE_GAME", dto);
        gameSchedulerService.startGame(game.getCode());
        return dto;
    }

    @PostMapping(ID + PARTICIPANTS)
    public ParticipantDto addParticipant(@PathVariable Long id, @RequestBody ParticipantRequest request) {
        ParticipantDto dto = mapper.participantToDto(service.addParticipant(id, request));
        sseService.sendMessage("game:" + id, "ADD_PARTICIPANT", dto);
        return dto;
    }

    @PostMapping(ID + PARTICIPANTS + "/{participantId}")
    public ParticipantDto updateParticipant(@PathVariable Long id, @PathVariable Long participantId, @RequestBody ParticipantRequest request) {
        ParticipantDto dto = mapper.participantToDto(service.updateParticipant(id, participantId, request));
        sseService.sendMessage("game:" + id, "UPDATE_PARTICIPANT", dto);
        return dto;
    }

    @GetMapping(ID + "/events")
    public SseEmitter getGameEvents(@PathVariable Long id) {
        SseEmitter sseEmitter = sseService.getEventEmitter("game:" + id);
        Game game = service.findByCode(id.toString());
        GameDto dto = mapper.toDto(game);
        sseService.sendMessage("game:" + id, "GET_GAME", dto, sseEmitter);

        return sseEmitter;
    }
}
