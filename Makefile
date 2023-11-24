.PHONY: build

build: 
	docker build . -t wordlehelper

run: build
	docker run  -p 8080:8081 -it --rm -v $(PWD):/usr/src/app --name wordlehelper wordlehelper

run-detached: build
	docker run -p 8080:8081 -d --rm -v $(PWD):/usr/src/app --name wordlehelper wordlehelper

stop:
	docker stop wordlehelper
