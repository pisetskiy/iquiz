package by.pisetskiy.iquiz.api.controller;

import java.util.List;

public interface BaseController<D, R> {

    List<D> findAll();

    D findById(Long id);

    D create(R request);

    D update(Long id, R request);
}
