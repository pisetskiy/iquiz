package by.pisetskiy.iquiz.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class UserDto extends BaseDto {

    private String username;
    private String email;
    private Boolean isActive;
    private String role;
}
