package by.pisetskiy.iquiz.api.dto;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class QuestionDto extends BaseDto {

    private Long quizId;
    private String content;
    private String type;
    private Boolean isActive;
    private List<VariantDto> variants;
}
