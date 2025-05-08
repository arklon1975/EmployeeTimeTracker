import { useQuery } from "@tanstack/react-query";
import { formatTimeDistance } from "@/lib/utils";

const RecentActivity = () => {
  // Fetch activity logs
  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ['/api/activity-logs'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-[#F3F2F1] p-6 text-center">
        <span className="material-icons animate-spin text-[#0078D4]">refresh</span>
        <p className="mt-2 text-[#605E5C]">Cargando actividad reciente...</p>
      </div>
    );
  }

  const getActivityDotColor = (action: string) => {
    switch (action) {
      case "clock-in":
        return "bg-[#0078D4]";
      case "clock-out":
        return "bg-[#D83B01]";
      case "start-break":
        return "bg-[#FFB900]";
      case "end-break":
        return "bg-[#FFB900]";
      case "clock-in-late":
        return "bg-[#D83B01]";
      default:
        return "bg-[#0078D4]";
    }
  };

  const getActivityText = (activity: any) => {
    const userName = activity.user?.name || "Usuario";
    
    switch (activity.action) {
      case "clock-in":
        return `${userName} ha registrado su entrada`;
      case "clock-out":
        return `${userName} ha registrado su salida`;
      case "start-break":
        const breakType = activity.details?.type === "coffee" ? "café" : "comida";
        return `${userName} ha iniciado su pausa de ${breakType}`;
      case "end-break":
        return `${userName} ha finalizado su pausa`;
      case "clock-in-late":
        return `${userName} ha registrado una entrada tardía`;
      default:
        return `${userName} ha realizado una acción`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#F3F2F1] overflow-hidden">
      <div className="p-4 border-b border-[#F3F2F1] flex justify-between items-center">
        <h3 className="font-semibold text-[#323130]">Actividad Reciente</h3>
        <button className="text-[#0078D4] text-sm font-medium">Ver todo</button>
      </div>
      
      <div className="p-4">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[#F3F2F1]"></div>
          
          {/* Timeline items */}
          <div className="space-y-6">
            {activityLogs && activityLogs.length > 0 ? (
              activityLogs.map((activity: any) => (
                <div key={activity.id} className="ml-12 relative">
                  {/* Timeline dot */}
                  <div className={`absolute -left-8 mt-1.5 w-4 h-4 rounded-full ${getActivityDotColor(activity.action)} border-2 border-white`}></div>
                  
                  <div>
                    <p className="text-[#323130]">
                      {getActivityText(activity)}
                    </p>
                    <p className="text-sm text-[#605E5C]">
                      {formatTimeDistance(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-[#605E5C]">
                No hay actividad reciente
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
