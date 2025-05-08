import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Schedule = () => {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#323130]">Horarios</h2>
        <p className="text-[#605E5C]">Gestión de turnos y horarios de trabajo</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Página en desarrollo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <span className="material-icons text-5xl text-[#0078D4]">schedule</span>
            <h3 className="mt-4 text-xl font-medium text-[#323130]">Funcionalidad de horarios en construcción</h3>
            <p className="mt-2 text-[#605E5C] text-center max-w-md">
              Esta sección permitirá gestionar los turnos de trabajo, asignar horarios a los empleados 
              y definir las políticas de asistencia y pausas.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <span className="material-icons mr-2 text-[#0078D4]">today</span>
              Turnos Actuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#605E5C]">Próximamente: Vista de turnos del día actual</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <span className="material-icons mr-2 text-[#0078D4]">calendar_month</span>
              Calendario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#605E5C]">Próximamente: Calendario mensual de turnos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <span className="material-icons mr-2 text-[#0078D4]">settings</span>
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#605E5C]">Próximamente: Ajustes de políticas de horarios</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
