import React from 'react';
import { LucideIcon } from 'lucide-react';

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
      className={`
        ${bgColor} ${textColor}
        h-28 w-full
        flex flex-col items-center justify-center text-center
        space-y-3
        rounded-xl
        border-2 border-[#0A3764]
        shadow-md
        hover:scale-105 hover:shadow-lg
        transition-transform duration-200 ease-in-out
      `}
    >
      <Icon className="w-8 h-8" />
      <span className="font-semibold text-sm leading-tight">{title}</span>
    </button>
  );
};
