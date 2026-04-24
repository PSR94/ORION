.PHONY: help up down build seed test logs

help:
	@echo "ORION: Enterprise AI AgentOps Control Plane"
	@echo "Usage:"
	@echo "  make up      - Start the platform"
	@echo "  make down    - Stop the platform"
	@echo "  make build   - Rebuild containers"
	@echo "  make seed    - Populate database with realistic data"
	@echo "  make test    - Run backend tests"
	@echo "  make logs    - Tail logs"

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build

seed:
	docker-compose exec api python scripts/seed.py

test:
	docker-compose exec api pytest

logs:
	docker-compose logs -f
