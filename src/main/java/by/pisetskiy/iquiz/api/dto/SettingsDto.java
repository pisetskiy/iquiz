package by.pisetskiy.iquiz.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class SettingsDto {
    private Long maxParticipantCount;
    private Long questionDisplayTime;
    private Long answerWaitingTime;
}
