import React from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  bgColor: string;
  textColor?: string;
  onClick: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon: Icon,
  bgColor,
  textColor = 'text-white',
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`dashboard-card ${bgColor} ${textColor} h-28 flex flex-col items-center justify-center text-center space-y-3`}
    >
      <Icon className="w-8 h-8" />
      <span className="font-semibold text-sm leading-tight">{title}</span>
    </button>
  );
};