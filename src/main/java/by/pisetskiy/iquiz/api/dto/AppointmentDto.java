package by.pisetskiy.iquiz.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class AppointmentDto extends BaseDto {

    private EmployeeDto employee;
    private QuizDto quiz;
    private List<QuestionDto> questions;
    private List<AnswerDto> answers;
    private String state;
    private String deadline;
    private String startDate;
    private String endDate;
    private Integer answersCount;
    private Integer trueAnswersCount;
}
