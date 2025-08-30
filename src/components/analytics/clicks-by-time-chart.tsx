'use client'

import type { Click } from "@/types";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export default function ClicksByTimeChart({ clicks }: { clicks: Click[] }) {
  const data = clicks
    .reduce((acc, click) => {
      const date = new Date(click.clickedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.clicks++;
      } else {
        acc.push({ date, clicks: 1 });
      }
      return acc;
    }, [] as { date: string; clicks: number }[])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="h-[300px] w-full">
        <ChartContainer config={{}}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
            </AreaChart>
        </ChartContainer>
    </div>
  );
}
