import { useQuery } from "@tanstack/react-query";
import StatusCard from "@/components/dashboard/StatusCard";
import TimeControl from "@/components/dashboard/TimeControl";
import TeamStatusTable from "@/components/dashboard/TeamStatusTable";
import ActivityChart from "@/components/dashboard/ActivityChart";
import DailySummary from "@/components/dashboard/DailySummary";
import RecentActivity from "@/components/dashboard/RecentActivity";
import useCurrentTime from "@/hooks/use-current-time";

const Dashboard = () => {
  const { currentTime, currentDateStr } = useCurrentTime();
  
  // Fetch status summary
  const { data: statusSummary, isLoading } = useQuery({
    queryKey: ['/api/status-summary'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="p-4 lg:p-6">
      {/* Dashboard Title */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-semibold text-[#323130]">Dashboard</h2>
          <p className="text-[#605E5C]">
            {currentDateStr} · {currentTime}
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="hidden md:flex items-center px-4 py-2 bg-white text-[#323130] rounded-md border border-[#A19F9D] shadow-sm hover:bg-[#F3F2F1]">
            <span className="material-icons mr-1">filter_list</span>
            <span>Filtrar</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-[#0078D4] text-white rounded-md shadow-sm hover:bg-[#2B88D8]">
            <span className="material-icons mr-1">file_download</span>
            <span className="hidden md:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatusCard 
          title="Empleados Online"
          icon="person"
          iconColor="#107C10"
          count={statusSummary?.online || 0}
          total={statusSummary?.total || 0}
          trend={{ value: 12, direction: "up" }}
          progressColor="bg-[#107C10]"
        />
        
        <StatusCard 
          title="En Pausa"
          icon="pause_circle"
          iconColor="#FFB900"
          count={statusSummary?.break || 0}
          total={statusSummary?.total || 0}
          trend={{ value: 0, direction: "flat" }}
          progressColor="bg-[#FFB900]"
        />
        
        <StatusCard 
          title="Ausentes"
          icon="person_off"
          iconColor="#A19F9D"
          count={statusSummary?.offline || 0}
          total={statusSummary?.total || 0}
          trend={{ value: 2, direction: "down" }}
          progressColor="bg-[#A19F9D]"
        />
        
        <StatusCard 
          title="Horas Totales Hoy"
          icon="schedule"
          iconColor="#0078D4"
          count={287}
          total={336}
          trend={{ value: 5, direction: "up" }}
          progressColor="bg-[#0078D4]"
        />
      </div>

      {/* Clock In/Out System */}
      <div className="mb-6">
        <TimeControl userId={6} /> {/* Assuming user ID 6 is the logged-in user */}
      </div>

      {/* Team Status Table */}
      <div className="mb-6">
        <TeamStatusTable />
      </div>

      {/* Employee Activity Chart & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        
        {/* Quick Stats */}
        <div>
          <DailySummary />
        </div>
      </div>
      
      {/* Recent Activity Timeline */}
      <div className="mb-6">
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
