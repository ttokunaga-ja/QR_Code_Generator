FRONTEND_DIR := frontend
BACKEND_DIR := backend

.PHONY: frontend-install frontend-build backend-build build docker-build clean

frontend-install:
	cd $(FRONTEND_DIR) && npm ci

frontend-build: frontend-install
	cd $(FRONTEND_DIR) && npm run build

backend-build:
	mkdir -p $(BACKEND_DIR)/bin
	cd $(BACKEND_DIR) && go build -o bin/server ./server

build: frontend-build backend-build

docker-build:
	docker compose build

clean:
	rm -rf $(FRONTEND_DIR)/node_modules $(FRONTEND_DIR)/build $(BACKEND_DIR)/bin
