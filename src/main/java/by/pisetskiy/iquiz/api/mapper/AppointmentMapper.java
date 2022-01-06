package by.pisetskiy.iquiz.api.mapper;

import by.pisetskiy.iquiz.api.dto.*;
import by.pisetskiy.iquiz.model.entity.*;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static by.pisetskiy.iquiz.util.IQuizUtil.formatDate;
import static by.pisetskiy.iquiz.util.IQuizUtil.formatDateTime;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface AppointmentMapper {

    AppointmentDto toListDto(Appointment appointment);

    AppointmentDto toDetailDto(Appointment appointment);

    EmployeeDto employee(Employee employee);

    @Mapping(target = "quizzes", ignore = true)
    PositionDto position(JobPosition position);

    QuizDto quiz(Quiz quiz);

    @Mapping(target = "question", source = "answer.question.id")
    AnswerDto answer(Answer answer);

    default Long question(Question question) {
        return question.getId();
    }

    default Long variant(Variant variant) {
        return variant.getId();
    }

    default String date(LocalDate date) {
        return date != null ? formatDate(date) : null;
    }

    default String dateTime(LocalDateTime dateTime) {
        return dateTime != null ? formatDateTime(dateTime) : null;
    }
}
