package by.pisetskiy.iquiz.api.request;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class QuizRequest {

    private String title;
    private List<Long> questions;
}
