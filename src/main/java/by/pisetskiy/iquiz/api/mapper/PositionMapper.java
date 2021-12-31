package by.pisetskiy.iquiz.api.mapper;

import by.pisetskiy.iquiz.api.dto.PositionDto;
import by.pisetskiy.iquiz.api.dto.QuizDto;
import by.pisetskiy.iquiz.model.entity.JobPosition;
import by.pisetskiy.iquiz.model.entity.Quiz;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface PositionMapper {

    @Mapping(target = "quizzes", ignore = true)
    PositionDto toListDto(JobPosition position);

    PositionDto toDetailDto(JobPosition position);
    
    QuizDto quiz(Quiz quiz);
}
