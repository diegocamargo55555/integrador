package services

import (
	Entidades "integrador/modulos/categoria/entities"
)

func (s *CategoriaService) GetCategoriaById(uuid string) (*Entidades.Categoria, error) {
	return s.repo.GetByID(uuid)
}
