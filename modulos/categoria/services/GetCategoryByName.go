package services

import (
	Entidades "integrador/modulos/categoria/entities"
)

func (s *CategoriaService) GetCategoriaByName(name string) (*Entidades.Categoria, error) {
	return s.repo.GetByName(name)
}
