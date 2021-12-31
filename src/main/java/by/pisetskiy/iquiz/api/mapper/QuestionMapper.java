package by.pisetskiy.iquiz.api.mapper;

import by.pisetskiy.iquiz.api.dto.QuestionDto;
import by.pisetskiy.iquiz.api.dto.VariantDto;
import by.pisetskiy.iquiz.model.entity.Question;
import by.pisetskiy.iquiz.model.entity.Variant;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface QuestionMapper {

    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "quizId", source = "question.quiz.id")
    QuestionDto toListDto(Question question);

    @Mapping(target = "quizId", source = "question.quiz.id")
    QuestionDto toDetailDto(Question question);

    VariantDto variant(Variant variant);
}
