# Minimal Makefile for StreamCherry services
.PHONY: StreamCherryServer StreamCherryWeb lunch-all

StreamCherryServer:
	docker-compose --env-file ./WebServer/config/.env.local up --no-start && \
	docker-compose start app && \
	docker-compose start recommender

StreamCherryWeb:
	cd Web/my-app && npm start

lunch-app: StreamCherryServer StreamCherryWeb  