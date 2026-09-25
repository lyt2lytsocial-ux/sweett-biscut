const ICS_URL =
  "https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/ca3c9ce8-69fd-4c28-a628-81fa57859410/cid-5125C2BA5167C7E3/calendar.ics";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/calendar") {
      try {
        const response = await fetch(ICS_URL, {
          headers: {
            "User-Agent": "Sweett-Biscut-Calendar/1.0"
          }
        });

        if (!response.ok) {
          return new Response("Calendar unavailable", {
            status: 502
          });
        }

        const calendar = await response.text();

        return new Response(calendar, {
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Cache-Control": "public, max-age=300"
          }
        });
      } catch {
        return new Response("Calendar unavailable", {
          status: 502
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
