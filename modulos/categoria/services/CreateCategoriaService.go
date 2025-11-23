package services

import (
	Entidades "integrador/modulos/categoria/entities"
)

func (s *CategoriaService) CreateCategoriaService(categoria *Entidades.Categoria) error {
	return s.repo.Create(categoria)
}
