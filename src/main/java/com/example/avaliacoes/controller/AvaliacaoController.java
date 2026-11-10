package com.example.avaliacoes.controller;

import com.example.avaliacoes.model.Avaliacao;
import com.example.avaliacoes.service.AvaliacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService service;

    public AvaliacaoController(AvaliacaoService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Avaliacao cadastrar(@Valid @RequestBody Avaliacao avaliacao) {
        return service.cadastrar(avaliacao);
    }

    @GetMapping
    public List<Avaliacao> listar() {
        return service.listar();
    }
}