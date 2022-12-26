package by.pisetskiy.iquiz.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

import static by.pisetskiy.iquiz.util.IQuizUtil.formatDate;

@Slf4j
@Service
public class EmailService {

    public void sendSignupEmail(String email, String username) {
        var now = Instant.now().toEpochMilli();
        var data = email + "," + username + "," + now;
        var code = Base64Utils.encodeToUrlSafeString(data.getBytes(StandardCharsets.UTF_8));
        var link = "https://iquiz.by/activate?code=" + code;
        log.info("Account for user {} created, to activate account use this link {}", username, link);
    }

}
