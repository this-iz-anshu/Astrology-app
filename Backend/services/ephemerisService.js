const axios = require('axios');

async function fetchEphemerisData(julianDate, planetIds) {
  try {
    if (!Array.isArray(planetIds) || planetIds.length === 0) {
      throw new Error('Invalid planetIds array');
    }

    const startDate = new Date((julianDate - 2440587.5) * 86400000).toISOString().split('T')[0];
    console.log('Fetching data for Julian Date:', julianDate);
    console.log('Planet IDs:', planetIds);

    // Fetch data for all specified planet IDs
    const requests = planetIds.map(planetId => {
      const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='${planetId}'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='500@10'&START_TIME='${startDate}'&STOP_TIME='${startDate}'&STEP_SIZE='1%20d'`;
      console.log('Request URL:', url);
      return axios.get(url).then(response => parseEphemerisData(response.data, planetId));
    });

    // Await all requests
    const results = await Promise.all(requests);
    
    // Combine results into a single array
    const combinedResults = results.flat();
    console.log('Combined Results:', combinedResults);
    return combinedResults;

  } catch (error) {
    console.error('Failed to fetch ephemeris data:', error);
    throw error;
  }
}

function parseEphemerisData(data, planetId) {
  console.log(`Parsing data for planet ID ${planetId}`);
  const lines = data.split('\n').map(line => line.trim());

  const startIndex = lines.indexOf('$$SOE');
  const endIndex = lines.indexOf('$$EOE');

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('Ephemeris data markers not found in data');
  }

  const dataLines = lines.slice(startIndex + 1, endIndex).filter(line => line);

  console.log('Data Lines:', dataLines);

  const records = dataLines.map(line => {
    const columns = line.split(/\s{2,}/);

    if (columns.length < 7) {
      console.warn('Skipping line with insufficient columns:', line);
      return null;
    }

    const [date, x, y, z, vx, vy, vz] = columns;

    return {
      planetId,
      date: date.trim(),
      x: parseFloat(x.trim()),
      y: parseFloat(y.trim()),
      z: parseFloat(z.trim()),
      vx: parseFloat(vx.trim()),
      vy: parseFloat(vy.trim()),
      vz: parseFloat(vz.trim())
    };
  }).filter(record => record !== null);

  console.log('Parsed Records:', records);
  return records;
}

function calculateKundli(records, place) {
  console.log('Calculating Kundli with records:', records);
  return {
    kundli: 'Kundli Data Here',
    planetaryPositions: records,
    lagnaChart: 'Lagna Chart Data Here'
  };
}

module.exports = { fetchEphemerisData, calculateKundli, parseEphemerisData };
