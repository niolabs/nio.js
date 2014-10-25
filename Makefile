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

vendor:
	curl https://raw.githubusercontent.com/Polymer/webcomponentsjs/master/CustomElements.js > src/vendor/CustomElements.js
	curl https://raw.githubusercontent.com/github/time-elements/master/time-elements.js > src/vendor/time-elements.js
