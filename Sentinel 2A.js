var aoi = ee.FeatureCollection("projects/ee-riyadesdm7/assets/Subornochor");

// Define the date range for image collection
var startDate = '2023-03-01';
var endDate = '2023-05-31';

// Load Sentinel-2 surface reflectance collection
var image = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
            .filterBounds(aoi)
            .filterDate(startDate, endDate)
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5)) // Filter by cloud cover
            .mean() // Get mean composite
            .clip(aoi);

// Define bands needed for indices
var B2 = image.select('B2'); // Blue
var B3 = image.select('B3'); // Green
var B4 = image.select('B4'); // Red
var B5_20m = image.select('B5'); // Red Edge 1
var B6_20m = image.select('B6'); // Red Edge 2
var B7_20m = image.select('B7'); // Red Edge 3
var B8 = image.select('B8'); // NIR


// Resample the 20m band to 10m resolution using nearest-neighbor interpolation
var B5 = B5_20m.resample('bilinear').reproject({
  crs: image.select('B2').projection(),  // Use the 10m bands' projection
  scale: 10                           // Set scale to 10 meters
});

var B6 = B6_20m.resample('bilinear').reproject({
  crs: image.select('B2').projection(),  // Use the 10m bands' projection
  scale: 10                           // Set scale to 10 meters
});

var B7 = B7_20m.resample('bilinear').reproject({
  crs: image.select('B2').projection(),  // Use the 10m bands' projection
  scale: 10                           // Set scale to 10 meters
});


//Calculate Indices

// NDVI
var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');

// GNDVI
var gndvi = image.normalizedDifference(['B7', 'B3']).rename('GNDVI');

// WDVI
var wdvi = image.expression(
    'B8 - 0.5 * B4', {
      'B8': B8,
      'B4': B4
    }).rename('WDVI');

// TNDVI
var tndvi = image.expression(
    'sqrt((B8 - B4) / (B8 + B4) + 0.5)', {
      'B8': B8,
      'B4': B4
    }).rename('TNDVI');

// SAVI
var savi = image.expression(
    '((B8 - B4) / (B8 + B4 + 0.5)) * 1.5', {
      'B8': B8,
      'B4': B4
    }).rename('SAVI');

// IPVI
var ipvi = image.expression(
    'B8 / (B8 + B4)', {
      'B8': B8,
      'B4': B4
    }).rename('IPVI');

// MCARI
var mcari = image.expression(
    '((B5 - B4) - 0.2 * (B5 - B3)) * (B5 / B4)', {
      'B5': B5,
      'B4': B4,
      'B3': B3
    }).rename('MCARI');

// REIP
var reip = image.expression(
    '700 + 40 * ((B4 + B7) / 2 - B5) / (B6 - B5)', {
      'B4': B4,
      'B5': B5,
      'B6': B6,
      'B7': B7
    }).rename('REIP');

// MSAVI2
var msavi2 = image.expression(
    '(2 * B8 + 1 - sqrt((2 * B8 + 1) ** 2 - 8 * (B8 - B4))) / 2', {
      'B8': B8,
      'B4': B4
    }).rename('MSAVI2');

// DVI
var dvi = image.expression(
  'B8 - B4', {
      'B8': B8,
      'B4': B4
    }).rename('DVI');


// Display the results
Map.centerObject(aoi, 10);
Map.addLayer(ndvi, {min: 0, max: 1, palette: ['red', 'yellow', 'green']}, 'NDVI');
Map.addLayer(gndvi, {min: 0, max: 1, palette: ['red', 'yellow', 'green']}, 'GNDVI');
Map.addLayer(wdvi, {min: 0, max: 1, palette: ['red', 'yellow', 'green']}, 'WDVI');
Map.addLayer(tndvi, {min: 0, max: 1, palette: ['red', 'yellow', 'green']}, 'TNDVI');
Map.addLayer(savi, {min: 0, max: 1, palette: ['red', 'yellow', 'green']}, 'SAVI');
Map.addLayer(ipvi, {min: 0, max: 1, palette: ['red', 'yellow', 'green']}, 'IPVI');
Map.addLayer(mcari, {min: 0, max: 3, palette: ['blue', 'white', 'green']}, 'MCARI');
Map.addLayer(reip, {min: 700, max: 750, palette: ['blue', 'white', 'green']}, 'REIP');
Map.addLayer(msavi2, {min: 0, max: 1, palette: ['red', 'yellow', 'green']}, 'MSAVI2');
Map.addLayer(dvi, {min: 0, max: 1, palette: ['red', 'yellow', 'green']}, 'DVI');

// Export the results
Export.image.toDrive({
  image: ndvi,
  description: 'ndvi',
  folder: 'Sentinel 2A',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});mcari

// Export the results
Export.image.toDrive({
  image: gndvi,
  description: 'gndvi',
  folder: 'Sentinel 2A',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// Export the results
Export.image.toDrive({
  image: wdvi,
  description: 'wdvi',
  folder: 'Sentinel 2A',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// Export the results
Export.image.toDrive({
  image: tndvi,
  description: 'tndvi',
  folder: 'Sentinel 2A',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// Export the results
Export.image.toDrive({
  image: savi,
  description: 'savi',
  folder: 'Sentinel 2A',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// Export the results
Export.image.toDrive({
  image: ipvi,
  description: 'ipvi',
  folder: 'Sentinel 2A',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// Export the results
Export.image.toDrive({
  image: mcari,
  description: 'mcari',
  folder: 'Sentinel 2A',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// Export the results
Export.image.toDrive({
  image: reip,
  description: 'reip',
  folder: 'Sentinel 2A',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// Export the results
Export.image.toDrive({
  image: msavi2,
  description: 'msavi2',
  folder: 'Sentinel 2A',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// Export the results
Export.image.toDrive({
  image: dvi,
  description: 'dvi',
  folder: 'Sentinel 2A',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});