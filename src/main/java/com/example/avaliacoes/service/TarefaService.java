package com.example.avaliacoes.service;

import com.example.avaliacoes.model.Tarefa;
import com.example.avaliacoes.repository.TarefaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TarefaService {

    private final TarefaRepository repository;

    public TarefaService(TarefaRepository repository) {
        this.repository = repository;
    }

    public Tarefa cadastrar(Tarefa tarefa) {
        tarefa.setId(null);
        return repository.save(tarefa);
    }

    public List<Tarefa> listar() {
        return repository.findAll();
    }
}