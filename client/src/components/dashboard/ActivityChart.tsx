import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, TooltipProps } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for the activity chart by hour
const activityData = [
  { hour: "08:00", active: 30, break: 0, empty: 70 },
  { hour: "09:00", active: 60, break: 0, empty: 40 },
  { hour: "10:00", active: 80, break: 0, empty: 20 },
  { hour: "11:00", active: 70, break: 10, empty: 20 },
  { hour: "12:00", active: 40, break: 30, empty: 30 },
  { hour: "13:00", active: 15, break: 5, empty: 80 },
  { hour: "14:00", active: 10, break: 0, empty: 90 },
];

const ActivityChart = () => {
  const [timeRange, setTimeRange] = useState("today");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#F3F2F1] overflow-hidden">
      <div className="p-4 border-b border-[#F3F2F1] flex justify-between items-center">
        <h3 className="font-semibold text-[#323130]">Actividad por Hora</h3>
        <div>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value)}>
            <SelectTrigger className="text-sm border border-[#A19F9D] rounded p-1 w-[120px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="yesterday">Ayer</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={activityData}
            stackOffset="expand"
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <XAxis 
              dataKey="hour" 
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="#605E5C"
            />
            <YAxis 
              hide={true}
            />
            <Tooltip 
              content={<CustomTooltip />} 
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="square"
              formatter={(value) => {
                if (value === "active") return "Tiempo activo";
                if (value === "break") return "Tiempo en pausa";
                return "Sin actividad";
              }}
            />
            <Bar 
              dataKey="active" 
              stackId="a" 
              fill="#0078D4" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="break" 
              stackId="a" 
              fill="#FFB900" 
            />
            <Bar 
              dataKey="empty" 
              stackId="a" 
              fill="#F3F2F1" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const activeValue = payload[0].value || 0;
    const breakValue = payload[1].value || 0;
    
    return (
      <div className="custom-tooltip bg-white p-2 border border-[#A19F9D] shadow-sm rounded text-xs">
        <p className="font-medium mb-1">{`${label}`}</p>
        <p className="flex items-center">
          <span className="w-2 h-2 bg-[#0078D4] inline-block mr-1"></span>
          <span>Tiempo activo: {activeValue}%</span>
        </p>
        <p className="flex items-center">
          <span className="w-2 h-2 bg-[#FFB900] inline-block mr-1"></span>
          <span>Tiempo en pausa: {breakValue}%</span>
        </p>
      </div>
    );
  }

  return null;
};

export default ActivityChart;
