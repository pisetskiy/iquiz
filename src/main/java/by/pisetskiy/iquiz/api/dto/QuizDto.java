package by.pisetskiy.iquiz.api.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class QuizDto extends BaseDto {

    private String title;
    private Integer timeLimit;
    private List<QuestionDto> questions = new ArrayList<>();
}
