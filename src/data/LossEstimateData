const generateData = () => {
  const years = Array.from({ length: 26 }, (_, i) => 1995 + i);
  const totalDeaths = {
    'Cyclones': 40297,
    'Heat Waves': 25628,
    'Cold Waves': 19181,
    'Flood': 27318
  };
  
  return years.map(year => ({
    year,
    'Cyclones': Math.floor(totalDeaths['Cyclones'] / 26),
    'Heat Waves': Math.floor(totalDeaths['Heat Waves'] / 26),
    'Cold Waves': Math.floor(totalDeaths['Cold Waves'] / 26),
    'Flood': Math.floor(totalDeaths['Flood'] / 26),
    combinedCost: Math.floor(Math.random() * 100000) + 5000, // Placeholder cost in crores of INR
    totalDeaths: 
      Math.floor(totalDeaths['Cyclones'] / 26) +
      Math.floor(totalDeaths['Heat Waves'] / 26) +
      Math.floor(totalDeaths['Cold Waves'] / 26) +
      Math.floor(totalDeaths['Flood'] / 26)
  }));
};

const climateDisasterData = generateData();

export default climateDisasterData;

