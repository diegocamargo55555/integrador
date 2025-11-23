package services

import (
	Entidades "integrador/modulos/categoria/entities"
)

func (s *CategoriaService) UpdateCategoria(categoria *Entidades.Categoria) error {
	return s.repo.Update(categoria)
}
