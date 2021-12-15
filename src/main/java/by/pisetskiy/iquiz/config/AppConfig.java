package by.pisetskiy.iquiz.config;

import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootConfiguration
@ComponentScan("by.pisetskiy.iquiz")
@EntityScan("by.pisetskiy.iquiz.model.entity")
@EnableJpaRepositories("by.pisetskiy.iquiz.model.repository")
@EnableJpaAuditing
@EnableTransactionManagement
public class AppConfig {
}
