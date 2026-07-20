"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, GiftIcon, CheckSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface YearCalendarProps {
  userId: string
}

interface Task {
  id: string
  title: string
  due_date: string | null
  is_completed: boolean
}

interface Gift {
  id: string
  title: string
  occasion: string
  year: number
  is_idea: boolean
  person_id: string
}

interface Person {
  id: string
  name: string
}

const MONTHS = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
]

export function YearCalendar({ userId }: YearCalendarProps) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [tasks, setTasks] = useState<Task[]>([])
  const [gifts, setGifts] = useState<Gift[]>([])
  const [persons, setPersons] = useState<Person[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [userId, year])

  const fetchData = async () => {
    const supabase = createClient()

    // Hent oppgaver med frister i dette året
    const startOfYear = `${year}-01-01`
    const endOfYear = `${year}-12-31`

    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .gte("due_date", startOfYear)
      .lte("due_date", endOfYear)
      .eq("user_id", userId)

    if (tasksData) setTasks(tasksData)

    // Hent gaver for dette året
    const { data: giftsData } = await supabase
      .from("gifts")
      .select("*")
      .eq("year", year)
      .eq("user_id", userId)
      .eq("is_idea", false)

    if (giftsData) setGifts(giftsData)

    // Hent personer
    const { data: personsData } = await supabase.from("persons").select("*").eq("user_id", userId)

    if (personsData) setPersons(personsData)
  }

  const getTasksForMonth = (month: number) => {
    return tasks.filter((task) => {
      if (!task.due_date) return false
      const taskDate = new Date(task.due_date)
      return taskDate.getMonth() === month
    })
  }

  const getGiftsForMonth = (month: number) => {
    // Jul = desember (11), bursdager kan være når som helst
    if (month === 11) {
      return gifts.filter((gift) => gift.occasion === "jul")
    }
    return []
  }

  const getPersonName = (personId: string) => {
    const person = persons.find((p) => p.id === personId)
    return person?.name || "Ukjent"
  }

  const getMonthColor = (month: number) => {
    const monthTasks = getTasksForMonth(month)
    const monthGifts = getGiftsForMonth(month)
    const hasItems = monthTasks.length > 0 || monthGifts.length > 0

    if (!hasItems) return "bg-muted/30"

    const hasOverdue = monthTasks.some((task) => {
      if (task.is_completed) return false
      const dueDate = new Date(task.due_date!)
      return dueDate < new Date()
    })

    if (hasOverdue) return "bg-red-100 dark:bg-red-900/20"
    return "bg-primary/10"
  }

  return (
    <div className="space-y-6">
      {/* År-navigasjon */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setYear(year - 1)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl">{year}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setYear(year + 1)}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Årshjul - 12 måneder i grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {MONTHS.map((month, index) => {
          const monthTasks = getTasksForMonth(index)
          const monthGifts = getGiftsForMonth(index)
          const isSelected = selectedMonth === index

          return (
            <Card
              key={month}
              className={`cursor-pointer transition-all hover:shadow-md ${getMonthColor(index)} ${isSelected ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedMonth(isSelected ? null : index)}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold text-center mb-2">{month}</h3>
                <div className="flex justify-center gap-2">
                  {monthTasks.length > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckSquare className="h-3 w-3" />
                      {monthTasks.length}
                    </Badge>
                  )}
                  {monthGifts.length > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      <GiftIcon className="h-3 w-3" />
                      {monthGifts.length}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detaljer for valgt måned */}
      {selectedMonth !== null && (
        <Card>
          <CardHeader>
            <CardTitle>
              {MONTHS[selectedMonth]} {year}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Oppgaver */}
            {getTasksForMonth(selectedMonth).length > 0 && (
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <CheckSquare className="h-4 w-4 text-primary" />
                  Oppgaver
                </h4>
                <ul className="space-y-2">
                  {getTasksForMonth(selectedMonth).map((task) => (
                    <li key={task.id} className="flex items-center gap-2 text-sm">
                      <span className={task.is_completed ? "line-through text-muted-foreground" : ""}>
                        {task.title}
                      </span>
                      {task.due_date && (
                        <Badge variant="outline" className="text-xs">
                          {new Date(task.due_date).toLocaleDateString("nb-NO")}
                        </Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gaver */}
            {getGiftsForMonth(selectedMonth).length > 0 && (
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <GiftIcon className="h-4 w-4 text-primary" />
                  Gaver
                </h4>
                <ul className="space-y-2">
                  {getGiftsForMonth(selectedMonth).map((gift) => (
                    <li key={gift.id} className="flex items-center gap-2 text-sm">
                      <span>{gift.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {getPersonName(gift.person_id)}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {getTasksForMonth(selectedMonth).length === 0 && getGiftsForMonth(selectedMonth).length === 0 && (
              <p className="text-muted-foreground text-sm">Ingen oppgaver eller gaver denne måneden.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Årsoppsummering */}
      <Card>
        <CardHeader>
          <CardTitle>Årsoppsummering {year}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <CheckSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{tasks.length}</p>
              <p className="text-sm text-muted-foreground">Oppgaver</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <GiftIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{gifts.length}</p>
              <p className="text-sm text-muted-foreground">Gaver gitt</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
