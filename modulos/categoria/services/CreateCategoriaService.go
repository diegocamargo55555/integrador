package services

import (
	Entidades "integrador/modulos/categoria/entities"
)

func (s *CategoriaService) CreateCategoriaService(categoria *Entidades.Categoria) error {
	resultado, err := s.GetCategoriaByName(categoria.Nome)
	if resultado.Nome == categoria.Nome || err == nil {
		err := erroNome()
		return err
	}
	if categoria.Limite < 0 || categoria.Valor_Esperado < 0 {
		err := erroLimite()
		return err
	}
	return s.repo.Create(categoria)
}
