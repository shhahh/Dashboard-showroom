import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/5">
    <div className="flex items-center justify-between">
      {/* Left side: Content */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          {trend && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {trend}
            </span>
          )}
        </div>
      </div>

      {/* Right side: Minimalist Icon (No background color) */}
      <div className="rounded-xl border border-slate-100 p-2.5 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
        {Icon && <Icon size={20} strokeWidth={1.5} />}
      </div>
    </div>
  </div>
);

export default StatCard;