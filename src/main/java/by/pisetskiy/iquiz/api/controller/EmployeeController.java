package by.pisetskiy.iquiz.api.controller;

import static by.pisetskiy.iquiz.api.RestEndpoints.API_PREFIX;
import static by.pisetskiy.iquiz.api.RestEndpoints.EMPLOYEES;
import static by.pisetskiy.iquiz.util.IQuizUtil.map;

import by.pisetskiy.iquiz.api.dto.EmployeeDto;
import by.pisetskiy.iquiz.api.mapper.EmployeeMapper;
import by.pisetskiy.iquiz.api.request.EmployeeRequest;
import by.pisetskiy.iquiz.service.EmployeeService;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PREFIX + EMPLOYEES)
@RequiredArgsConstructor
public class EmployeeController implements BaseController<EmployeeDto, EmployeeRequest> {

    private final EmployeeService service;
    private final EmployeeMapper mapper;

    @Override
    public List<EmployeeDto> findAll(Map<String, String> params) {
        return map(service.findAll(), mapper::toListDto);
    }

    @Override
    public EmployeeDto findById(Long id) {
        return mapper.toDetailDto(service.findById(id));
    }

    @Override
    public EmployeeDto create(EmployeeRequest request) {
        return mapper.toDetailDto(service.create(request));
    }

    @Override
    public EmployeeDto update(Long id, EmployeeRequest request) {
        return mapper.toDetailDto(service.update(id, request));
    }
}
