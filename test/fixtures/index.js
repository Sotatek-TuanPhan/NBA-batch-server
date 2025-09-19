const { forOwn } = require('mout/object');

const fixtureNames = [
  require('./game'),
  require('./news'),
  require('./integration_settings'),
];

const fixtures = [];

fixtureNames.forEach((fixtureName) => {
  forOwn(fixtureName, (data, modelName) => {
    data.forEach((rec) => {
      fixtures.push({
        model: modelName,
        data: rec,
      });
    });
  });
});

module.exports = fixtures;
