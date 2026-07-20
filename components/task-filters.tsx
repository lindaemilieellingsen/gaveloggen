"use client"

import type { Category, Priority } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface TaskFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  category: Category | "all"
  onCategoryChange: (value: Category | "all") => void
  priority: Priority | "all"
  onPriorityChange: (value: Priority | "all") => void
  status: "all" | "active" | "completed"
  onStatusChange: (value: "all" | "active" | "completed") => void
}

export function TaskFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  priority,
  onPriorityChange,
  status,
  onStatusChange,
}: TaskFiltersProps) {
  const hasFilters = search || category !== "all" || priority !== "all" || status !== "all"

  const clearFilters = () => {
    onSearchChange("")
    onCategoryChange("all")
    onPriorityChange("all")
    onStatusChange("all")
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Søk i oppgaver..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle kategorier</SelectItem>
            <SelectItem value="work">Arbeid</SelectItem>
            <SelectItem value="personal">Personlig</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Prioritet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle prioriteter</SelectItem>
            <SelectItem value="high">Høy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Lav</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="active">Aktive</SelectItem>
            <SelectItem value="completed">Fullført</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
            <span className="sr-only">Nullstill filtre</span>
          </Button>
        )}
      </div>
    </div>
  )
}
