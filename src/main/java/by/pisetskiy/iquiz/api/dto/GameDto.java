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
public class GameDto extends BaseDto {
    private UserDto user;
    private QuizDto quiz;
    private String code;
    private String state;
    private String settings;
    private List<ParticipantDto> participants;
}
