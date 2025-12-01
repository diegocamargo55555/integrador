package service

func (s *PlanejamentoService) DeletePlanejamento(uuid string) error {
	return s.repo.Delete(uuid)
}
