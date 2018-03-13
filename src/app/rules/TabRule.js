module.exports = {
    name: require('path').basename(__filename).slice(0, -3),
    title: 'Usage of tabs',
    isBroken: line => line.indexOf('\t') !== -1
};
