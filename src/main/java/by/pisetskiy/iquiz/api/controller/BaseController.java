package by.pisetskiy.iquiz.api.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static by.pisetskiy.iquiz.api.RestEndpoints.ID;

public interface BaseController<D, R> {

    @GetMapping
    List<D> findAll(@RequestParam Map<String, String> params);

    @GetMapping(ID)
    D findById(@PathVariable Long id);

    @PostMapping
    D create(@RequestBody R request);

    @PostMapping(ID)
    D update(@PathVariable Long id, @RequestBody R request);
}
