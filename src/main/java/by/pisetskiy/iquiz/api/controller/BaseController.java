package by.pisetskiy.iquiz.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import static by.pisetskiy.iquiz.api.RestEndpoints.ID;

public interface BaseController<D, R> {

    List<D> findAll();

    @GetMapping(ID)
    D findById(@PathVariable Long id);

    @PostMapping
    D create(@RequestBody R request);

    @PostMapping(ID)
    D update(@PathVariable Long id, @RequestBody R request);
}
