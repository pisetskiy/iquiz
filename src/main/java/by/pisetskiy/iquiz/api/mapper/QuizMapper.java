package by.pisetskiy.iquiz.api.mapper;

import by.pisetskiy.iquiz.api.dto.QuestionDto;
import by.pisetskiy.iquiz.api.dto.QuizDto;
import by.pisetskiy.iquiz.model.entity.Question;
import by.pisetskiy.iquiz.model.entity.Quiz;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface QuizMapper {

    @Mapping(target = "questions", ignore = true)
    QuizDto toListDto(Quiz quiz);

    QuizDto toDetailDto(Quiz quiz);

    @Mapping(target = "variants", ignore = true)
    QuestionDto question(Question question);
}
