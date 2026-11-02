
"use client";
// Type for unsold info car
type UnsoldInfoCar = {
  _id: string;
  model: string;
  make: string;
  year: number;
  totalCost?: number;
  soldPrice?: number;
  soldDate?: string;
};

import { useEffect, useState } from "react";
import { useTheme } from '@/lib/ThemeProvider';

import Link from "next/link";


type SourceMediumRow = {
  sourceMedium: string;
  counts: { [date: string]: number };
};

type EventRow = {
  eventName: string;
  counts: { [date: string]: number };
};

type MonthlyProfitRow = {
  month: string;
  label: string;
  sold: number;
  cost: number;
  soldPrice: number;
  profit: number;
};

type SalesSummary = {
  totalSold: number;
  totalCost: number;
  totalSoldPrice: number;
  totalProfit: number;
  monthlyProfit: MonthlyProfitRow[];
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
  const [analyticsError, setAnalyticsError] = useState("");

  // Sales Summary
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [salesLoading, setSalesLoading] = useState(true);

  // Unsold info cars
  const [unsoldInfoCars, setUnsoldInfoCars] = useState<UnsoldInfoCar[]>([]);
  const [unsoldLoading, setUnsoldLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async (url: string, table: "source" | "event") => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Unable to load analytics data.");
        }

        if (table === "source") {
          setDates(Array.isArray(data.dates) ? data.dates : []);
          setRows(Array.isArray(data.rows) ? data.rows : []);
          setLoading(false);
        } else {
          setEventDates(Array.isArray(data.dates) ? data.dates : []);
          setEventRows(Array.isArray(data.rows) ? data.rows : []);
          setEventLoading(false);
        }
      } catch (error) {
        setAnalyticsError(error instanceof Error ? error.message : "Unable to load analytics data.");
        if (table === "source") setLoading(false);
        else setEventLoading(false);
      }
    };

    loadAnalytics("/api/analytics-google?sourceMediumTable=true", "source");
    loadAnalytics("/api/analytics-google?eventTable=true", "event");
  }, []);

  useEffect(() => {
    fetch("/api/analytics.sales-summary")
      .then(res => res.json())
      .then(data => {
        setSalesSummary(data);
        setSalesLoading(false);
      });
  }, []);

  // Fetch unsold info cars
  useEffect(() => {
    fetch("/api/analytics.unsold-cars")
      .then(res => res.json())
      .then(data => {
        setUnsoldInfoCars(Array.isArray(data) ? data : []);
        setUnsoldLoading(false);
      })
      .catch(() => setUnsoldLoading(false));
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
    <div className="dashboard-page flex min-h-screen flex-col items-center px-4 py-8 sm:px-8 lg:px-10">
      {/* Azera Logo */}

      <div className="w-full max-w-6xl">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">Overview</p>
      <h1 className={`mb-2 text-3xl font-bold tracking-tight sm:text-4xl ${theme === "dark" ? "text-white" : "text-black"}`}>
        Good morning, admin
      </h1>
      <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">Here’s what’s happening across your vehicle inventory.</p>
      {analyticsError && (
        <div className="mb-6 w-full rounded-xl border border-amber-300/50 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200">
          <strong>Google Analytics unavailable:</strong> {analyticsError}
        </div>
      )}

      {/* Sales Summary */}
      <div className="w-full">
        <h2 className={`mb-3 text-center text-lg font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>
          Sales Summary (All Time)
        </h2>
        <div className="overflow-x-auto w-full py-2">
          {salesLoading ? (
            <p>Loading sales data...</p>
          ) : salesSummary ? (
            <>
              <table className={`min-w-[400px] max-w-full w-full border rounded text-xs sm:text-sm md:text-base mx-auto ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
                <thead>
                  <tr>
                    <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Total Sold </th>
                    <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Total Cost ($)</th>
                    <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Total Sold Price ($)</th>
                    <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Total Profit ($)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>
                      {salesSummary.totalSold.toLocaleString()}
                    </td>
                    <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>
                      {salesSummary.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>
                      {salesSummary.totalSoldPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>
                      {salesSummary.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={`mt-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                <h3 className={`mb-2 text-center text-lg font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>
                  Monthly Profit (Last 12 Months)
                </h3>
                <div className="overflow-x-auto w-full py-2">
                  {salesSummary.monthlyProfit?.length ? (
                    <table className={`min-w-[600px] max-w-full w-full border rounded text-xs sm:text-sm md:text-base mx-auto ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
                      <thead>
                        <tr>
                          <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Month</th>
                          <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Sold</th>
                          <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Cost ($)</th>
                          <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Sold Price ($)</th>
                          <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Profit ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesSummary.monthlyProfit.map((row) => (
                          <tr key={row.month}>
                            <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>{row.label}</td>
                            <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>{row.sold}</td>
                            <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>{row.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>{row.soldPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>{row.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No monthly profit data found.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p>No sales data found.</p>
          )}
        </div>
      </div>

      {/* Table 1 */}
      <div className="mt-8 w-full">
        <h2 className={`mb-3 text-center text-lg font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>
          User Source (Last 7 Days)
        </h2>
        <div className="overflow-x-auto w-full py-2">
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
      </div>
      {/* Table 2 */}
      <div className={`mt-8 w-full max-w-6xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
        <h2 className={`mb-2 text-center text-lg font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>
          User Interactions (Last 7 Days)
        </h2>
        <div className="overflow-x-auto w-full py-2">
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



      {/* Table 3: Sold cars with missing/zero cost, sold price, or sold date */}
      <div className={`mt-8 w-full max-w-6xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
        <h2 className={`text-base sm:text-lg md:text-xl font-semibold mb-2 text-center ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
          Sold Cars With Incomplete Sale Info
        </h2>
        <div className="overflow-x-auto w-full py-2">
          {unsoldLoading ? (
            <p>Loading incomplete sale cars...</p>
          ) : unsoldInfoCars.length ? (
            <table className={`min-w-[400px] max-w-full w-full border rounded text-xs sm:text-sm md:text-base mx-auto ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
              <thead>
                <tr>
                  <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Model</th>
                  <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Make</th>
                  <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Year</th>
                  <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Total Cost</th>
                  <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Sold Price</th>
                  <th className={`border px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>Sold Date</th>
                </tr>
              </thead>
              <tbody>
                {unsoldInfoCars.map(car => (
                  <tr key={car._id}>
                    <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700 underline' : 'bg-white border-gray-300 underline'}`}>
                      <Link href={`/products/${car._id}`} className="hover:text-blue-500">
                        {car.model}
                      </Link>
                    </td>
                    <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>{car.make}</td>
                    <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-gray-700' : 'bg-white border-gray-300'}`}>{car.year}</td>
                    <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-red-300 border-gray-700' : 'bg-white text-red-700 border-gray-300'}`}>{car.totalCost ?? ''}</td>
                    <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-red-300 border-gray-700' : 'bg-white text-red-700 border-gray-300'}`}>{car.soldPrice ?? ''}</td>
                    <td className={`border px-2 py-1 text-center ${theme === 'dark' ? 'bg-gray-900 text-red-300 border-gray-700' : 'bg-white text-red-700 border-gray-300'}`}>{car.soldDate || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No incomplete sale cars found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
