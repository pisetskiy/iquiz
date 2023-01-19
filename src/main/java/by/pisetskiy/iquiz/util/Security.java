package by.pisetskiy.iquiz.util;

import by.pisetskiy.iquiz.model.entity.User;
import by.pisetskiy.iquiz.model.entity.UserRole;
import lombok.experimental.UtilityClass;
import org.springframework.security.core.context.SecurityContextHolder;

@UtilityClass
public class Security {

    public static boolean isAuthenticated() {
        return !SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals("anonymousUser");
    }

    public static User getUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static boolean isAdmin() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().contains(UserRole.ADMIN);
    }
}
