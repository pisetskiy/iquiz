package by.pisetskiy.iquiz.service;

import by.pisetskiy.iquiz.model.entity.BaseEntity;
import java.util.List;

public interface BaseService<E extends BaseEntity, R> {

    List<E> findAll();

    E findById(Long id);

    E create(R request);

    E update(Long id, R request);
}
