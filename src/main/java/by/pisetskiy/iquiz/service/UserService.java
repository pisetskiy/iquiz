package by.pisetskiy.iquiz.service;

import by.pisetskiy.iquiz.model.entity.Employee;
import by.pisetskiy.iquiz.model.entity.User;
import by.pisetskiy.iquiz.model.entity.UserRole;
import by.pisetskiy.iquiz.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository repository;
    private final PasswordGenerator passwordGenerator;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found."));
    }

    public void createUser(Employee employee) {
        var password = passwordGenerator.generate(10);
        var user = User.builder()
                .username(employee.getEmail())
                .password(passwordEncoder.encode(password))
                .role(employee.getIsAdmin() ? UserRole.ADMIN : UserRole.USER)
                .employee(employee)
                .build();
        repository.save(user);
        emailService.sendAccountCreatedEmail(employee, password);
    }

    public void updateUser(Employee employee) {
        var user = repository.getByUsername(employee.getEmail());
        user.setRole(employee.getIsAdmin() ? UserRole.ADMIN : UserRole.USER);
        repository.save(user);
    }
}
