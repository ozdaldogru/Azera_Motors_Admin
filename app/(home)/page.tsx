"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from '@/lib/ThemeProvider';


type SourceMediumRow = {
  sourceMedium: string;
  counts: { [date: string]: number };
};

type EventRow = {
  eventName: string;
  counts: { [date: string]: number };
};

export default function Home() {
  const { theme } = useTheme();
  // Table 1: Session Manual Source
  const [dates, setDates] = useState<string[]>([]);
  const [rows, setRows] = useState<SourceMediumRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Table 2: Event Name
  const [eventDates, setEventDates] = useState<string[]>([]);
  const [eventRows, setEventRows] = useState<EventRow[]>([]);
  const [eventLoading, setEventLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(data => {
        setDates(data.dates || []);
        setRows(data.rows || []);
        setLoading(false);
      });

    fetch("/api/analytics?eventTable=true")
      .then(res => res.json())
      .then(data => {
        setEventDates(data.dates || []);
        setEventRows(data.rows || []);
        setEventLoading(false);
      });
  }, []);

  // Table 1 totals
  const totals = dates.map(date =>
    rows.reduce((sum, row) => sum + (row.counts[date] ?? 0), 0)
  );
  const rowTotals = rows.map(row =>
    dates.reduce((sum, date) => sum + (row.counts[date] ?? 0), 0)
  );
  const grandTotal = totals.reduce((sum, t) => sum + t, 0);

  // Table 2 totals
  const eventTotals = eventDates.map(date =>
    eventRows.reduce((sum, row) => sum + (row.counts[date] ?? 0), 0)
  );
  const eventRowTotals = eventRows.map(row =>
    eventDates.reduce((sum, date) => sum + (row.counts[date] ?? 0), 0)
  );
  const eventGrandTotal = eventTotals.reduce((sum, t) => sum + t, 0);

  return (
    <div className={`w-full min-h-screen flex flex-col items-center justify-center px-2 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#23272f]' : 'bg-[#a0a1a3]'}`}>
      <div className="flex w-full max-w-4xl justify-center items-center mt-4 mb-2">
        <Image
          src="/Azera Logo 01.png"
          alt="Azera Motor's Logo"
          width={120}
          height={24}
          style={{ width: 'auto', height: 'auto' }}
          priority={true}
          className=""
        />
      </div>
      <h1 className={`mt-2 mb-4 text-xl sm:text-2xl md:text-3xl font-bold text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
        Azera Motors Admin Dashboard
      </h1>
      {/* Table 1 */}
      <div className={`mt-4 w-full max-w-4xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
        <h2 className={`text-base sm:text-lg md:text-xl font-bold mb-2 text-center ${theme === 'dark' ? 'text-gray-100' : ''}`}>
          User Source (Last 7 Days)
        </h2>
        <div className="overflow-x-auto w-full">
          {loading ? (
            <p>Loading analytics data...</p>
          ) : rows.length ? (
            <table className={`min-w-[400px] max-w-full w-full border rounded text-xs sm:text-sm md:text-base mx-auto ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
              <thead>
                <tr>
                  <th className={`border px-2 py-1 sticky left-0 z-10 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Session Source / Medium</th>
                  {dates.map(date => (
                    <th key={date} className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>{date}</th>
                  ))}
                  <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td className={`border px-2 py-1 sticky left-0 z-10 ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>{row.sourceMedium}</td>
                    {dates.map(date => (
                      <td key={date} className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>
                        {row.counts[date] ?? 0}
                      </td>
                    ))}
                    <td className={`border px-2 py-1 font-bold text-center ${theme === 'dark' ? 'bg-gray-900 text-yellow-300 border-gray-700' : ''}`}>{rowTotals[idx]}</td>
                  </tr>
                ))}
                <tr className={`font-bold ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <td className={`border px-2 py-1 sticky left-0 z-10 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-200 border-gray-300'}`}>Total</td>
                  {totals.map((total, idx) => (
                    <td key={dates[idx]} className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-800 text-yellow-300 border-gray-700' : ''}`}>{total}</td>
                  ))}
                  <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-800 text-yellow-300 border-gray-700' : ''}`}>{grandTotal}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>No data found.</p>
          )}
        </div>
      </div>
      {/* Table 2 */}
      <div className={`mt-8 w-full max-w-4xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
        <h2 className={`text-base sm:text-lg md:text-xl font-semibold mb-2 text-center ${theme === 'dark' ? 'text-gray-100' : ''}`}>
          User Interactions (Last 7 Days)
        </h2>
        <div className="overflow-x-auto w-full">
          {eventLoading ? (
            <p>Loading event analytics data...</p>
          ) : eventRows.length ? (
            <table className={`min-w-[400px] max-w-full w-full border rounded text-xs sm:text-sm md:text-base mx-auto ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
              <thead>
                <tr>
                  <th className={`border px-2 py-1 sticky left-0 z-10 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Event Name</th>
                  {eventDates.map(date => (
                    <th key={date} className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>{date}</th>
                  ))}
                  <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Total</th>
                </tr>
              </thead>
              <tbody>
                {eventRows.map((row, idx) => (
                  <tr key={idx}>
                    <td className={`border px-2 py-1 sticky left-0 z-10 ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>{row.eventName}</td>
                    {eventDates.map(date => (
                      <td key={date} className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>
                        {row.counts[date] ?? 0}
                      </td>
                    ))}
                    <td className={`border px-2 py-1 font-bold text-center ${theme === 'dark' ? 'bg-gray-900 text-yellow-300 border-gray-700' : ''}`}>{eventRowTotals[idx]}</td>
                  </tr>
                ))}
                <tr className={`font-bold ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <td className={`border px-2 py-1 sticky left-0 z-10 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-200 border-gray-300'}`}>Total</td>
                  {eventTotals.map((total, idx) => (
                    <td key={eventDates[idx]} className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-800 text-yellow-300 border-gray-700' : ''}`}>{total}</td>
                  ))}
                  <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-800 text-yellow-300 border-gray-700' : ''}`}>{eventGrandTotal}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>No event data found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
