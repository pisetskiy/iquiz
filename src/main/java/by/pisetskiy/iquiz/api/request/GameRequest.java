package by.pisetskiy.iquiz.api.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@NoArgsConstructor
@ToString
public class GameRequest {
    private Long quizId;
    private String state;
    private SettingsRequest settings;
}
