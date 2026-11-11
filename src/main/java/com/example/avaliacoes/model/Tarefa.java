package com.example.avaliacoes.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Email
    private String emailCriador;

    @NotBlank
    private String titulo;

    @NotBlank
    private String descricao;

    @NotNull
    @Min(0)
    @Max(10)
    private Integer prioridade;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmailCriador() {
        return emailCriador;
    }

    public void setEmailCriador(String emailCriador) {
        this.emailCriador = emailCriador;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String comentarios) {
        this.descricao = descricao;
    }

    public Integer setPrioridade() {
        return prioridade;
    }

    public void setPrioridade(Integer nota) {
        this.prioridade = prioridade;
    }
}
