const GhgCalculation = require('../models/GhgCalculation.model');

// ── Emission Factors (India-based defaults) ───────────────────────────────
const FACTORS = {
  naturalGas: 0.0533,        // tCO2e per MMBtu
  diesel_stationary: 0.00274, // tCO2e per liter
  coal: 2.42,                 // tCO2e per tonne
  petrol_mobile: 0.00230,    // tCO2e per liter
  diesel_mobile: 0.00268,    // tCO2e per liter
  refrigerant_r22: 0.001810, // tCO2e per kg (GWP 1810)
  electricity: 0.00082,      // tCO2e per kWh (India CEA 2023)
  heat_GJ: 0.0566,           // tCO2e per GJ
  air_travel_km: 0.000255,   // tCO2e per passenger-km
  road_travel_km: 0.000171,  // tCO2e per km
  commute_km: 0.000130,      // tCO2e per km
  waste_tonne: 0.52,         // tCO2e per tonne (landfill default)
  purchasedGoods_INR: 0.00025, // tCO2e per INR million
};

function calcScope1(s1) {
  let total = 0;
  if (s1?.stationaryCombustion?.naturalGas?.value)
    total += s1.stationaryCombustion.naturalGas.value * FACTORS.naturalGas;
  if (s1?.stationaryCombustion?.diesel?.value)
    total += s1.stationaryCombustion.diesel.value * FACTORS.diesel_stationary;
  if (s1?.stationaryCombustion?.coal?.value)
    total += s1.stationaryCombustion.coal.value * FACTORS.coal;
  if (s1?.mobileCombustion?.petrol?.value)
    total += s1.mobileCombustion.petrol.value * FACTORS.petrol_mobile;
  if (s1?.mobileCombustion?.diesel?.value)
    total += s1.mobileCombustion.diesel.value * FACTORS.diesel_mobile;
  if (s1?.fugitiveEmissions?.refrigerantLeakage?.value)
    total += s1.fugitiveEmissions.refrigerantLeakage.value * FACTORS.refrigerant_r22;
  return parseFloat(total.toFixed(4));
}

function calcScope2(s2) {
  let total = 0;
  if (s2?.purchasedElectricity?.value) {
    const factor = s2.purchasedElectricity.emissionFactor || FACTORS.electricity * 1000; // stored as kg CO2e/kWh
    total += s2.purchasedElectricity.value * (factor / 1000); // convert to tCO2e
  }
  if (s2?.purchasedHeat?.value) total += s2.purchasedHeat.value * FACTORS.heat_GJ;
  return parseFloat(total.toFixed(4));
}

function calcScope3(s3) {
  let total = 0;
  if (s3?.businessTravel?.airTravel?.value)
    total += s3.businessTravel.airTravel.value * FACTORS.air_travel_km;
  if (s3?.businessTravel?.roadTravel?.value)
    total += s3.businessTravel.roadTravel.value * FACTORS.road_travel_km;
  if (s3?.employeeCommute?.value)
    total += s3.employeeCommute.value * FACTORS.commute_km;
  if (s3?.wasteGenerated?.value)
    total += s3.wasteGenerated.value * FACTORS.waste_tonne;
  if (s3?.purchasedGoods?.value)
    total += s3.purchasedGoods.value * FACTORS.purchasedGoods_INR;
  return parseFloat(total.toFixed(4));
}

// ── Calculate Endpoint ────────────────────────────────────────────────────
exports.calculate = async (req, res) => {
  const { scope1, scope2, scope3, companyName, reportingYear, sessionId } = req.body;

  const s1Total = calcScope1(scope1);
  const s2Total = calcScope2(scope2);
  const s3Total = calcScope3(scope3);
  const grandTotal = parseFloat((s1Total + s2Total + s3Total).toFixed(4));

  const results = { scope1: s1Total, scope2: s2Total, scope3: s3Total, total: grandTotal };

  // Persist calculation
  const calculation = await GhgCalculation.create({
    user: req.user?._id,
    sessionId,
    companyName,
    reportingYear,
    scope1: { ...scope1, totalScope1_tCO2e: s1Total },
    scope2: { ...scope2, totalScope2_tCO2e: s2Total },
    scope3: { ...scope3, totalScope3_tCO2e: s3Total },
    totalEmissions_tCO2e: grandTotal,
    results,
  });

  res.json({ success: true, data: { ...results, id: calculation._id } });
};

// ── Get Past Calculations ─────────────────────────────────────────────────
exports.getHistory = async (req, res) => {
  const filter = req.user ? { user: req.user._id } : { sessionId: req.query.sessionId };
  const calculations = await GhgCalculation.find(filter).sort({ createdAt: -1 }).limit(20);
  res.json({ success: true, data: calculations });
};
