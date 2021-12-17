package by.pisetskiy.iquiz.api.mapper;

import by.pisetskiy.iquiz.api.dto.EmployeeDto;
import by.pisetskiy.iquiz.api.dto.PositionDto;
import by.pisetskiy.iquiz.model.entity.Employee;
import by.pisetskiy.iquiz.model.entity.JobPosition;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface EmployeeMapper {

    @Mapping(source = "jobPosition", target = "position")
    EmployeeDto toListDto(Employee employee);

    @Mapping(source = "jobPosition", target = "position")
    EmployeeDto toDetailDto(Employee employee);

    @Mapping(target = "quizzes", ignore = true)
    PositionDto position(JobPosition position);
}
