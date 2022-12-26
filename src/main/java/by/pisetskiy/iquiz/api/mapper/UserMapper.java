package by.pisetskiy.iquiz.api.mapper;

import by.pisetskiy.iquiz.api.dto.UserDto;
import by.pisetskiy.iquiz.model.entity.User;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface UserMapper {

    UserDto toDto(User user);
}
