package by.pisetskiy.iquiz.api.controller;

import by.pisetskiy.iquiz.api.dto.AppointmentDto;
import by.pisetskiy.iquiz.api.mapper.AppointmentMapper;
import by.pisetskiy.iquiz.api.request.AppointmentRequest;
import by.pisetskiy.iquiz.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static by.pisetskiy.iquiz.api.RestEndpoints.API_PREFIX;
import static by.pisetskiy.iquiz.api.RestEndpoints.APPOINTMENTS;
import static by.pisetskiy.iquiz.util.IQuizUtil.map;

@RestController
@RequestMapping(API_PREFIX + APPOINTMENTS)
@RequiredArgsConstructor
public class AppointmentController implements BaseController<AppointmentDto, AppointmentRequest> {

    private final AppointmentService service;
    private final AppointmentMapper mapper;

    @Override
    public List<AppointmentDto> findAll() {
        return map(service.findAll(), mapper::toListDto);
    }

    @Override
    public AppointmentDto findById(Long id) {
        return mapper.toDetailDto(service.findById(id));
    }

    @Override
    public AppointmentDto create(AppointmentRequest request) {
        return mapper.toDetailDto(service.create(request));
    }

    @Override
    public AppointmentDto update(Long id, AppointmentRequest request) {
        return mapper.toDetailDto(service.update(id, request));
    }
}
