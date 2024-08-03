const axios = require('axios');

async function fetchEphemerisData(julianDate) {
  try {
    // Convert Julian date to the required format
    const startDate = new Date((julianDate - 2440587.5) * 86400000).toISOString().split('T')[0];
    const url = `https://ssd.jpl.nasa.gov/horizons_batch.cgi?batch=1&COMMAND='499'&CENTER='500@399'&START_TIME='${startDate}'&STOP_TIME='${startDate}'&STEP_SIZE='1 d'&QUANTITIES='1,9'&CSV_FORMAT='YES'`;
    const response = await axios.get(url);

    if (response.status === 200) {
      console.log('Raw Data:', response.data); // Log the raw data
      return parseEphemerisData(response.data);
    } else {
      throw new Error(`Error fetching data: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to fetch ephemeris data:', error);
    throw error;
  }
}

function parseEphemerisData(data) {
  const lines = data.split('\n');
  const startLineIndex = lines.findIndex(line => line.includes('$$SOE'));
  const endLineIndex = lines.findIndex(line => line.includes('$$EOE'));

  if (startLineIndex === -1 || endLineIndex === -1) {
    throw new Error('Ephemeris data markers not found in data');
  }

  const headerLine = lines[startLineIndex + 1];
  const dataLines = lines.slice(startLineIndex + 2, endLineIndex).filter(line => line.trim() !== '');

  const records = parse([headerLine, ...dataLines].join('\n'), {
    columns: true,
    skip_empty_lines: true
  });

  const planetaryPositions = records.map(record => ({
    date: record['Date (UT)'],
    planet: record['Target body'],
    position: {
      x: parseFloat(record['X (AU)']),
      y: parseFloat(record['Y (AU)']),
      z: parseFloat(record['Z (AU)'])
    }
  }));

  return planetaryPositions;
}

function calculateKundli(ephemerisData, place) {
  return {
    kundli: 'Kundli Data Here',
    planetaryPositions: ephemerisData,
    lagnaChart: 'Lagna Chart Data Here'
  };
}

module.exports = { fetchEphemerisData, calculateKundli, parseEphemerisData };
