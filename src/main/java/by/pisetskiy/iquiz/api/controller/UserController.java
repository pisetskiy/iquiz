package by.pisetskiy.iquiz.api.controller;

import by.pisetskiy.iquiz.api.dto.AppointmentDto;
import by.pisetskiy.iquiz.api.dto.EmployeeDto;
import by.pisetskiy.iquiz.api.mapper.AppointmentMapper;
import by.pisetskiy.iquiz.api.mapper.EmployeeMapper;
import by.pisetskiy.iquiz.service.AppointmentService;
import by.pisetskiy.iquiz.util.Security;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static by.pisetskiy.iquiz.api.RestEndpoints.*;
import static by.pisetskiy.iquiz.util.IQuizUtil.map;

@RestController
@RequestMapping(API_PREFIX + USER)
@RequiredArgsConstructor
public class UserController {

    private final EmployeeMapper mapper;

    private final AppointmentService appointmentService;
    private final AppointmentMapper appointmentMapper;

    @GetMapping
    public EmployeeDto getUser() {
        var user = Security.getUser();
        var employee = user.getEmployee();
        return mapper.toDetailDto(employee);
    }

    @GetMapping(APPOINTMENTS)
    public List<AppointmentDto> getAppointments() {
        var appointments = appointmentService.findByEmployeeId(Security.getUser().getEmployee().getId());
        return map(appointments, appointmentMapper::toListDto);
    }
}
