package by.pisetskiy.iquiz.api.request;

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
public class QuizRequest extends BaseRequest {

    private String title;
    private String description;
    private String bannerFile;
    private Boolean isActive;
    private Boolean isPublic;
}
