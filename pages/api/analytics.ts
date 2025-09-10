import { BetaAnalyticsDataClient } from '@google-analytics/data';
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA_CLIENT_EMAIL,
        private_key: (process.env.GA_PRIVATE_KEY ?? '').split(String.raw`\n`).join('\n'),
      },
    });

    const url = new URL(req.url ?? '', `http://${req.headers.host}`);
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

      res.setHeader("Cache-Control", "no-store"); // Disable caching
      return res.status(200).json({ dates, rows });
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

    res.setHeader("Cache-Control", "no-store"); // Disable caching
    return res.status(200).json({ dates, rows });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  } finally {
    res.setHeader("Cache-Control", "no-store");
  }
}
