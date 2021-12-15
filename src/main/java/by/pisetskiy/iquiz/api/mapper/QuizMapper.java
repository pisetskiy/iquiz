package by.pisetskiy.iquiz.api.mapper;

import by.pisetskiy.iquiz.api.dto.QuizDto;
import by.pisetskiy.iquiz.model.entity.Quiz;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface QuizMapper {

    QuizDto toDto(Quiz quiz);
}
