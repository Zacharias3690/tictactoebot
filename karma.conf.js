module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
        files: [
            './src/*.js'
        ],
        reporters: ['coverage', 'progress'],
        coverageReporter: {
            dir: 'coverage',
            reporters: [
                { type: 'text-summary' }
            ]
        },
        browserDisconnectTimeout: 10000,
        browserDisconnectTolerance: 1,
        browserNoActivityTimeout: 60000
    });
};
