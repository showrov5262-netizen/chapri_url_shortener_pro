'use client'

import type { Click } from "@/types";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export default function GeoChart({ clicks }: { clicks: Click[] }) {
  const data = clicks
    .reduce((acc, click) => {
      const existing = acc.find(item => item.country === click.country);
      if (existing) {
        existing.clicks++;
      } else {
        acc.push({ country: click.country, clicks: 1 });
      }
      return acc;
    }, [] as { country: string; clicks: number }[])
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 7);

  return (
    <div className="h-[250px] w-full">
        <ChartContainer config={{}}>
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="country" type="category" width={80} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                <Bar dataKey="clicks" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
        </ChartContainer>
    </div>
  );
}
