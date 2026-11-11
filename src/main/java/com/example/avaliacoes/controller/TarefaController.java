package com.example.avaliacoes.controller;

import com.example.avaliacoes.model.Tarefa;
import com.example.avaliacoes.service.TarefaService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/tarefas")
public class TarefaController {

    private final TarefaService service;

    public TarefaController(TarefaService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Tarefa cadastrar(@Valid @RequestBody Tarefa tarefa) {
        return service.cadastrar(tarefa);
    }

    @GetMapping
    public List<Tarefa> listar() {
        return service.listar();
    }
}