var aoi = ee.FeatureCollection("projects/ee-riyadesdm7/assets/Subornochor"),
    geometry = /* color: #d63000 */ee.Geometry.Point([91.01, 22.57]);

// Load Sentinel-1 SAR data (VV, VH polarizations)
var sentinel1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(aoi)
  .filterDate('2023-03-01', '2023-05-31')  // Change to desired date range
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
  .select(['VV', 'VH']);

// Get a median composite for the selected time period
var image = sentinel1.mean().clip(aoi);

// Polarization combinations

// 1. VV
var VV = image.select('VV');

// 2. VV + VH
var VV_VH = image.select('VV').add(image.select('VH'));

// 3. VV^2 + VH
var VV2_VH = image.select('VV').pow(2).add(image.select('VH'));

// 4. (VH^2 + VV^2) / VH
var VH2_VV2_div_VH = image.select('VH').pow(2).add(image.select('VV').pow(2))
                  .divide(image.select('VH'));

// 5. 10 * log10(VV)
var log_VV = image.select('VV').multiply(-10);

var log_VV = log_VV.log10()

// 6. VH
var VH = image.select('VH');

// 7. VV^2 + VH^2
var VV2_VH2 = image.select('VV').pow(2).add(image.select('VH').pow(2));

// 8. VH^2 - VV
var VH2_minus_VV = image.select('VH').pow(2).subtract(image.select('VV'));

// 9. 10 * log10(VH)
var log_VH = image.select('VH').multiply(-10);
var log_VH = log_VH.log10()

// 10. 10 * log10(VV) + 10 * log10(VH)
var log_VV_log_VH = log_VV.add(log_VH);

// Visualize the combinations
Map.centerObject(aoi, 10);
Map.addLayer(VV, {min: -25, max: 0}, 'VV');
Map.addLayer(VV_VH, {min: -25, max: 0}, 'VV + VH');
Map.addLayer(VV2_VH, {min: -25, max: 0}, 'VV^2 + VH');
Map.addLayer(VH2_VV2_div_VH, {min: -25, max: 0}, '(VH^2 + VV^2) / VH');
Map.addLayer(log_VV, {min: -25, max: 0}, '10 * log(VV)');
Map.addLayer(VH, {min: -25, max: 0}, 'VH');
Map.addLayer(VV2_VH2, {min: -25, max: 0}, 'VV^2 + VH^2');
Map.addLayer(VH2_minus_VV, {min: -25, max: 0}, 'VH^2 - VV');
Map.addLayer(log_VH, {min: -25, max: 0}, '10 * log(VH)');
Map.addLayer(log_VV_log_VH, {min: -25, max: 0}, '10 * log(VV) + 10 * log(VH)');

// Export the results
Export.image.toDrive({
  image: VV,
  description: 'VV',
  folder: 'Sentinel 1C',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

Export.image.toDrive({
  image: VV_VH,
  description: 'VV_VH',
  folder: 'Sentinel 1C',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

Export.image.toDrive({
  image: VV2_VH,
  description: 'VV2_VH',
  folder: 'Sentinel 1C',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

Export.image.toDrive({
  image: VH2_VV2_div_VH,
  description: 'VH2_VV2_div_VH',
  folder: 'Sentinel 1C',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

Export.image.toDrive({
  image: log_VV,
  description: 'log_VV',
  folder: 'Sentinel 1C',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

Export.image.toDrive({
  image: VH,
  description: 'VH',
  folder: 'Sentinel 1C',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

Export.image.toDrive({
  image: VV2_VH2,
  description: 'VV2_VH2',
  folder: 'Sentinel 1C',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

Export.image.toDrive({
  image: VH2_minus_VV,
  description: 'VH2_minus_VVlog_VH',
  folder: 'Sentinel 1C',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

Export.image.toDrive({
  image: log_VH,
  description: 'log_VH',
  folder: 'Sentinel 1C',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

Export.image.toDrive({
  image: log_VV_log_VH,
  description: 'log_VV_log_VH',
  folder: 'Sentinel 1C',
  scale: 10,
  region: aoi,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});
