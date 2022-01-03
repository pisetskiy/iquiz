package by.pisetskiy.iquiz.service;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class PasswordGenerator {

    private static final char[] CHARS = "0123456789".toCharArray();
    private static final Random RANDOM = new Random();

    public String generate(int length) {
        if (length < 1) throw new IllegalArgumentException("Invalid password length");

        var chars = new char[length];
        for (int i = 0; i < length; i++) {
            chars[i] = CHARS[RANDOM.nextInt(CHARS.length)];
        }

        return new String(chars);
    }
}
