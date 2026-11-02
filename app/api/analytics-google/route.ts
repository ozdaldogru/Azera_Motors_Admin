import { BetaAnalyticsDataClient } from '@google-analytics/data';

const normalizePrivateKey = (value: string) =>
  value
    .trim()
    .replace(/^["']/, '')
    .replace(/["']$/, '')
    .replace(/\\n/g, '\n');

export async function GET(request: Request) {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    const privateKey = process.env.GA_PRIVATE_KEY;

    if (!propertyId || !clientEmail || !privateKey) {
      return new Response(JSON.stringify({
        error: 'Google Analytics is not configured. Set GA_PROPERTY_ID, GA_CLIENT_EMAIL, and GA_PRIVATE_KEY.',
      }), {
        headers: { "Content-Type": "application/json" },
        status: 503,
      });
    }

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: normalizePrivateKey(privateKey),
      },
    });

    const url = new URL(request.url);
    const eventTable = url.searchParams.get("eventTable");

    if (eventTable) {
      // Event Name Table: eventCount by eventName and date
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [
          { name: 'eventName' },
          { name: 'date' }
        ],
        metrics: [{ name: 'eventCount' }],
      });

      // Pivot: rows = eventName, columns = date, values = eventCount
      const eventNamesSet = new Set<string>();
      const datesSet = new Set<string>();
      const data: { [eventName: string]: { [date: string]: number } } = {};

      if (response && response.rows) {
        for (const row of response.rows) {
          const eventName = row.dimensionValues?.[0]?.value || '(not set)';
          const date = row.dimensionValues?.[1]?.value || '';
          const eventCount = Number(row.metricValues?.[0]?.value || 0);

          eventNamesSet.add(eventName);
          datesSet.add(date);

          if (!data[eventName]) data[eventName] = {};
          data[eventName][date] = eventCount;
        }
      }

      const dates = Array.from(datesSet).sort();
      const rows = Array.from(eventNamesSet).map(eventName => ({
        eventName,
        counts: dates.reduce((acc, date) => {
          acc[date] = data[eventName][date] ?? 0;
          return acc;
        }, {} as { [date: string]: number }),
      }));

      return new Response(JSON.stringify({ dates, rows }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Session Source/Medium Table: sessions by sessionSource/sessionMedium and date
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [
        { name: 'sessionSource' },
        { name: 'sessionMedium' },
        { name: 'date' }
      ],
      metrics: [{ name: 'sessions' }],
    });

    // Pivot: rows = source/medium, columns = date, values = sessions
    const sourcesSet = new Set<string>();
    const datesSet = new Set<string>();
    const data: { [sourceMedium: string]: { [date: string]: number } } = {};

    if (response && response.rows) {
      for (const row of response.rows) {
        const source = row.dimensionValues?.[0]?.value || '(not set)';
        const medium = row.dimensionValues?.[1]?.value || '(not set)';
        const date = row.dimensionValues?.[2]?.value || '';
        const sessions = Number(row.metricValues?.[0]?.value || 0);

        const sourceMedium = `${source} / ${medium}`;
        sourcesSet.add(sourceMedium);
        datesSet.add(date);

        if (!data[sourceMedium]) data[sourceMedium] = {};
        data[sourceMedium][date] = sessions;
      }
    }

    const dates = Array.from(datesSet).sort();
    const rows = Array.from(sourcesSet).map(sourceMedium => ({
      sourceMedium,
      counts: dates.reduce((acc, date) => {
        acc[date] = data[sourceMedium][date] ?? 0;
        return acc;
      }, {} as { [date: string]: number }),
    }));

    return new Response(JSON.stringify({ dates, rows }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    const code = typeof error === "object" && error !== null && "code" in error
      ? (error as { code?: number }).code
      : undefined;
    const message = code === 16
      ? 'Google Analytics rejected the service-account credentials. Verify GA_CLIENT_EMAIL and GA_PRIVATE_KEY, then make sure the service account has Viewer access to the GA4 property.'
      : code === 7
        ? 'The Google Analytics Data API is disabled for the Google Cloud project. Enable analyticsdata.googleapis.com in the project that owns the service account, then wait a few minutes and retry.'
      : 'Unable to load Google Analytics data. Check the server logs for details.';

    return new Response(JSON.stringify({ error: message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}