"use client"

import type { Task } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock, AlertTriangle } from "lucide-react"

function isPast(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.completed).length
  const active = total - completed
  const overdue = tasks.filter((t) => {
    if (!t.due_date || t.completed) return false
    const dueDate = new Date(t.due_date)
    return isPast(dueDate) && !isToday(dueDate)
  }).length

  const stats = [
    {
      label: "Totalt",
      value: total,
      icon: <Circle className="h-4 w-4" />,
      color: "text-foreground",
      bg: "bg-muted",
    },
    {
      label: "Aktive",
      value: active,
      icon: <Clock className="h-4 w-4" />,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      label: "Fullført",
      value: completed,
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Forfalt",
      value: overdue,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-red-600",
      bg: "bg-red-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className={`p-4 ${stat.bg} border-0`}>
          <div className="flex items-center gap-2">
            <div className={stat.color}>{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
