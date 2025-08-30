'use client'

import type { Link } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointerClick } from "lucide-react";
import SummaryCard from "./summary-card";
import BotDetectionCard from "./bot-detection-card";
import ClicksByTimeChart from "./clicks-by-time-chart";
import GeoChart from "./geo-chart";
import DeviceChart from "./device-chart";
import ReferrerChart from "./referrer-chart";
import ClickHistoryTable from "./click-history-table";

export default function AnalyticsView({ link }: { link: Link }) {

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{link.clicks.length.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                    Total clicks since creation
                </p>
                </CardContent>
            </Card>
            <SummaryCard link={link} />
            <BotDetectionCard link={link} />
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Clicks Over Time</CardTitle>
            </CardHeader>
            <CardContent>
                <ClicksByTimeChart clicks={link.clicks} />
            </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader>
                    <CardTitle>Geographic Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <GeoChart clicks={link.clicks} />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Device Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <DeviceChart clicks={link.clicks} />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Top Referrers</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReferrerChart clicks={link.clicks} />
                </CardContent>
            </Card>
        </div>

        <ClickHistoryTable clicks={link.clicks} />
    </div>
  );
}
