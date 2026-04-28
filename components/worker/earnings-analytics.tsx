"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart2, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type CompletedBooking = {
  id: string;
  completedAt: string | null;
  categoryId: string | null;
};

export type InvoiceRecord = {
  bookingId: string | null;
  amount: number;
  createdAt: string;
};

export type EarningsAnalyticsProps = {
  completedBookings: CompletedBooking[];
  invoices: InvoiceRecord[];
  categoryNames: Record<string, string>;
};

type ChartPoint = {
  label: string;
  earnings: number;
  jobs: number;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: ChartPoint; [key: string]: unknown }>;
  label?: string;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatCurrency(v: number): string {
  if (v === 0) return "₱0";
  if (v >= 1_000_000) return `₱${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `₱${(v / 1000).toFixed(1)}k`;
  return `₱${v.toFixed(0)}`;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="bg-popover border rounded-lg shadow-md px-3 py-2 text-sm min-w-35">
      <p className="font-medium text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">
        Earnings:{" "}
        <span className="font-medium text-foreground">
          ₱{point.earnings.toLocaleString()}
        </span>
      </p>
      <p className="text-muted-foreground">
        Jobs: <span className="font-medium text-foreground">{point.jobs}</span>
      </p>
    </div>
  );
}

export default function EarningsAnalytics({
  completedBookings,
  invoices,
  categoryNames,
}: EarningsAnalyticsProps) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  const invoiceByBookingId = useMemo(() => {
    const map = new Map<string, number>();
    for (const inv of invoices) {
      if (!inv.bookingId) continue;
      map.set(inv.bookingId, (map.get(inv.bookingId) ?? 0) + inv.amount);
    }
    return map;
  }, [invoices]);

  const chartData = useMemo<ChartPoint[]>(() => {
    const now = new Date();

    if (period === "weekly") {
      const thisWeekStart = getWeekStart(now);
      return Array.from({ length: 8 }, (_, i) => {
        const start = new Date(thisWeekStart);
        start.setDate(start.getDate() - (7 - i) * 7);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);

        const inPeriod = completedBookings.filter((b) => {
          if (!b.completedAt) return false;
          const d = new Date(b.completedAt);
          return d >= start && d < end;
        });

        return {
          label: start.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          earnings: inPeriod.reduce(
            (s, b) => s + (invoiceByBookingId.get(b.id) ?? 0),
            0,
          ),
          jobs: inPeriod.length,
        };
      });
    }

    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const start = d;
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);

      const inPeriod = completedBookings.filter((b) => {
        if (!b.completedAt) return false;
        const bd = new Date(b.completedAt);
        return bd >= start && bd < end;
      });

      return {
        label: d.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        earnings: inPeriod.reduce(
          (s, b) => s + (invoiceByBookingId.get(b.id) ?? 0),
          0,
        ),
        jobs: inPeriod.length,
      };
    });
  }, [period, completedBookings, invoiceByBookingId]);

  const topServices = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of completedBookings) {
      if (!b.categoryId) continue;
      counts.set(b.categoryId, (counts.get(b.categoryId) ?? 0) + 1);
    }
    const total = completedBookings.length || 1;
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({
        name: categoryNames[id] ?? "Unknown",
        count,
        pct: Math.round((count / total) * 100),
      }));
  }, [completedBookings, categoryNames]);

  const busiestDays = useMemo(() => {
    const counts = Array<number>(7).fill(0);
    for (const b of completedBookings) {
      if (!b.completedAt) continue;
      const day = new Date(b.completedAt).getDay();
      counts[day === 0 ? 6 : day - 1]++;
    }
    const max = Math.max(...counts, 1);
    return DAYS.map((label, i) => ({
      label,
      count: counts[i],
      pct: Math.round((counts[i] / max) * 100),
    }));
  }, [completedBookings]);

  const periodTotal = chartData.reduce((s, d) => s + d.earnings, 0);
  const periodJobs = chartData.reduce((s, d) => s + d.jobs, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Earnings Overview
              </CardTitle>
              <div className="flex gap-6 mt-3">
                <div>
                  <p className="text-xs text-muted-foreground">Period Total</p>
                  <p className="text-xl font-bold text-foreground">
                    ₱{periodTotal.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Jobs Completed
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {periodJobs}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex rounded-lg border overflow-hidden self-start">
              <Button
                variant={period === "weekly" ? "default" : "ghost"}
                size="sm"
                className="rounded-none border-0 h-8"
                onClick={() => setPeriod("weekly")}
              >
                Weekly
              </Button>
              <Button
                variant={period === "monthly" ? "default" : "ghost"}
                size="sm"
                className="rounded-none border-0 h-8"
                onClick={() => setPeriod("monthly")}
              >
                Monthly
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -30, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.2)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={52}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "rgba(148,163,184,0.08)" }}
              />
              <Bar
                dataKey="earnings"
                name="earnings"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
          {periodTotal === 0 && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              Earnings appear here once invoices are linked to completed
              bookings.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-500" />
              Top Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topServices.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Complete jobs to see your top service categories.
              </p>
            ) : (
              <div className="space-y-4">
                {topServices.map((svc) => (
                  <div key={svc.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground truncate max-w-[60%]">
                        {svc.name}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {svc.count} job{svc.count !== 1 ? "s" : ""} · {svc.pct}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${svc.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              Busiest Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Complete jobs to see your busiest days.
              </p>
            ) : (
              <div className="space-y-4">
                {busiestDays.map((day) => {
                  const peak = day.pct === 100 && day.count > 0;
                  return (
                    <div key={day.label} className="flex items-center gap-3">
                      <span
                        className={`text-sm w-8 shrink-0 ${peak ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                      >
                        {day.label}
                      </span>
                      <div className="flex-1 bg-secondary rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${peak ? "bg-purple-500" : "bg-purple-300 dark:bg-purple-800"}`}
                          style={{
                            width: day.count > 0 ? `${day.pct}%` : "0%",
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-5 text-right shrink-0">
                        {day.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
