package by.pisetskiy.iquiz.api.mapper;

import by.pisetskiy.iquiz.api.dto.*;
import by.pisetskiy.iquiz.model.entity.Game;
import by.pisetskiy.iquiz.model.entity.Participant;
import by.pisetskiy.iquiz.model.entity.Quiz;
import by.pisetskiy.iquiz.model.entity.User;
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

}
