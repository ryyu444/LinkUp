"use client";

import { Users, MessageCircle, PlusCircle } from "lucide-react";

interface ActivityItem {
  icon: "join" | "comment" | "create";
  message: string;
  timestamp: string;
}

const iconMap = {
  join: <Users className="w-4 h-4 text-gray-600" />,
  comment: <MessageCircle className="w-4 h-4 text-gray-600" />,
  create: <PlusCircle className="w-4 h-4 text-gray-600" />,
};

const activityData: ActivityItem[] = [
  {
    icon: "join",
    message: "Sarah joined your Calculus Study Group",
    timestamp: "Today, 10:23 AM",
  },
  {
    icon: "comment",
    message: "Michael commented on Chemistry Lab Prep",
    timestamp: "Yesterday, 3:45 PM",
  },
  {
    icon: "create",
    message: "You created Programming Project session",
    timestamp: "Yesterday, 1:12 PM",
  },
];

export default function ActivityCard() {
  return (
    <div className="w-full h-60 bg-white rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] shadow-[0_1px_3px_0_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-gray-200 p-6 font-['Inter']">
      <div className="text-sky-950 text-lg font-bold leading-7 mb-4">
        Recent Activity
      </div>
      <div className="space-y-4">
        {activityData.map((activity, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-100 rounded-xl flex items-center justify-center">
              {iconMap[activity.icon]}
            </div>
            <div>
              <p className="text-gray-900 text-sm leading-tight">{activity.message}</p>
              <p className="text-gray-500 text-xs leading-none mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
