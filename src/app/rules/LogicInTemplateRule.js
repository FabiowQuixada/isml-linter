module.exports = {
    name: require('path').basename(__filename).slice(0, -3),
    title: 'Avoid putting logic into ISML',
    isBroken: line => line.indexOf('<isscript>') !== -1
};
