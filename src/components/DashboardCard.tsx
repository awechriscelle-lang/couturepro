import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

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
      className={`${bgColor} ${textColor} p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 h-32 flex flex-col items-center justify-center text-center space-y-2`}
    >
      <Icon className="w-8 h-8" />
      <span className="font-semibold text-sm leading-tight">{title}</span>
    </button>
  );
};