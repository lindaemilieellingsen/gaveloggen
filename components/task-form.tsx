"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Task, TaskFormData, Category, Priority } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Briefcase, User, ShoppingCart } from "lucide-react"

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TaskFormData) => void
  task?: Task | null
  isLoading?: boolean
}

const categories: { value: Category; label: string; icon: React.ReactNode }[] = [
  { value: "work", label: "Arbeid", icon: <Briefcase className="h-4 w-4" /> },
  { value: "personal", label: "Personlig", icon: <User className="h-4 w-4" /> },
  { value: "shopping", label: "Shopping", icon: <ShoppingCart className="h-4 w-4" /> },
]

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: "high", label: "Høy", color: "text-red-500" },
  { value: "medium", label: "Medium", color: "text-amber-500" },
  { value: "low", label: "Lav", color: "text-emerald-500" },
]

export function TaskForm({ open, onOpenChange, onSubmit, task, isLoading }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    category: "personal",
    priority: "medium",
    due_date: "",
    reminder: "",
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        category: task.category,
        priority: task.priority,
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
        reminder: task.reminder ? task.reminder.split("T")[0] : "",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        category: "personal",
        priority: "medium",
        due_date: "",
        reminder: "",
      })
    }
  }, [task, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "Rediger oppgave" : "Ny oppgave"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tittel</Label>
            <Input
              id="title"
              placeholder="Hva skal gjøres?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivelse (valgfritt)</Label>
            <Textarea
              id="description"
              placeholder="Legg til detaljer..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value: Category) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        {cat.icon}
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioritet</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((pri) => (
                    <SelectItem key={pri.value} value={pri.value}>
                      <span className={pri.color}>{pri.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date">Frist (valgfritt)</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder">Påminnelse (valgfritt)</Label>
              <Input
                id="reminder"
                type="date"
                value={formData.reminder}
                onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Lagrer..." : task ? "Lagre endringer" : "Opprett oppgave"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
