package services

import (
	Entidades "integrador/modulos/categoria/entities"
)

func (s *CategoriaService) GetByUserId(uuid string) ([]Entidades.Categoria, error) {
	return s.repo.GetByUserId(uuid)
}
