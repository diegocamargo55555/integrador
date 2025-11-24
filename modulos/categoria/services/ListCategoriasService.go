package services

import (
	Entidades "integrador/modulos/categoria/entities"
)

func (s *CategoriaService) GetAllCategorias() ([]Entidades.Categoria, error) {
	return s.repo.GetAll()
}
