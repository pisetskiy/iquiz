package by.pisetskiy.iquiz.api.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class SettingsRequest {

    private Long maxParticipantCount;
    private Long questionDisplayTime;
    private Long answerWaitingTime;
}
