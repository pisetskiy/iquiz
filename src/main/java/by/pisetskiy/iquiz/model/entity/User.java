package by.pisetskiy.iquiz.model.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@SuperBuilder
public class User extends BaseEntity implements UserDetails, CredentialsContainer {

    private String username;
    private String password;
    @Enumerated(EnumType.STRING)
    private UserRole role;
    @OneToOne(optional = false)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Override
    public List<UserRole> getAuthorities() {
        return List.of(this.role);
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public void eraseCredentials() {
        this.password = null;
    }
}
