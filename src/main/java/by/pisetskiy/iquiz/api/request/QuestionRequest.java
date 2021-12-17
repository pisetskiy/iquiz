package by.pisetskiy.iquiz.api.request;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class QuestionRequest {

    private String content;
    private String type;
    private List<VariantRequest> variants = new ArrayList<>();
}
