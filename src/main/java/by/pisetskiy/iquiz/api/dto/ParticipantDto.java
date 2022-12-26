package by.pisetskiy.iquiz.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ParticipantDto extends BaseDto {
    private String username;
    private String avatar;
}
