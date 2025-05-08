import { useQuery } from "@tanstack/react-query";
import useCurrentTime from "@/hooks/use-current-time";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { currentTime } = useCurrentTime();

  // Fetch status summary data
  const { data: statusSummary } = useQuery({
    queryKey: ['/api/status-summary'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <header className="bg-white shadow-sm border-b border-[#F3F2F1]">
      <div className="flex items-center justify-between px-4 py-2 lg:px-6">
        {/* Logo and toggle */}
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden mr-2 text-[#323130] p-2 rounded-md hover:bg-[#F3F2F1]"
          >
            <span className="material-icons">menu</span>
          </button>
          <div className="flex items-center">
            <span className="material-icons text-[#0078D4] text-3xl">support_agent</span>
            <h1 className="ml-2 text-xl font-semibold text-[#323130]">
              Call Center <span className="hidden sm:inline">Time Tracker</span>
            </h1>
          </div>
        </div>
        
        {/* User and controls */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center bg-[#F3F2F1] rounded-full px-3 py-1">
            <span className="material-icons text-[#107C10] mr-1">circle</span>
            <span className="text-[#323130] text-sm">Online: {statusSummary?.online || 0}</span>
          </div>
          <div className="hidden md:flex items-center bg-[#F3F2F1] rounded-full px-3 py-1">
            <span className="material-icons text-[#FFB900] mr-1">pause_circle</span>
            <span className="text-[#323130] text-sm">En pausa: {statusSummary?.break || 0}</span>
          </div>
          <div className="flex items-center">
            <div className="rounded-full bg-[#0078D4] h-8 w-8 flex items-center justify-center text-white">
              <span className="text-sm font-semibold">JD</span>
            </div>
            <div className="ml-2 hidden md:block">
              <p className="text-sm font-medium text-[#323130]">Juan Diaz</p>
              <p className="text-xs text-[#605E5C]">Supervisor</p>
            </div>
            <button className="ml-2 text-[#605E5C]">
              <span className="material-icons">arrow_drop_down</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
