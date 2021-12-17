package by.pisetskiy.iquiz.model.repository;

import by.pisetskiy.iquiz.model.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
