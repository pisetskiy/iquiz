package by.pisetskiy.iquiz.api.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class AppointmentRequest {

    private Long employee;
    private Long quiz;
    private String deadline;
}
