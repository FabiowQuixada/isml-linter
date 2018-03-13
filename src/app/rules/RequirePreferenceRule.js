module.exports = {
    name: require('path').basename(__filename).slice(0, -3),
    title: 'Use require(\'pref\').get(...)',
    isBroken: line => /.*Resource.msg\(.*_preferences.*/.test(line)
};
