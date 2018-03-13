module.exports = {
    name: require('path').basename(__filename).slice(0, -3),
    title: 'Wrap expression in <isprint> tag',
    isBroken: line => line.indexOf('>${') !== -1 || line.indexOf(' ${') !== -1
};
