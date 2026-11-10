package com.example.avaliacoes.service;

import com.example.avaliacoes.model.Avaliacao;
import com.example.avaliacoes.repository.AvaliacaoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AvaliacaoService {

    private final AvaliacaoRepository repository;

    public AvaliacaoService(AvaliacaoRepository repository) {
        this.repository = repository;
    }

    public Avaliacao cadastrar(Avaliacao avaliacao) {
        avaliacao.setId(null);
        avaliacao.setDataAvaliacao(LocalDate.now());
        return repository.save(avaliacao);
    }

    public List<Avaliacao> listar() {
        return repository.findAll();
    }
}