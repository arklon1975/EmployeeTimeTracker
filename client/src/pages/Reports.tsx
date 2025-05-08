import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Reports = () => {
  // Sample data for reports
  const weeklyData = [
    { name: "Lunes", presente: 54, ausente: 4 },
    { name: "Martes", presente: 52, ausente: 6 },
    { name: "Miércoles", presente: 48, ausente: 10 },
    { name: "Jueves", presente: 50, ausente: 8 },
    { name: "Viernes", presente: 52, ausente: 6 },
  ];
  
  const pieData = [
    { name: "Tiempo Activo", value: 85, color: "#0078D4" },
    { name: "Pausas", value: 10, color: "#FFB900" },
    { name: "Tardanza", value: 5, color: "#D83B01" },
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#323130]">Informes</h2>
        <p className="text-[#605E5C]">Análisis y reportes de actividad</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select defaultValue="week">
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Período de tiempo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button className="bg-[#0078D4] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#2B88D8] flex items-center justify-center">
          <span className="material-icons mr-2">download</span>
          <span>Exportar informe</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Asistencia semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={weeklyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="presente" fill="#0078D4" />
                <Bar dataKey="ausente" fill="#D83B01" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribución de tiempo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Resumen de métricas
            <Select defaultValue="week">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="quarter">Este trimestre</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              icon="schedule" 
              title="Horas totales" 
              value="1,458" 
              trend="+5.2%" 
              trendUp={true}
            />
            <MetricCard 
              icon="check_circle" 
              title="Asistencia" 
              value="90.2%" 
              trend="+2.1%" 
              trendUp={true}
            />
            <MetricCard 
              icon="timelapse" 
              title="Tiempo en pausa" 
              value="12.5%" 
              trend="-1.3%" 
              trendUp={true}
            />
            <MetricCard 
              icon="error" 
              title="Tardanzas" 
              value="4.8%" 
              trend="+0.5%" 
              trendUp={false}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informes disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <ReportItem title="Informe de asistencia mensual" icon="assignment" />
              <ReportItem title="Análisis de horas extras" icon="schedule" />
              <ReportItem title="Resumen de pausas" icon="free_breakfast" />
              <ReportItem title="Tendencias de puntualidad" icon="trending_up" />
              <ReportItem title="Reporte de ausencias" icon="person_off" />
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Informes programados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <span className="material-icons text-5xl text-[#605E5C]">notifications</span>
              <h3 className="mt-4 text-xl font-medium text-[#323130]">No hay informes programados</h3>
              <p className="mt-2 text-[#605E5C]">
                Programe informes para recibirlos automáticamente por correo electrónico
              </p>
              <button className="mt-4 px-4 py-2 bg-[#0078D4] text-white rounded-md">
                <span className="material-icons mr-2">add</span>
                Programar informe
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface MetricCardProps {
  icon: string;
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
}

const MetricCard = ({ icon, title, value, trend, trendUp }: MetricCardProps) => {
  return (
    <div className="bg-[#F3F2F1] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="material-icons text-[#0078D4]">{icon}</span>
        <span className={`text-sm flex items-center ${trendUp ? 'text-[#107C10]' : 'text-[#D83B01]'}`}>
          <span className="material-icons text-sm mr-1">
            {trendUp ? 'trending_up' : 'trending_down'}
          </span>
          {trend}
        </span>
      </div>
      <p className="text-sm text-[#605E5C]">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
};

interface ReportItemProps {
  title: string;
  icon: string;
}

const ReportItem = ({ title, icon }: ReportItemProps) => {
  return (
    <li className="flex items-center justify-between p-3 bg-[#F3F2F1] rounded-md">
      <div className="flex items-center">
        <span className="material-icons text-[#0078D4] mr-3">{icon}</span>
        <span>{title}</span>
      </div>
      <button className="text-[#0078D4] hover:text-[#2B88D8]">
        <span className="material-icons">download</span>
      </button>
    </li>
  );
};

export default Reports;
