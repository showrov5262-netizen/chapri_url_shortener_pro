'use client'

import type { Click } from "@/types";
import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export default function ReferrerChart({ clicks }: { clicks: Click[] }) {
  const data = clicks
    .reduce((acc, click) => {
      const referrer = click.referrer || 'Direct';
      const existing = acc.find(item => item.referrer === referrer);
      if (existing) {
        existing.clicks++;
      } else {
        acc.push({ referrer: referrer, clicks: 1 });
      }
      return acc;
    }, [] as { referrer: string; clicks: number }[])
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  return (
    <div className="h-[250px] w-full">
        <ChartContainer config={{}}>
            <BarChart data={data} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="referrer" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                <Bar dataKey="clicks" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
        </ChartContainer>
    </div>
  );
}
