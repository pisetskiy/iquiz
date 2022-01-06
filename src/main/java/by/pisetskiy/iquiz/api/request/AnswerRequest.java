package by.pisetskiy.iquiz.api.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class AnswerRequest extends BaseRequest {

    private Long question;
    private Set<Long> variants = new HashSet<>();

}
