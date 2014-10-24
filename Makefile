install:
	npm install
	./node_modules/.bin/bower install
	./node_modules/.bin/gulp build

clean:
	rm -Rf node_modules build
