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
public class PositionDto extends BaseDto {

    private String title;
    private Integer quizzesCount;
    private List<QuizDto> quizzes;
}
