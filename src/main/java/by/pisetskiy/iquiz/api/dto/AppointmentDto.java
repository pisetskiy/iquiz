package by.pisetskiy.iquiz.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class AppointmentDto extends BaseDto {

    private EmployeeDto employee;
    private QuizDto quiz;
    private String state;
    private String deadline;
    private String startDate;
    private String endDate;
}
