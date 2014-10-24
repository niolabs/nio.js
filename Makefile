all: clean install build run

clean:
	rm -Rf node_modules build

install:
	npm install

build:
	./node_modules/.bin/gulp

run:
	open http://localhost:3210/examples/
	python -m SimpleHTTPServer 3210
