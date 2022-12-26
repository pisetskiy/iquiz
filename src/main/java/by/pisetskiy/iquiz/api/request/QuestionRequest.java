package by.pisetskiy.iquiz.api.request;

import java.util.ArrayList;
import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class QuestionRequest extends BaseRequest {

    private Long quizId;
    private String content;
    private String type;
    private Boolean isActive;
    private List<VariantRequest> variants = new ArrayList<>();
}
