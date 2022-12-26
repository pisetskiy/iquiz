package by.pisetskiy.iquiz.api.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class SignupRequest {

    private String username;
    private String email;
    @ToString.Exclude
    private String password;
    private final LocalDateTime created = LocalDateTime.now();
}
