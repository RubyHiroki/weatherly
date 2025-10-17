const CODE_TO_JA: Record<number, string> = {
  0: '快晴',
  1: '晴れ',
  2: '薄曇り',
  3: '曇り',
  45: '霧',
  48: '霧（樹氷）',
  51: '霧雨（弱）',
  53: '霧雨（中）',
  55: '霧雨（強）',
  56: '着氷性の霧雨（弱）',
  57: '着氷性の霧雨（強）',
  61: '雨（弱）',
  63: '雨（中）',
  65: '雨（強）',
  66: '着氷性の雨（弱）',
  67: '着氷性の雨（強）',
  71: '雪（弱）',
  73: '雪（中）',
  75: '雪（強）',
  77: '霧雪',
  80: 'にわか雨（弱）',
  81: 'にわか雨（中）',
  82: 'にわか雨（強）',
  85: 'にわか雪（弱）',
  86: 'にわか雪（強）',
  95: '雷雨（弱〜中）',
  96: '雷雨（弱〜中＋雹）',
  99: '激しい雷雨（雹）',
};

export function weatherCodeToJa(code: number | null | undefined): string {
  if (code == null) return '--';
  return CODE_TO_JA[code] ?? `不明（${code}）`;
}

export function weatherCodeToEmoji(code: number | null | undefined): string {
  if (code == null) return '⛅️';
  // 簡易対応: WMOコードを代表的な絵文字にマッピング
  if (code === 0) return '☀️';
  if (code === 1) return '🌤️';
  if (code === 2) return '⛅️';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code === 51 || code === 53 || code === 55) return '🌦️';
  if (code === 56 || code === 57) return '🌧️';
  if (code === 61 || code === 63 || code === 65) return '🌧️';
  if (code === 66 || code === 67) return '🌧️';
  if (code === 71 || code === 73 || code === 75 || code === 77) return '🌨️';
  if (code === 80 || code === 81 || code === 82) return '🌦️';
  if (code === 85 || code === 86) return '🌨️';
  if (code === 95 || code === 96 || code === 99) return '⛈️';
  return '⛅️';
}


