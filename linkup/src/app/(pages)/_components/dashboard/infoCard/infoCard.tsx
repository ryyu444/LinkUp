"use client";

import { LucideIcon, Search, Plus, Folder } from "lucide-react";

interface InfoCardProps {
  title: string;
  description: string;
  ctaText: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export default function InfoCard({
  title,
  description,
  ctaText,
  icon: Icon,
  onClick,
}: InfoCardProps) {
  return (
    <div
      onClick={onClick}
      className="w-full h-44 bg-white rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] shadow-[0_1px_3px_0_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-gray-200 cursor-pointer hover:shadow-md transition"
    >
      <div className="relative w-full h-full p-6">
        {/* Title */}
        <div className="text-black text-lg font-bold leading-7 font-['Inter'] mb-3">
          {title}
        </div>

        {/* Icon */}
        <Icon className="absolute top-6 right-6 w-5 h-5 text-gray-500" />

        {/* Description */}
        <div className="text-gray-600 text-sm font-normal leading-normal font-['Inter'] mb-6">
          {description}
        </div>

        {/* CTA */}
        <div className="text-blue-600 text-base font-normal leading-normal font-['Inter']">
          {ctaText}
        </div>
      </div>
    </div>
  );
}
