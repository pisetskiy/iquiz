package by.pisetskiy.iquiz.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.ALWAYS)
public class QuizDto extends BaseDto {

    private UserDto user;
    private String title;
    private String description;
    private String bannerFile;
    private Boolean isActive;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int questionCount;
    private Boolean isFavorite;
}
