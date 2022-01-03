package by.pisetskiy.iquiz.api.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class EmployeeRequest extends BaseRequest {

    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private Long position;
    private Boolean isAdmin = Boolean.FALSE;
}
