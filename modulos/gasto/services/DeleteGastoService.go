package services

func (s *GastoService) DeleteGasto(uuid string) error {
	return s.repo.Delete(uuid)
}
