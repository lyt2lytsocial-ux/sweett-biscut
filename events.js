// Sweett Biscut Events — live Outlook calendar feed.
// Published Outlook ICS source. No personal calendar is used.
window.SWEETT_BISCUT_EVENTS = [];
window.SWEETT_BISCUT_EVENTS_READY = false;

(() => {
  const ICS_URL = "/api/calendar";
  const unfold = text => text.replace(/\r?\n[ \t]/g, "");
  const unescapeIcs = value => String(value || "")
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");

  function parseDate(raw) {
    if (!raw) return null;
    const v = raw.trim();
    if (/^\d{8}$/.test(v)) {
      return `${v.slice(0,4)}-${v.slice(4,6)}-${v.slice(6,8)}`;
    }
    const m = v.match(/^(\d{4})(\d{2})(\d{2})T/);
    return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
  }

  function parseTime(raw) {
    if (!raw || !/T\d{4}/.test(raw)) return "";
    const m = raw.match(/T(\d{2})(\d{2})/);
    if (!m) return "";
    let h = Number(m[1]), min = Number(m[2]);
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${String(min).padStart(2,"0")} ${suffix}`;
  }

  function field(block, name) {
    const line = block.split(/\r?\n/).find(l => l.toUpperCase().startsWith(name + ":") || l.toUpperCase().startsWith(name + ";"));
    return line ? line.slice(line.indexOf(":") + 1) : "";
  }

  function parseIcs(text) {
    const data = unfold(text);
    const blocks = data.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];
    return blocks.map(block => {
      const dt = field(block, "DTSTART");
      const title = unescapeIcs(field(block, "SUMMARY")) || "Sweett Biscut Appearance";
      const location = unescapeIcs(field(block, "LOCATION"));
      const description = unescapeIcs(field(block, "DESCRIPTION"));
      const infoUrl = unescapeIcs(field(block, "URL"));
      const date = parseDate(dt);
      return date ? {
        title,
        date,
        time: parseTime(dt),
        venue: location,
        address: "",
        description,
        infoUrl,
        directionsUrl: location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : ""
      } : null;
    }).filter(Boolean);
  }

  async function load() {
    try {
      const response = await fetch(ICS_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Outlook calendar returned ${response.status}`);
      const text = await response.text();
      window.SWEETT_BISCUT_EVENTS = parseIcs(text);
      window.SWEETT_BISCUT_EVENTS_ERROR = "";
    } catch (err) {
      console.warn("Sweett Biscut Outlook calendar could not be refreshed:", err);
      window.SWEETT_BISCUT_EVENTS_ERROR = String(err && err.message ? err.message : err);
    } finally {
      window.SWEETT_BISCUT_EVENTS_READY = true;
      window.dispatchEvent(new CustomEvent("sweettbiscut:events-ready", {
        detail: { events: window.SWEETT_BISCUT_EVENTS, error: window.SWEETT_BISCUT_EVENTS_ERROR || "" }
      }));
    }
  }

  load();
})();
