module.exports = {
    name: require('path').basename(__filename).slice(0, -3),
    title: 'Use class "hidden"',
    isBroken: line => line.indexOf('display: none') !== -1 || line.indexOf('display:none') !== -1
};
