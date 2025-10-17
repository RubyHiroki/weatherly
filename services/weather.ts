export type GeocodeResult = { latitude: number; longitude: number; name: string };
export type Current = { temperatureC: number; windSpeedMs: number; weatherCode: number; timeIso: string };
export type Daily = { dateIso: string; tMaxC: number; tMinC: number; weatherCode: number };

const GEOCODE = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST = 'https://api.open-meteo.com/v1/forecast';

function stripSuffix(s: string): string {
  return s
    .replace(/(都|道|府|県)$/u, '')
    .replace(/(市|区|町|村)$/u, '');
}

function buildCandidates(inputRaw: string): string[] {
  const input = inputRaw.trim().replace(/\s+/g, ' ');
  const parts = input.split(' ');
  const candidates: string[] = [];
  if (parts.length >= 2) {
    const pref = parts[0];
    const city = parts.slice(1).join(' ');
    const prefStripped = stripSuffix(pref);
    const cityStripped = stripSuffix(city);
    candidates.push(`${city} ${pref}`);
    candidates.push(`${cityStripped} ${prefStripped}`);
    candidates.push(`${city}`);
    candidates.push(`${cityStripped}`);
    candidates.push(`${city}, ${pref}`);
    candidates.push(`${cityStripped}, ${prefStripped}`);
    candidates.push(`${pref} ${city}`);
  } else {
    const one = parts[0] || input;
    candidates.push(one);
    candidates.push(stripSuffix(one));
  }
  // Ensure uniqueness & non-empty
  return Array.from(new Set(candidates.filter(Boolean)));
}

export async function geocode(query: string): Promise<GeocodeResult> {
  const attempts = buildCandidates(query);
  for (const q of attempts) {
    const url = `${GEOCODE}?name=${encodeURIComponent(q)}&count=1&language=ja&format=json&country=JP`;
    const res = await fetch(url);
    if (!res.ok) continue;
    const json = await res.json();
    const first = json?.results?.[0];
    if (first) {
      return { latitude: Number(first.latitude), longitude: Number(first.longitude), name: String(first.name) };
    }
  }
  // Final fallback: try original with country=JP
  const fallbackUrl = `${GEOCODE}?name=${encodeURIComponent(query)}&count=1&language=ja&format=json&country=JP`;
  const fallbackRes = await fetch(fallbackUrl);
  if (fallbackRes.ok) {
    const json = await fallbackRes.json();
    const first = json?.results?.[0];
    if (first) {
      return { latitude: Number(first.latitude), longitude: Number(first.longitude), name: String(first.name) };
    }
  }
  throw new Error('該当する地域が見つかりません');
}

export async function fetchCurrent(lat: number, lon: number): Promise<Current> {
  const url = `${FORECAST}?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('現在の天気の取得に失敗しました');
  const json = await res.json();
  const cur = json?.current;
  if (!cur) throw new Error('現在の天気データがありません');
  return {
    temperatureC: Number(cur.temperature_2m),
    windSpeedMs: Number(cur.wind_speed_10m),
    weatherCode: Number(cur.weather_code),
    timeIso: String(cur.time),
  };
}

export async function fetchDaily(lat: number, lon: number): Promise<Daily[]> {
  const url = `${FORECAST}?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('週間予報の取得に失敗しました');
  const json = await res.json();
  const days = json?.daily;
  if (!days) throw new Error('週間予報データがありません');
  const out: Daily[] = [];
  const len = Math.min(days.time?.length ?? 0, days.weather_code?.length ?? 0);
  for (let i = 0; i < len; i++) {
    out.push({
      dateIso: String(days.time[i]),
      weatherCode: Number(days.weather_code[i]),
      tMaxC: Number(days.temperature_2m_max[i]),
      tMinC: Number(days.temperature_2m_min[i]),
    });
  }
  return out;
}


