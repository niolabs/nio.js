install:
	npm install

build:
	./node_modules/.bin/gulp

clean:
	rm -Rf node_modules build

run:
	open http://localhost:3210/examples/
	python -m SimpleHTTPServer 3210
