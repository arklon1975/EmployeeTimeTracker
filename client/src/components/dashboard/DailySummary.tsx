import { useQuery } from "@tanstack/react-query";

const DailySummary = () => {
  // Fetch daily summary data
  const { data: summaryData, isLoading } = useQuery({
    queryKey: ['/api/daily-summary'],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-[#F3F2F1] p-6 text-center">
        <span className="material-icons animate-spin text-[#0078D4]">refresh</span>
        <p className="mt-2 text-[#605E5C]">Cargando resumen...</p>
      </div>
    );
  }

  // Use sample data if no data is available yet
  const data = summaryData?.statsData || {
    attendance: 86,
    punctuality: 92,
    breakTimePercent: 12,
    overtimePercent: 3
  };

  // Quick stats data
  const quickStats = {
    firstEntry: "07:45 AM",
    lastEntry: "09:30 AM",
    absences: summaryData?.absentUsers || 8,
    pendingRequests: 3
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#F3F2F1] overflow-hidden">
      <div className="p-4 border-b border-[#F3F2F1]">
        <h3 className="font-semibold text-[#323130]">Resumen del día</h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-[#605E5C]">Asistencia</span>
              <span className="text-sm font-medium">{data.attendance}%</span>
            </div>
            <div className="w-full bg-[#F3F2F1] rounded-full h-2">
              <div className="bg-[#107C10] h-2 rounded-full" style={{ width: `${data.attendance}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-[#605E5C]">Puntualidad</span>
              <span className="text-sm font-medium">{data.punctuality}%</span>
            </div>
            <div className="w-full bg-[#F3F2F1] rounded-full h-2">
              <div className="bg-[#0078D4] h-2 rounded-full" style={{ width: `${data.punctuality}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-[#605E5C]">Tiempo en pausas</span>
              <span className="text-sm font-medium">{data.breakTimePercent}%</span>
            </div>
            <div className="w-full bg-[#F3F2F1] rounded-full h-2">
              <div className="bg-[#FFB900] h-2 rounded-full" style={{ width: `${data.breakTimePercent}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-[#605E5C]">Horas extras</span>
              <span className="text-sm font-medium">{data.overtimePercent}%</span>
            </div>
            <div className="w-full bg-[#F3F2F1] rounded-full h-2">
              <div className="bg-[#D83B01] h-2 rounded-full" style={{ width: `${data.overtimePercent}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-[#F3F2F1]">
          <h4 className="font-medium mb-3">Información Rápida</h4>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-sm text-[#605E5C]">Primera entrada:</span>
              <span className="text-sm font-medium">{quickStats.firstEntry}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-sm text-[#605E5C]">Última entrada:</span>
              <span className="text-sm font-medium">{quickStats.lastEntry}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-sm text-[#605E5C]">Ausencias:</span>
              <span className="text-sm font-medium">{quickStats.absences} personas</span>
            </li>
            <li className="flex justify-between">
              <span className="text-sm text-[#605E5C]">Solicitudes:</span>
              <span className="text-sm font-medium">{quickStats.pendingRequests} pendientes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
