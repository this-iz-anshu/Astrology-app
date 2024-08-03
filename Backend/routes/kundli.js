const { saveKundliData, getKundliDataById } = require('../services/kundliService');
const { fetchEphemerisData, calculateKundli } = require('../services/ephemerisService');

function calculateJulianDate(dob, time) {
  // Implement the logic to calculate Julian Date from dob and time
  const date = new Date(`${dob}T${time}`);
  const julianDate = date.getTime() / 86400000 + 2440587.5;
  return julianDate;
}

exports.generateKundli = async (req, res) => {
  const { name, dob, time, place } = req.body;

  try {
    const julianDate = calculateJulianDate(dob, time);
    const ephemerisData = await fetchEphemerisData(julianDate);
    const kundliDetails = calculateKundli(ephemerisData, place);

    const kundliId = saveKundliData({ name, kundliDetails });
    const resultUrl = `/kundli/result/${kundliId}`;
    console.log('Redirect URL:', resultUrl);
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
    console.log(kundliDetails);
  } else {
    res.status(404).send('Kundli not found');
  }
};

const express = require('express');
const router = express.Router();
const kundliController = require('../controller/kundliController');

// Define route to handle Kundli generation
router.post('/generate-kundli', kundliController.generateKundli);

module.exports = router;
