var deps = require('../deps');
var _ = deps._;
var inherits = deps.inherits;
var Stream = require('../stream');

function GenerateStream(dataTemplate, maxTimes, rate) {
	if (!(this instanceof GenerateStream)) {
		return new GenerateStream(dataTemplate, maxTimes, rate)
	}

	this.dataTemplate = dataTemplate;
	this.maxTimes = maxTimes;
	this.rate = rate;

	this.numIterations = 0;
	this.interval = false;

	_.defaults(this, {
		dataTemplate: {},
		rate: 100,
		maxTimes: 1
	});

	Stream.call(this);
}

inherits(GenerateStream, Stream);

GenerateStream.prototype.oninit = function() {
	this.interval = setInterval(this.generate.bind(this), this.rate);
	return this;
};

GenerateStream.prototype.generate = function() {
	if (this.maxTimes >= 0 && this.numIterations >= this.maxTimes) {
		if (this.interval) {
			clearInterval(this.interval);
		}
	} else {
		this.push(this.getSignal(this.numIterations++));
	}
}

GenerateStream.prototype.getSignal = function(iteration) {
	if (_.isFunction(this.dataTemplate)) {
		return this.dataTemplate(iteration);
	} else {
		return this.dataTemplate;
	}
}

module.exports = GenerateStream;
