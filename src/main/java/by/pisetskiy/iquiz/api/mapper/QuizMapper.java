package by.pisetskiy.iquiz.api.mapper;

import by.pisetskiy.iquiz.api.dto.QuizDto;
import by.pisetskiy.iquiz.api.dto.UserDto;
import by.pisetskiy.iquiz.model.entity.Favorites;
import by.pisetskiy.iquiz.model.entity.Quiz;
import by.pisetskiy.iquiz.model.entity.User;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface QuizMapper {

    @Mapping(target = "isFavorite", source = "quiz.favorites", qualifiedByName = "isFavorite")
    QuizDto toListDto(Quiz quiz);

    @Mapping(target = "isFavorite", source = "quiz.favorites", qualifiedByName = "isFavorite")
    QuizDto toDetailDto(Quiz quiz);

    UserDto userToDto(User user);

    @Named("isFavorite")
    default boolean isFavorite(Favorites favorites) {
        return favorites != null ? Boolean.TRUE : Boolean.FALSE;
    }
}
