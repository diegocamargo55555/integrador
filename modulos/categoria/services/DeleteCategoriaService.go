package services

func (s *CategoriaService) DeleteCategoria(uuid string) error {
	return s.repo.Delete(uuid)
}
