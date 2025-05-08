import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getStatusText, getStatusColor } from "@/lib/utils";
import { useState } from "react";

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
  });
  
  // Fetch user statuses
  const { data: userStatuses, isLoading: statusesLoading } = useQuery({
    queryKey: ['/api/user-statuses'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  const isLoading = usersLoading || statusesLoading;
  
  // Build enhanced user list with status
  const buildUserList = () => {
    if (!userStatuses || !users) return [];
    
    return users.map((user: any) => {
      const status = userStatuses.find((s: any) => s.userId === user.id);
      return {
        ...user,
        status: status?.status || "offline",
        lastClockIn: status?.lastClockIn,
      };
    });
  };
  
  const allEmployees = buildUserList();
  
  // Filter employees based on search query
  const filteredEmployees = searchQuery 
    ? allEmployees.filter((employee: any) => 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allEmployees;

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#323130]">Empleados</h2>
        <p className="text-[#605E5C]">Gestión de empleados y su estado actual</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-[#605E5C]">
            <span className="material-icons">search</span>
          </span>
          <Input
            className="pl-10 bg-white"
            placeholder="Buscar empleado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="bg-[#0078D4] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#2B88D8] flex items-center justify-center">
          <span className="material-icons mr-2">add</span>
          <span>Añadir Empleado</span>
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <span className="material-icons animate-spin text-[#0078D4]">refresh</span>
          <p className="mt-2 text-[#605E5C]">Cargando empleados...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee: any) => (
            <Card key={employee.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-[#2B88D8] text-white flex items-center justify-center mr-3">
                      <span className="text-lg font-semibold">{employee.avatarInitials}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <p className="text-sm text-[#605E5C]">{employee.position}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                    {getStatusText(employee.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="text-sm">
                    <p className="text-[#605E5C]">ID:</p>
                    <p className="font-medium">#{employee.id}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-[#605E5C]">Usuario:</p>
                    <p className="font-medium">{employee.username}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-[#605E5C]">Rol:</p>
                    <p className="font-medium">
                      {employee.role === "supervisor" ? "Supervisor" : "Empleado"}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="text-[#605E5C]">Estado:</p>
                    <p className="font-medium">{getStatusText(employee.status)}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="text-[#0078D4] hover:text-[#2B88D8] px-2 py-1 rounded">
                    <span className="material-icons">edit</span>
                  </button>
                  <button className="text-[#605E5C] hover:text-[#323130] px-2 py-1 rounded">
                    <span className="material-icons">visibility</span>
                  </button>
                  <button className="text-[#D83B01] hover:text-[#F1707B] px-2 py-1 rounded">
                    <span className="material-icons">delete</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {filteredEmployees.length === 0 && !isLoading && (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <span className="material-icons text-[#605E5C] text-5xl">search_off</span>
          <p className="mt-2 text-[#323130] font-medium">No se encontraron empleados</p>
          <p className="text-[#605E5C]">Intente con otra búsqueda o añada un nuevo empleado</p>
        </div>
      )}
    </div>
  );
};

export default Employees;
