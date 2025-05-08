import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { formatDateTime } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
}

const Sidebar = ({ open }: SidebarProps) => {
  const [location] = useLocation();
  
  // Get user status (assuming logged in as user 6 - Juan Diaz)
  const { data: userStatus } = useQuery({
    queryKey: ['/api/user-statuses/6'],
  });
  
  // Get user work time
  const { data: workTime } = useQuery({
    queryKey: ['/api/users/6/work-time'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Helper for active link styles
  const isActiveLink = (path: string) => {
    return location === path 
      ? "bg-[#0078D4] text-white" 
      : "text-[#323130] hover:bg-[#F3F2F1]";
  };

  return (
    <aside 
      className={`bg-white shadow-md w-64 flex-shrink-0 ${open ? 'block absolute z-10 h-screen' : 'hidden'} lg:block transition-all duration-300 ease-in-out border-r border-[#F3F2F1]`}
    >
      <nav className="p-4 h-full flex flex-col">
        <div className="mb-6">
          <p className="text-xs font-medium text-[#605E5C] uppercase mb-2 px-2">Principal</p>
          <ul>
            <li>
              <Link href="/">
                <a className={`flex items-center px-2 py-2 rounded-md ${isActiveLink("/")}`}>
                  <span className="material-icons mr-3">dashboard</span>
                  <span>Dashboard</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/employees">
                <a className={`flex items-center px-2 py-2 rounded-md ${isActiveLink("/employees")}`}>
                  <span className="material-icons mr-3">people</span>
                  <span>Empleados</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/schedule">
                <a className={`flex items-center px-2 py-2 rounded-md ${isActiveLink("/schedule")}`}>
                  <span className="material-icons mr-3">schedule</span>
                  <span>Horarios</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/reports">
                <a className={`flex items-center px-2 py-2 rounded-md ${isActiveLink("/reports")}`}>
                  <span className="material-icons mr-3">insights</span>
                  <span>Informes</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mb-6">
          <p className="text-xs font-medium text-[#605E5C] uppercase mb-2 px-2">Administración</p>
          <ul>
            <li>
              <a href="#" className="flex items-center px-2 py-2 rounded-md text-[#323130] hover:bg-[#F3F2F1]">
                <span className="material-icons mr-3">settings</span>
                <span>Configuración</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-2 py-2 rounded-md text-[#323130] hover:bg-[#F3F2F1]">
                <span className="material-icons mr-3">format_list_bulleted</span>
                <span>Reportes</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div className="mt-auto">
          <div className="bg-[#F3F2F1] rounded-md p-4">
            <div className="flex items-center mb-3">
              <span className="material-icons text-[#FFB900] mr-2">timer</span>
              <h3 className="font-medium">Su tiempo hoy</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-[#605E5C]">Entrada:</p>
                <p className="font-medium">{formatDateTime(userStatus?.lastClockIn)}</p>
              </div>
              <div>
                <p className="text-[#605E5C]">Tiempo:</p>
                <p className="font-medium">{workTime?.workTimeFormatted || "0h 0m"}</p>
              </div>
              <div>
                <p className="text-[#605E5C]">Pausas:</p>
                <p className="font-medium">{workTime?.breakTimeFormatted || "0m"}</p>
              </div>
              <div>
                <p className="text-[#605E5C]">Estado:</p>
                <p className="font-medium text-[#107C10]">
                  {userStatus?.status === "online" ? "Online" : 
                   userStatus?.status === "break" ? "En pausa" :
                   userStatus?.status === "late" ? "Tarde" : "Offline"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
