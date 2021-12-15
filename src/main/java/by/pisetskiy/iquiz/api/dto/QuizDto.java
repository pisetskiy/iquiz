package by.pisetskiy.iquiz.api.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class QuizDto extends BaseDto {
    private String title;
}
