import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import useCurrentTime from "@/hooks/use-current-time";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TimeControlProps {
  userId: number;
}

const TimeControl = ({ userId }: TimeControlProps) => {
  const { toast } = useToast();
  const { currentTime, currentDateStr } = useCurrentTime();
  
  // Get user status
  const { data: userStatus } = useQuery({
    queryKey: [`/api/user-statuses/${userId}`],
    refetchInterval: 10000,
  });
  
  // Get user work time
  const { data: workTime } = useQuery({
    queryKey: [`/api/users/${userId}/work-time`],
    refetchInterval: 60000, // Refresh every minute
  });

  // Clock in mutation
  const clockInMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/time-records", { 
        userId, 
        type: "clock-in" 
      });
    },
    onSuccess: () => {
      toast({
        title: "Entrada registrada",
        description: "Has iniciado tu jornada laboral correctamente",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/user-statuses/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/work-time`] });
      queryClient.invalidateQueries({ queryKey: ['/api/status-summary'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error) => {
      toast({
        title: "Error al registrar entrada",
        description: "Hubo un problema al procesar tu registro",
        variant: "destructive",
      });
    }
  });

  // Clock out mutation
  const clockOutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/time-records", { 
        userId, 
        type: "clock-out" 
      });
    },
    onSuccess: () => {
      toast({
        title: "Salida registrada",
        description: "Has finalizado tu jornada laboral correctamente",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/user-statuses/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/work-time`] });
      queryClient.invalidateQueries({ queryKey: ['/api/status-summary'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error) => {
      toast({
        title: "Error al registrar salida",
        description: "Hubo un problema al procesar tu registro",
        variant: "destructive",
      });
    }
  });

  // Start break mutation
  const startBreakMutation = useMutation({
    mutationFn: async (breakType: string) => {
      return apiRequest("POST", "/api/break-records", { 
        userId, 
        type: breakType 
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Pausa iniciada",
        description: `Has iniciado tu pausa de ${variables === "coffee" ? "café" : "comida"}`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/user-statuses/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/work-time`] });
      queryClient.invalidateQueries({ queryKey: ['/api/status-summary'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error) => {
      toast({
        title: "Error al iniciar pausa",
        description: "Hubo un problema al procesar tu solicitud",
        variant: "destructive",
      });
    }
  });

  // End break mutation
  const endBreakMutation = useMutation({
    mutationFn: async () => {
      if (!userStatus?.currentBreakId) return null;
      return apiRequest("PUT", `/api/break-records/${userStatus.currentBreakId}/end`, {});
    },
    onSuccess: () => {
      toast({
        title: "Pausa finalizada",
        description: "Has regresado a tu trabajo",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/user-statuses/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/work-time`] });
      queryClient.invalidateQueries({ queryKey: ['/api/status-summary'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error) => {
      toast({
        title: "Error al finalizar pausa",
        description: "Hubo un problema al procesar tu solicitud",
        variant: "destructive",
      });
    }
  });

  const isOnBreak = userStatus?.status === "break";
  const isOnline = userStatus?.status === "online" || userStatus?.status === "late";
  const isOffline = userStatus?.status === "offline" || !userStatus?.status;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#F3F2F1] overflow-hidden">
      <div className="p-4 border-b border-[#F3F2F1]">
        <h3 className="font-semibold text-[#323130]">Control de Tiempo</h3>
      </div>
      <div className="p-6 flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-10">
        {/* Time display */}
        <div className="text-center">
          <p className="text-sm text-[#605E5C] mb-1">Hora actual</p>
          <p className="text-4xl font-semibold text-[#323130]">{currentTime}</p>
          <p className="text-sm text-[#605E5C] mt-1">{currentDateStr}</p>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col items-center">
          <div className="flex space-x-4 mb-4">
            <Button 
              onClick={() => clockInMutation.mutate()}
              disabled={clockInMutation.isPending || isOnline || isOnBreak}
              className={`px-6 py-3 bg-[#107C10] text-white font-medium rounded-md shadow hover:bg-opacity-90 flex items-center ${isOffline ? 'pulse' : ''}`}
            >
              <span className="material-icons mr-2">login</span>
              <span>Entrada</span>
            </Button>
            <Button 
              onClick={() => clockOutMutation.mutate()}
              disabled={clockOutMutation.isPending || isOffline || (!isOnline && !isOnBreak)}
              className="px-6 py-3 bg-[#D83B01] text-white font-medium rounded-md shadow hover:bg-opacity-90 flex items-center"
            >
              <span className="material-icons mr-2">logout</span>
              <span>Salida</span>
            </Button>
          </div>
          {isOnBreak ? (
            <Button 
              onClick={() => endBreakMutation.mutate()}
              disabled={endBreakMutation.isPending}
              className="px-4 py-2 bg-[#0078D4] text-white font-medium rounded-md hover:bg-opacity-90 flex items-center"
            >
              <span className="material-icons mr-2">play_arrow</span>
              <span>Finalizar pausa</span>
            </Button>
          ) : (
            <div className="flex space-x-4">
              <Button 
                onClick={() => startBreakMutation.mutate("coffee")}
                disabled={startBreakMutation.isPending || !isOnline}
                className="px-4 py-2 border border-[#FFB900] text-[#FFB900] font-medium rounded-md hover:bg-[#FFB900] hover:text-white flex items-center"
                variant="outline"
              >
                <span className="material-icons mr-2">free_breakfast</span>
                <span>Pausa café</span>
              </Button>
              <Button 
                onClick={() => startBreakMutation.mutate("lunch")}
                disabled={startBreakMutation.isPending || !isOnline}
                className="px-4 py-2 border border-[#FFB900] text-[#FFB900] font-medium rounded-md hover:bg-[#FFB900] hover:text-white flex items-center"
                variant="outline"
              >
                <span className="material-icons mr-2">restaurant</span>
                <span>Pausa comida</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-[#F3F2F1] bg-[#F3F2F1] flex justify-between items-center">
        <div className="flex items-center">
          <span className={`h-2 w-2 rounded-full inline-block mr-2 ${getStatusColor(userStatus?.status)}`}></span>
          <span className="text-sm text-[#605E5C]">
            Su estado: <span className={`font-medium ${getStatusTextColor(userStatus?.status)}`}>
              {getStatusText(userStatus?.status)}
            </span>
          </span>
        </div>
        <div className="text-sm text-[#605E5C]">
          Tiempo conectado hoy: <span className="font-medium">{workTime?.workTimeFormatted || "0h 0m"}</span>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getStatusColor(status?: string): string {
  switch (status) {
    case "online": return "bg-[#107C10]";
    case "break": return "bg-[#FFB900]";
    case "offline": return "bg-[#A19F9D]";
    case "late": return "bg-[#D83B01]";
    default: return "bg-[#A19F9D]";
  }
}

function getStatusText(status?: string): string {
  switch (status) {
    case "online": return "Online";
    case "break": return "En pausa";
    case "offline": return "Offline";
    case "late": return "Tarde";
    default: return "Offline";
  }
}

function getStatusTextColor(status?: string): string {
  switch (status) {
    case "online": return "text-[#107C10]";
    case "break": return "text-[#FFB900]";
    case "offline": return "text-[#A19F9D]";
    case "late": return "text-[#D83B01]";
    default: return "text-[#A19F9D]";
  }
}

export default TimeControl;
