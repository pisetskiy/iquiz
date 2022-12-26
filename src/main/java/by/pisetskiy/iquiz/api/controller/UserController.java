package by.pisetskiy.iquiz.api.controller;

import by.pisetskiy.iquiz.api.dto.UserDto;
import by.pisetskiy.iquiz.api.dto.SecurityDto;
import by.pisetskiy.iquiz.api.mapper.UserMapper;
import by.pisetskiy.iquiz.api.request.SignupRequest;
import by.pisetskiy.iquiz.service.UserService;
import by.pisetskiy.iquiz.util.Security;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import static by.pisetskiy.iquiz.api.RestEndpoints.*;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserMapper mapper;
    private final UserService service;

    @PostMapping(API_PREFIX + SIGNUP)
    public SecurityDto signup(@RequestBody SignupRequest request) {
        var message = service.signup(request);
        return new SecurityDto(message.name());
    }

    @GetMapping(API_PREFIX + LOGIN)
    public UserDto login() {
        var user = Security.getUser();
        return mapper.toDto(user);
    }

    @GetMapping(API_PREFIX + USER)
    public UserDto getUser() {
        var user = Security.getUser();
        return mapper.toDto(user);
    }

}
