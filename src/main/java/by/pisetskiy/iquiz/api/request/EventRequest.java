package by.pisetskiy.iquiz.api.request;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class EventRequest {

    private String messageType;
    private Map<String, Object> data;
}
