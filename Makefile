install:
	npm install
	./node_modules/.bin/bower install
	./node_modules/.bin/gulp

build:
	./node_modules/.bin/gulp build

watch:
	./node_modules/.bin/gulp watch

clean:
	rm -Rf node_modules components build .sass-cache

rebuild: clean build

run:
	python -m SimpleHTTPServer 8001

.PHONY: build watch run
