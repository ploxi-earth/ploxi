const supabase = require('../config/db');

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
    const factor = s2.purchasedElectricity.emissionFactor || FACTORS.electricity * 1000;
    total += s2.purchasedElectricity.value * (factor / 1000);
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

  // Persist to Supabase
  const { data: calculation, error } = await supabase
    .from('ghg_calculations')
    .insert({
      user_id: req.user?.id || req.user?._id || null,
      session_id: sessionId,
      company_name: companyName,
      reporting_year: reportingYear,
      scope1: scope1 || {},
      scope2: scope2 || {},
      scope3: scope3 || {},
      total_scope1_tco2e: s1Total,
      total_scope2_tco2e: s2Total,
      total_scope3_tco2e: s3Total,
      total_emissions_tco2e: grandTotal,
      results,
    })
    .select('id')
    .single();

  if (error) {
    console.error('GHG calculation save error:', error);
    // Still return results even if save fails
    return res.json({ success: true, data: results });
  }

  res.json({ success: true, data: { ...results, id: calculation.id } });
};

// ── Get Past Calculations ─────────────────────────────────────────────────
exports.getHistory = async (req, res) => {
  let query = supabase.from('ghg_calculations').select('*');

  if (req.user) {
    query = query.eq('user_id', req.user.id || req.user._id);
  } else if (req.query.sessionId) {
    query = query.eq('session_id', req.query.sessionId);
  }

  const { data: calculations, error } = await query
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;

  res.json({ success: true, data: calculations || [] });
};
