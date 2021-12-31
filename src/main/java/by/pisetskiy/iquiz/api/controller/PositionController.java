package by.pisetskiy.iquiz.api.controller;

import static by.pisetskiy.iquiz.api.RestEndpoints.API_PREFIX;
import static by.pisetskiy.iquiz.api.RestEndpoints.ID;
import static by.pisetskiy.iquiz.api.RestEndpoints.POSITIONS;
import static by.pisetskiy.iquiz.util.IQuizUtil.map;

import by.pisetskiy.iquiz.api.dto.PositionDto;
import by.pisetskiy.iquiz.api.mapper.PositionMapper;
import by.pisetskiy.iquiz.api.request.PositionRequest;
import by.pisetskiy.iquiz.service.PositionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PREFIX + POSITIONS)
@RequiredArgsConstructor
public class PositionController implements BaseController<PositionDto, PositionRequest> {

    private final PositionService service;
    private final PositionMapper mapper;

    @Override
    @GetMapping
    public List<PositionDto> findAll() {
        var positions = service.findAll();
        return map(positions, mapper::toListDto);
    }

    @Override
    public PositionDto findById(@PathVariable Long id) {
        var position = service.findById(id);
        return mapper.toDetailDto(position);
    }

    @Override
    public PositionDto create(PositionRequest request) {
        var position = service.create(request);
        return mapper.toDetailDto(position);
    }

    @Override
    public PositionDto update(@PathVariable Long id, PositionRequest request) {
        var position = service.update(id, request);
        return mapper.toDetailDto(position);
    }

}
