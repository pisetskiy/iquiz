package by.pisetskiy.iquiz.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.servlet.http.HttpServletResponse;

@SpringBootConfiguration
@ComponentScan("by.pisetskiy.iquiz")
@EntityScan("by.pisetskiy.iquiz.model.entity")
@EnableJpaRepositories("by.pisetskiy.iquiz.model.repository")
@EnableJpaAuditing
@EnableTransactionManagement
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableAsync
public class AppConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests(requests ->
                requests
                        .mvcMatchers("/api/v1/signup").anonymous()
                        .mvcMatchers("/api/v1/games/**").permitAll()
                        .anyRequest().authenticated()
        );
        http.httpBasic();
        http.logout()
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK));
        http.cors();
        http.csrf().disable();
    }

    @Bean
    PasswordEncoder delegatingPasswordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
