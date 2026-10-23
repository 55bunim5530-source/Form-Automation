// Plain-text only: never serialize signatures, attachments or arbitrary objects.
export function value(input, fallback = '[입력 필요]') {
  if (typeof input !== 'string' && typeof input !== 'number') return fallback;
  const result = String(input).replace(/\r\n?/g, '\n').trim();
  return result || fallback;
}

export function join(inputs, separator = ', ', fallback = '[입력 필요]') {
  const parts = (Array.isArray(inputs) ? inputs : []).map(input => value(input, '')).filter(Boolean);
  return parts.length ? parts.join(separator) : fallback;
}

export function date(input, fallback = '[날짜 입력]') {
  const raw = value(input, '');
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(raw);
  if (!match) return raw || fallback;
  const [, y, m, d, hours, minutes] = match;
  return `${y}. ${Number(m)}. ${Number(d)}.${hours ? ` ${hours}:${minutes}` : ''}`;
}

export function dateList(inputs, fallback = '[기간 입력]') {
  const dates = [...new Set((Array.isArray(inputs) ? inputs : []).map(input => value(input, '')).filter(Boolean))];
  if (!dates.length) return fallback;
  if (!dates.every(item => /^\d{4}-\d{2}-\d{2}$/.test(item))) return dates.map(item => date(item)).join(', ');
  dates.sort();
  if (dates.length === 1) return date(dates[0]);
  return `${date(dates[0])} ~ ${date(dates[dates.length - 1])} (실시일: ${dates.map(item => date(item)).join(', ')})`;
}

export function monthLabel(inputs, fallback = '[대상 기간 입력]') {
  const months = [...new Set((Array.isArray(inputs) ? inputs : []).map(input => value(input, '')).filter(input => /^\d{4}-\d{2}-\d{2}$/.test(input)).map(input => input.slice(0, 7)))].sort();
  const label = item => `${item.slice(0, 4)}년 ${Number(item.slice(5))}월`;
  if (!months.length) return fallback;
  return months.length === 1 ? label(months[0]) : `${label(months[0])} ~ ${label(months[months.length - 1])}`;
}
