import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";

const TeamStatusTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch user statuses
  const { data: userStatuses, isLoading } = useQuery({
    queryKey: ['/api/user-statuses'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Fetch users
  const { data: users } = useQuery({
    queryKey: ['/api/users'],
  });
  
  // Build enhanced user list with status
  const buildUserList = () => {
    if (!userStatuses || !users) return [];
    
    return users.map((user: any) => {
      const status = userStatuses.find((s: any) => s.userId === user.id);
      return {
        ...user,
        status: status?.status || "offline",
        lastClockIn: status?.lastClockIn,
        workTime: "--:--", // This would be calculated
        breakTime: "--:--", // This would be calculated
      };
    });
  };
  
  const allUsers = buildUserList();
  
  // Filter users based on search query
  const filteredUsers = searchQuery 
    ? allUsers.filter((user: any) => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.position.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allUsers;
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-[#F3F2F1] p-6 text-center">
        <span className="material-icons animate-spin text-[#0078D4]">refresh</span>
        <p className="mt-2 text-[#605E5C]">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#F3F2F1] overflow-hidden">
      <div className="p-4 border-b border-[#F3F2F1] flex justify-between items-center">
        <h3 className="font-semibold text-[#323130]">Estado del Equipo</h3>
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Buscar empleado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-[#A19F9D] rounded-md px-3 py-1 text-sm w-40 md:w-auto"
          />
          <button className="ml-2 bg-[#F3F2F1] p-1 rounded-md">
            <span className="material-icons text-[#605E5C]">search</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#F3F2F1]">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-[#605E5C] text-sm">Empleado</th>
              <th className="py-3 px-4 text-left font-medium text-[#605E5C] text-sm">Estado</th>
              <th className="py-3 px-4 text-left font-medium text-[#605E5C] text-sm">Entrada</th>
              <th className="py-3 px-4 text-left font-medium text-[#605E5C] text-sm">Tiempo</th>
              <th className="py-3 px-4 text-left font-medium text-[#605E5C] text-sm">Pausas</th>
              <th className="py-3 px-4 text-right font-medium text-[#605E5C] text-sm">Acción</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user: any) => (
              <tr key={user.id} className="border-t border-[#F3F2F1] hover:bg-[#F3F2F1]">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-[#2B88D8] text-white flex items-center justify-center mr-2">
                      <span className="text-sm font-semibold">{user.avatarInitials}</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#323130]">{user.name}</p>
                      <p className="text-[#605E5C] text-sm">{user.position}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={user.status} />
                </td>
                <td className="py-3 px-4 text-[#323130]">{formatDateTime(user.lastClockIn) || "--:--"}</td>
                <td className="py-3 px-4 text-[#323130]">
                  {/* This would be calculated based on time records */}
                  {user.status === "offline" ? "0h 00m" : "2h 25m"}
                </td>
                <td className="py-3 px-4 text-[#323130]">
                  {/* This would be calculated based on break records */}
                  {user.status === "break" ? "25m" : "15m"}
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-[#605E5C] hover:text-[#0078D4]">
                    <span className="material-icons">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-[#F3F2F1] flex justify-between items-center">
        <div className="text-sm text-[#605E5C]">
          Mostrando {currentUsers.length} de {filteredUsers.length} empleados
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-[#A19F9D] text-[#605E5C] hover:bg-[#F3F2F1] disabled:opacity-50"
          >
            <span className="material-icons text-sm">chevron_left</span>
          </button>
          
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
            // Simple pagination logic for pages 1, 2, 3
            const pageNum = i + 1;
            return (
              <button 
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded ${
                  currentPage === pageNum 
                    ? "bg-[#0078D4] text-white" 
                    : "border border-[#A19F9D] text-[#605E5C] hover:bg-[#F3F2F1]"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 rounded border border-[#A19F9D] text-[#605E5C] hover:bg-[#F3F2F1] disabled:opacity-50"
          >
            <span className="material-icons text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let bgColor = "bg-[#A19F9D]";
  let label = "Offline";
  
  switch (status) {
    case "online":
      bgColor = "bg-[#107C10]";
      label = "Online";
      break;
    case "break":
      bgColor = "bg-[#FFB900]";
      label = "Pausa";
      break;
    case "late":
      bgColor = "bg-[#D83B01]";
      label = "Tarde";
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} text-white`}>
      {label}
    </span>
  );
};

export default TeamStatusTable;
