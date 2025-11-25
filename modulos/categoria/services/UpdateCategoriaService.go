package services

import (
	Entidades "integrador/modulos/categoria/entities"
)

func (s *CategoriaService) UpdateCategoria(novaCategoria *Entidades.Categoria, categoria *Entidades.Categoria) error {

	resultado, err := s.GetCategoriaByName(novaCategoria.Nome)
	if resultado.Nome == novaCategoria.Nome || err == nil {
		if resultado.Nome != categoria.Nome {
			err := erroNome()
			return err
		}
	}
	if categoria.Limite < 0 || categoria.Valor_Esperado < 0 {
		err := erroLimite()
		return err
	}
	return s.repo.Update(categoria)
}
