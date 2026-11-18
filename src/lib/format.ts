const dayNames: Record<string, string> = {
  Mo: "Mon",
  Tu: "Tue",
  We: "Wed",
  Th: "Thu",
  Fr: "Fri",
  Sa: "Sat",
  Su: "Sun",
};

/** "Mo-Fr" → "Mon–Fri" */
export const formatDays = (days: string) =>
  days
    .split("-")
    .map((d) => dayNames[d] ?? d)
    .join("–");

/** "07:00" → "7am", "17:30" → "5:30pm" */
export const formatTime = (t: string) => {
  const [h = 0, m = 0] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, "0")}${suffix}` : `${hour}${suffix}`;
};

/** "City, CA 90000" as one string, so formatters can't collapse the spaces. */
export const formatCityLine = (a: { locality: string; region: string; postalCode: string }) =>
  `${a.locality}, ${a.region} ${a.postalCode}`;

export const formatHours = (h: { days: string; open: string; close: string }) =>
  `${formatDays(h.days)} ${formatTime(h.open)}–${formatTime(h.close)}`;
