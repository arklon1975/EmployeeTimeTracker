interface StatusCardProps {
  title: string;
  icon: string;
  iconColor: string;
  count: number;
  total: number;
  trend?: {
    value: number;
    direction: "up" | "down" | "flat";
  };
  progressColor: string;
}

const StatusCard = ({
  title,
  icon,
  iconColor,
  count,
  total,
  trend,
  progressColor
}: StatusCardProps) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-[#F3F2F1]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-[#605E5C]">{title}</h3>
        <span className={`material-icons text-[${iconColor}]`}>{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-semibold">{count}</p>
          <p className="text-[#605E5C] text-sm">de {total} empleados</p>
        </div>
        {trend && (
          <div className={`text-sm flex items-center ${
            trend.direction === "up" 
              ? "text-[#107C10]" 
              : trend.direction === "down" 
                ? "text-[#D83B01]" 
                : "text-[#605E5C]"
          }`}>
            <span className="material-icons mr-1">
              {trend.direction === "up" 
                ? "trending_up" 
                : trend.direction === "down" 
                  ? "trending_down" 
                  : "trending_flat"}
            </span>
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <div className="w-full bg-[#F3F2F1] rounded-full h-1 mt-3">
        <div className={`${progressColor} h-1 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default StatusCard;
