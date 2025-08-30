'use client'

import type { Click } from "@/types";
import { Pie, PieChart, Tooltip, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

export default function DeviceChart({ clicks }: { clicks: Click[] }) {
  const data = clicks
    .reduce((acc, click) => {
      const existing = acc.find(item => item.name === click.device);
      if (existing) {
        existing.value++;
      } else {
        acc.push({ name: click.device, value: 1 });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  return (
    <div className="h-[250px] w-full flex items-center justify-center">
        <ChartContainer config={{}}>
            <PieChart>
                <Tooltip content={<ChartTooltipContent />} />
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
    </div>
  );
}
