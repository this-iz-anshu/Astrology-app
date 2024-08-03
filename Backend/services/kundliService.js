const kundliDataStorage = {}; // This could be a database in a real application

function saveKundliData(kundliDetails) {
  const kundliId = Date.now(); // Simple unique ID, replace with a better method in production
  kundliDataStorage[kundliId] = kundliDetails;
  return kundliId;
}

function generateKundliResultUrl(kundliId) {
  return `/kundli/result/${kundliId}`;
}

function getKundliDataById(kundliId) {
  return kundliDataStorage[kundliId];
}

module.exports = { saveKundliData, generateKundliResultUrl, getKundliDataById };
