package com.example.avaliacoes.repository;

import com.example.avaliacoes.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
}