package by.pisetskiy.iquiz.service;

import by.pisetskiy.iquiz.api.request.SignupRequest;
import by.pisetskiy.iquiz.model.entity.User;
import by.pisetskiy.iquiz.model.entity.UserRole;
import by.pisetskiy.iquiz.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    public enum SignupResult {
        ok,
        usernameRequired,
        usernameInvalid,
        usernameNotUnique,
        emailRequired,
        emailInvalid,
        emailNotUnique,
        passwordRequired,
        passwordMinLength,

    }

    private final UserRepository repository;
    private final PasswordGenerator passwordGenerator;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found."));
    }

    public SignupResult signup(SignupRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return SignupResult.usernameRequired;
        }
        var username = request.getUsername().trim();
        if (username.length() > 30) {
            return SignupResult.usernameInvalid;
        }
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return SignupResult.emailRequired;
        }
        var email = request.getEmail().trim();
        if (email.length() > 60) {
            return SignupResult.emailInvalid;
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return SignupResult.passwordRequired;
        }
        var password = request.getPassword();
        if (password.length() < 8) {
            return SignupResult.passwordMinLength;
        }

        if(repository.findByUsername(username).isPresent()) {
            return SignupResult.usernameNotUnique;
        }
        if (repository.findByEmail(email).isPresent()) {
            return SignupResult.emailNotUnique;
        }

        var user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .build();
        repository.save(user);
        emailService.sendSignupEmail(email, username);

        return SignupResult.ok;
    }

}
