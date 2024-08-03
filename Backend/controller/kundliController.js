const { saveKundliData, getKundliDataById } = require('../services/kundliService');
const { fetchEphemerisData, calculateKundli } = require('../services/ephemerisService');
const planetIds = ['199', '299', '399'];

function calculateJulianDate(dob, time) {
  const date = new Date(`${dob}T${time}`);
  const julianDate = date.getTime() / 86400000 + 2440587.5;
  return julianDate;
}

exports.generateKundli = async (req, res) => {
  const { name, dob, time, place } = req.body;

  try {
    const julianDate = calculateJulianDate(dob, time);
    const ephemerisData = await fetchEphemerisData(julianDate, planetIds);
    const kundliDetails = calculateKundli(ephemerisData, place);
console.log(kundliDetails)
    const kundliId = saveKundliData({ name, kundliDetails });
    const resultUrl = `/kundli/result/${kundliId}`;
    res.json({ redirectUrl: resultUrl });
  } catch (error) {
    console.error('Error generating Kundli:', error);
    res.status(500).json({ error: 'Failed to generate Kundli' });
  }
};

exports.showKundliResult = (req, res) => {
  const kundliId = req.params.kundliId;
  const kundliDetails = getKundliDataById(kundliId);

  if (kundliDetails) {
    res.render('kundliresult', { kundliDetails });
  } else {
    res.status(404).send('Kundli not found');
  }
};
