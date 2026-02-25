package repository

// Repositories содержит репозитории для работы с данными
type Repositories struct {
	db interface{}
}

// NewRepositories создает новый экземпляр репозиториев
func NewRepositories(db interface{}) *Repositories {
	return &Repositories{
		db: db,
	}
}
