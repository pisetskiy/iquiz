package by.pisetskiy.iquiz.config;

import by.pisetskiy.iquiz.model.entity.UserRole;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootConfiguration
@ComponentScan("by.pisetskiy.iquiz")
@EntityScan("by.pisetskiy.iquiz.model.entity")
@EnableJpaRepositories("by.pisetskiy.iquiz.model.repository")
@EnableJpaAuditing
@EnableTransactionManagement
public class AppConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests((requests) -> requests.anyRequest()
                .hasAuthority(UserRole.ADMIN.getAuthority()));
        http.formLogin();
        http.logout();
        http.cors();
        http.csrf().disable();
    }
}
