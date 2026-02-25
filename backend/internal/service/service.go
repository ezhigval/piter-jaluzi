package service

// Services содержит бизнес-логику приложения
type Services struct {
	repos interface{}
	redis interface{}
	config interface{}
}

// NewServices создает новый экземпляр сервисов
func NewServices(repos interface{}, redis interface{}, config interface{}) *Services {
	return &Services{
		repos: repos,
		redis: redis,
		config: config,
	}
}
