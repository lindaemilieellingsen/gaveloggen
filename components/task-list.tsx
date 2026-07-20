"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Task, TaskFormData, Category, Priority } from "@/lib/types"
import { TaskCard } from "./task-card"
import { TaskForm } from "./task-form"
import { TaskFilters } from "./task-filters"
import { TaskStats } from "./task-stats"
import { Button } from "@/components/ui/button"
import { Plus, ListTodo } from "lucide-react"

interface TaskListProps {
  userId: string
}

export function TaskList({ userId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filters
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all")

  const supabase = createClient()

  const fetchTasks = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setTasks(data)
    }
    setIsLoading(false)
  }, [userId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        search === "" ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase())

      const matchesCategory = categoryFilter === "all" || task.category === categoryFilter

      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !task.completed) ||
        (statusFilter === "completed" && task.completed)

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus
    })
  }, [tasks, search, categoryFilter, priorityFilter, statusFilter])

  const handleCreateTask = async (formData: TaskFormData) => {
    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: userId,
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          priority: formData.priority,
          due_date: formData.due_date || null,
          reminder: formData.reminder || null,
        })
        .select()
        .single()

      if (error) throw error
      if (data) {
        setTasks((prev) => [data, ...prev])
      }
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error creating task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTask = async (formData: TaskFormData) => {
    if (!editingTask) return
    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("tasks")
        .update({
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          priority: formData.priority,
          due_date: formData.due_date || null,
          reminder: formData.reminder || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingTask.id)
        .select()
        .single()

      if (error) throw error
      if (data) {
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? data : t)))
      }
      setEditingTask(null)
    } catch (error) {
      console.error("Error updating task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) throw error
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)))
    } catch (error) {
      console.error("Error toggling task:", error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id)

      if (error) throw error
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  return (
    <div className="space-y-6">
      <TaskStats tasks={tasks} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold">Mine oppgaver</h2>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Ny oppgave
        </Button>
      </div>

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        status={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <ListTodo className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-1">
            {tasks.length === 0 ? "Ingen oppgaver ennå" : "Ingen oppgaver funnet"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {tasks.length === 0 ? "Kom i gang ved å opprette din første oppgave" : "Prøv å endre filtrene dine"}
          </p>
          {tasks.length === 0 && (
            <Button onClick={() => setIsFormOpen(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Opprett oppgave
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      <TaskForm open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={handleCreateTask} isLoading={isSubmitting} />

      <TaskForm
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onSubmit={handleUpdateTask}
        task={editingTask}
        isLoading={isSubmitting}
      />
    </div>
  )
}
