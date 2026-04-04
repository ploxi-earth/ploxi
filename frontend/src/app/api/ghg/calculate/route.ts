import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser, jsonOk, jsonError } from '@/lib/auth';

const FACTORS = {
  naturalGas: 0.0533, diesel_stationary: 0.00274, coal: 2.42,
  petrol_mobile: 0.00230, diesel_mobile: 0.00268, refrigerant_r22: 0.001810,
  electricity: 0.00082, heat_GJ: 0.0566, air_travel_km: 0.000255,
  road_travel_km: 0.000171, commute_km: 0.000130, waste_tonne: 0.52,
  purchasedGoods_INR: 0.00025,
};

function calc1(s1: any) {
  let t = 0;
  if (s1?.stationaryCombustion?.naturalGas?.value) t += s1.stationaryCombustion.naturalGas.value * FACTORS.naturalGas;
  if (s1?.stationaryCombustion?.diesel?.value) t += s1.stationaryCombustion.diesel.value * FACTORS.diesel_stationary;
  if (s1?.stationaryCombustion?.coal?.value) t += s1.stationaryCombustion.coal.value * FACTORS.coal;
  if (s1?.mobileCombustion?.petrol?.value) t += s1.mobileCombustion.petrol.value * FACTORS.petrol_mobile;
  if (s1?.mobileCombustion?.diesel?.value) t += s1.mobileCombustion.diesel.value * FACTORS.diesel_mobile;
  if (s1?.fugitiveEmissions?.refrigerantLeakage?.value) t += s1.fugitiveEmissions.refrigerantLeakage.value * FACTORS.refrigerant_r22;
  return +t.toFixed(4);
}

function calc2(s2: any) {
  let t = 0;
  if (s2?.purchasedElectricity?.value) {
    const f = s2.purchasedElectricity.emissionFactor || FACTORS.electricity * 1000;
    t += s2.purchasedElectricity.value * (f / 1000);
  }
  if (s2?.purchasedHeat?.value) t += s2.purchasedHeat.value * FACTORS.heat_GJ;
  return +t.toFixed(4);
}

function calc3(s3: any) {
  let t = 0;
  if (s3?.businessTravel?.airTravel?.value) t += s3.businessTravel.airTravel.value * FACTORS.air_travel_km;
  if (s3?.businessTravel?.roadTravel?.value) t += s3.businessTravel.roadTravel.value * FACTORS.road_travel_km;
  if (s3?.employeeCommute?.value) t += s3.employeeCommute.value * FACTORS.commute_km;
  if (s3?.wasteGenerated?.value) t += s3.wasteGenerated.value * FACTORS.waste_tonne;
  if (s3?.purchasedGoods?.value) t += s3.purchasedGoods.value * FACTORS.purchasedGoods_INR;
  return +t.toFixed(4);
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req); // optional auth
    const { scope1, scope2, scope3, companyName, reportingYear, sessionId } = await req.json();

    const s1 = calc1(scope1), s2 = calc2(scope2), s3 = calc3(scope3);
    const total = +(s1 + s2 + s3).toFixed(4);
    const results = { scope1: s1, scope2: s2, scope3: s3, total };

    const { data: calc } = await supabase.from('ghg_calculations').insert({
      user_id: user?.id || null, session_id: sessionId,
      company_name: companyName, reporting_year: reportingYear,
      scope1: scope1 || {}, scope2: scope2 || {}, scope3: scope3 || {},
      total_scope1_tco2e: s1, total_scope2_tco2e: s2, total_scope3_tco2e: s3,
      total_emissions_tco2e: total, results,
    }).select('id').single();

    return jsonOk({ success: true, data: { ...results, id: calc?.id } });
  } catch (err: any) {
    console.error('GHG calc error:', err);
    return jsonError('Internal server error.', 500);
  }
}
