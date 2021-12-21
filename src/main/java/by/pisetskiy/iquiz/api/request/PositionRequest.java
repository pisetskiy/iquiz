package by.pisetskiy.iquiz.api.request;

import java.util.HashSet;
import java.util.Set;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class PositionRequest extends BaseRequest {

    private String title;
    private Set<Long> quizzes = new HashSet<>();
}
