/* eslint-disable */

'use strict';

require('@babel/polyfill');

require('./build-ssr/boot').default().catch(function (err) {
    console.log('*** BOOT: Fatal Error');
    console.log(err);
});

// Let Docker exit on Ctrl+C
process.on('SIGINT', function() {
    process.exit();
});
