package by.pisetskiy.iquiz.api.mapper;

import by.pisetskiy.iquiz.api.dto.*;
import by.pisetskiy.iquiz.model.entity.*;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface GameMapper {

    GameDto toDto(Game game);

    UserDto userToDto(User user);

    @Mapping(target = "isFavorite", ignore = true)
    QuizDto quizToDto(Quiz quiz);

    ParticipantDto participantToDto(Participant participant);

    @Mapping(target = "quizId", source = "question.quiz.id")
    QuestionDto questionToDto(Question question);

    @Mapping(target = "isTrue", ignore = true)
    VariantDto variantToDto(Variant variant);

    @Mapping(target = "gameId", source = "game.id")
    @Mapping(target = "questionId", source = "question.id")
    @Mapping(target = "participantId", source = "participant.id")
    @Mapping(target = "variantId", source = "variant.id")
    @Mapping(target = "isTrue", source = "variant.isTrue")
    AnswerDto answerToDto(Answer answer);

}
