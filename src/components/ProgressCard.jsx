import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function ProgressCard({ title, current, total, percentage, trend, subtitle, color = "green" }) {
  const colorClasses = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700",
    red: "bg-red-100 text-red-700"
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          {trend && (
            <Badge variant="secondary" className={colorClasses[color]}>
              {trend > 0 ? (
                <TrendingUp className="w-3 h-3 ml-1" />
              ) : (
                <TrendingDown className="w-3 h-3 ml-1" />
              )}
              {Math.abs(trend)}%
            </Badge>
          )}
        </div>

        <div className="mb-3">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">{current}</span>
            {total && (
              <span className="text-lg text-gray-500">/ {total}</span>
            )}
          </div>
          {percentage !== undefined && (
            <Progress value={percentage} className="h-3" />
          )}
        </div>

        {percentage !== undefined && (
          <p className="text-sm text-gray-600">
            {percentage.toFixed(0)}% مكتمل
          </p>
        )}
      </CardContent>
    </Card>
  );
}