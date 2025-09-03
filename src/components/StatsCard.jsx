import React from 'react'

const StatsCard = ({ title, value, icon, trend }) => {
  return (
    <div className="card-bg rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        {trend && (
          <div className="text-sm text-green-400 font-medium">
            {trend}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-white/60 text-sm">{title}</p>
      </div>
    </div>
  )
}

export default StatsCard