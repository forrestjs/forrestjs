'use strict';

require('@babel/polyfill');

require('./build-ssr/boot').default().catch(function (err) {
    console.log('*** BOOT: Fatal Error');
    console.log(err);
});
