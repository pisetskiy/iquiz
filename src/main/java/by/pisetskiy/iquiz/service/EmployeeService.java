package by.pisetskiy.iquiz.service;

import static by.pisetskiy.iquiz.util.IQuizUtil.map;
import static by.pisetskiy.iquiz.util.IQuizUtil.mapper;

import by.pisetskiy.iquiz.api.request.EmployeeRequest;
import by.pisetskiy.iquiz.model.entity.Employee;
import by.pisetskiy.iquiz.model.entity.JobPosition;
import by.pisetskiy.iquiz.model.repository.EmployeeRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeService implements BaseService<Employee, EmployeeRequest> {

    private final EmployeeRepository repository;

    @Override
    public List<Employee> findAll() {
        return repository.findAll();
    }

    @Override
    public Employee findById(Long id) {
        var employee = repository.getById(id);
        employee.getJobPosition();
        return employee;
    }

    @Override
    public Employee create(EmployeeRequest request) {
        var employee = Employee.builder()
                .firstName(request.getFirstName())
                .middleName(request.getMiddleName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .jobPosition(map(request.getPosition(), mapper(JobPosition::new)))
                .build();
        return repository.save(employee);
    }

    @Override
    public Employee update(Long id, EmployeeRequest request) {
        var employee = repository.getById(id);
        employee.setFirstName(request.getFirstName());
        employee.setMiddleName(request.getMiddleName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setJobPosition(map(request.getPosition(), mapper(JobPosition::new)));
        return repository.save(employee);
    }
}
