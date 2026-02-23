/**
 * Parse a date string as local time (not UTC).
 * "2026-02-23" → Feb 23 local, not Feb 22 due to UTC offset.
 */
export function parseLocalDate(dateStr: string): Date {
  // If it's just YYYY-MM-DD, append T00:00:00 to force local parse
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr + "T00:00:00");
  }
  return new Date(dateStr);
}
