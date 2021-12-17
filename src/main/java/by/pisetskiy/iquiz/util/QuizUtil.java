package by.pisetskiy.iquiz.util;

import by.pisetskiy.iquiz.model.entity.BaseEntity;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import lombok.experimental.UtilityClass;

@UtilityClass
public class QuizUtil {

    public static <T, U> List<U> map(List<T> elements, Function<T, U> mapper) {
        return elements.stream().map(mapper).collect(Collectors.toList());
    }

    public static <T, U> Set<U> map(Set<T> elements, Function<T, U> mapper) {
        return elements.stream().map(mapper).collect(Collectors.toSet());
    }

    public static <T, U> U map(T element, Function<T, U> mapper) {
        return mapper.apply(element);
    }

    public static <E extends BaseEntity> Function<Long, E> mapper(Supplier<E> constructor) {
        return (id) -> {
            var entity = constructor.get();
            entity.setId(id);
            return entity;
        };
    }
}
