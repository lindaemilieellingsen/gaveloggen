"use client"

import type React from "react"

import type { Task, Category, Priority } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Calendar, Bell, Briefcase, User, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

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

function formatDate(date: Date): string {
  const months = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"]
  return `${date.getDate()}. ${months[date.getMonth()]}`
}

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string, completed: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const priorityColors: Record<Priority, string> = {
  high: "bg-red-500/10 text-red-600 border-red-500/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
}

const priorityLabels: Record<Priority, string> = {
  high: "Høy",
  medium: "Medium",
  low: "Lav",
}

const categoryIcons: Record<Category, React.ReactNode> = {
  work: <Briefcase className="h-3.5 w-3.5" />,
  personal: <User className="h-3.5 w-3.5" />,
  shopping: <ShoppingCart className="h-3.5 w-3.5" />,
}

const categoryLabels: Record<Category, string> = {
  work: "Arbeid",
  personal: "Personlig",
  shopping: "Shopping",
}

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const dueDate = task.due_date ? new Date(task.due_date) : null
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && !task.completed
  const isDueToday = dueDate && isToday(dueDate)

  return (
    <Card className={cn("p-4 transition-all hover:shadow-md border-border/50", task.completed && "opacity-60")}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => onToggleComplete(task.id, checked as boolean)}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "font-medium text-foreground truncate",
                  task.completed && "line-through text-muted-foreground",
                )}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Åpne meny</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Rediger
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Slett
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {priorityLabels[task.priority]}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              {categoryIcons[task.category]}
              {categoryLabels[task.category]}
            </Badge>
            {dueDate && (
              <Badge
                variant="outline"
                className={cn(
                  "gap-1",
                  isOverdue && "bg-red-500/10 text-red-600 border-red-500/20",
                  isDueToday && "bg-blue-500/10 text-blue-600 border-blue-500/20",
                )}
              >
                <Calendar className="h-3 w-3" />
                {isOverdue ? "Forfalt" : isDueToday ? "I dag" : formatDate(dueDate)}
              </Badge>
            )}
            {task.reminder && (
              <Badge variant="outline" className="gap-1">
                <Bell className="h-3 w-3" />
                Påminnelse
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
