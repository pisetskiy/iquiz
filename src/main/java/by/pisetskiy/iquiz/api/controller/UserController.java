package by.pisetskiy.iquiz.api.controller;

import by.pisetskiy.iquiz.api.dto.EmployeeDto;
import by.pisetskiy.iquiz.api.mapper.EmployeeMapper;
import by.pisetskiy.iquiz.util.Security;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static by.pisetskiy.iquiz.api.RestEndpoints.API_PREFIX;
import static by.pisetskiy.iquiz.api.RestEndpoints.USER;

@RestController
@RequestMapping(API_PREFIX + USER)
@RequiredArgsConstructor
public class UserController {

    private final EmployeeMapper mapper;

    @GetMapping
    public EmployeeDto getUser() {
        var user = Security.getUser();
        var employee = user.getEmployee();
        return mapper.toDetailDto(employee);
    }

}
