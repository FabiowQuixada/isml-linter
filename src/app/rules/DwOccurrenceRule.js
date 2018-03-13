module.exports = {
    name: require('path').basename(__filename).slice(0, -3),
    title: 'Direct call to the "dw" package',
    isBroken: line => line.indexOf('dw.') !== -1
};
