module.exports = {
    name: require('path').basename(__filename).slice(0, -3),
    title: 'Usage of importPackage()',
    isBroken: line => line.indexOf('importPackage') !== -1
};
