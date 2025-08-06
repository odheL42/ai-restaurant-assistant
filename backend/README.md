
# Backend

## Перед запуском

> Все команды выполняются из директории `backend`.

1. Создайте и заполните файл `.env` на основе `.env.example`.
2. Настройте проект, отредактировав файл `config.yaml`.

## Запуск

```bash
uv run -m src.main
```

## Тесты

### Unit-тесты

```bash
uv run -m pytest -m unit
```

### Интеграционные тесты

```bash
uv run -m pytest -m integration
```
