package by.pisetskiy.iquiz.api.mapper;

import by.pisetskiy.iquiz.api.dto.AppointmentDto;
import by.pisetskiy.iquiz.api.dto.EmployeeDto;
import by.pisetskiy.iquiz.api.dto.PositionDto;
import by.pisetskiy.iquiz.api.dto.QuizDto;
import by.pisetskiy.iquiz.model.entity.Appointment;
import by.pisetskiy.iquiz.model.entity.Employee;
import by.pisetskiy.iquiz.model.entity.JobPosition;
import by.pisetskiy.iquiz.model.entity.Quiz;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDateTime;

import static by.pisetskiy.iquiz.util.IQuizUtil.formatDateTime;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface AppointmentMapper {

    AppointmentDto toListDto(Appointment appointment);

    AppointmentDto toDetailDto(Appointment appointment);

    EmployeeDto employee(Employee employee);

    @Mapping(target = "quizzes", ignore = true)
    PositionDto position(JobPosition position);

    QuizDto quiz(Quiz quiz);

    default String dateTime(LocalDateTime dateTime) {
        return formatDateTime(dateTime);
    }
}
