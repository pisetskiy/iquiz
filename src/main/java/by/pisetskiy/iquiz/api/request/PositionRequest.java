package by.pisetskiy.iquiz.api.request;

import java.util.HashSet;
import java.util.Set;
import lombok.Data;

@Data
public class PositionRequest {

    private String title;
    private Set<Long> quizzes = new HashSet<>();
}
