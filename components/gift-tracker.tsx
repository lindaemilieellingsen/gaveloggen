"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Gift, Person, GiftOccasion } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  User,
  Lightbulb,
  Check,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Share2,
  Copy,
  ArrowLeft,
  Users,
  History,
  GripVertical,
  UserPlus,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { t, tArray } from "@/lib/translations"

interface GiftTrackerProps {
  userId: string
}

export function GiftTracker({ userId }: GiftTrackerProps) {
  const { language } = useLanguage()

  const [people, setPeople] = useState<Person[]>([])
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterYear, setFilterYear] = useState<string>("all")
  const [filterOccasion, setFilterOccasion] = useState<string>("all")
  const [filterPerson, setFilterPerson] = useState<string>("all")
  const [showIdeasOnly, setShowIdeasOnly] = useState(false)
  const [showAllIdeas, setShowAllIdeas] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareText, setShareText] = useState("")
  const [copied, setCopied] = useState(false)

  // Dialog states
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [newPersonName, setNewPersonName] = useState("")
  const [personError, setPersonError] = useState("")
  const [giftDialogOpen, setGiftDialogOpen] = useState(false)
  const [preSelectedPersonId, setPreSelectedPersonId] = useState<string | null>(null)
  const [isGiveGiftDialogOpen, setIsGiveGiftDialogOpen] = useState(false)
  const [giftToGive, setGiftToGive] = useState<Gift | null>(null)
  const [giveGiftForm, setGiveGiftForm] = useState({
    occasion: "christmas" as "christmas" | "birthday" | "other",
    occasion_custom: "",
    year: new Date().getFullYear(),
  })

  const [convertingIdea, setConvertingIdea] = useState<Gift | null>(null)

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  const [giftForm, setGiftForm] = useState({
    person_id: "",
    title: "",
    description: "",
    occasion: "jul" as GiftOccasion,
    occasion_custom: "",
    year: new Date().getFullYear(),
    is_idea: false,
  })

  const [editingGift, setEditingGift] = useState<Gift | null>(null)

  const [showHistory, setShowHistory] = useState(false)
  const [historyFilterYear, setHistoryFilterYear] = useState<string>("all")
  const [historyFilterOccasion, setHistoryFilterOccasion] = useState<string>("all")

  // Added state for drag and drop
  const [draggedPerson, setDraggedPerson] = useState<Person | null>(null)
  const [dragOverPersonId, setDragOverPersonId] = useState<string | null>(null)

  const EXAMPLE_PEOPLE = tArray("examples.people", language)

  const YEARS = ["2027", "2026", "2025", "2024", "2023", "earlier"]

  const getYearLabel = (year: string) => {
    if (year === "earlier") return t("tracker.earlier", language)
    return year
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDragStart = (e: React.DragEvent, person: Person) => {
    setDraggedPerson(person)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, personId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (draggedPerson && draggedPerson.id !== personId) {
      setDragOverPersonId(personId)
    }
  }

  const handleDragLeave = () => {
    setDragOverPersonId(null)
  }

  const handleDrop = async (e: React.DragEvent, targetPerson: Person) => {
    e.preventDefault()
    setDragOverPersonId(null)

    if (!draggedPerson || draggedPerson.id === targetPerson.id) {
      setDraggedPerson(null)
      return
    }

    // Reorder the list locally
    const oldIndex = people.findIndex((p) => p.id === draggedPerson.id)
    const newIndex = people.findIndex((p) => p.id === targetPerson.id)

    const newPeople = [...people]
    newPeople.splice(oldIndex, 1)
    newPeople.splice(newIndex, 0, draggedPerson)

    // Update sort_order for all affected people
    const updatedPeople = newPeople.map((p, index) => ({
      ...p,
      sort_order: index,
    }))

    setPeople(updatedPeople)
    setDraggedPerson(null)

    // Save new order to database
    await fetch("/api/people/sort", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPeople.map((p, i) => ({ id: p.id, sort_order: i }))),
    })
  }

  const handleDragEnd = () => {
    setDraggedPerson(null)
    setDragOverPersonId(null)
  }

  const fetchData = async () => {
    const [peopleRes, giftsRes] = await Promise.all([
      fetch("/api/people"),
      fetch("/api/gifts"),
    ])

    if (peopleRes.ok) setPeople(await peopleRes.json())
    if (giftsRes.ok) setGifts(await giftsRes.json())
    setLoading(false)
  }

  const addPerson = async () => {
    if (!newPersonName.trim()) return
    const name = newPersonName.trim()

    if (people.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      setPersonError(t("tracker.personExists", language))
      return
    }

    // Update: set sort_order
    const newSortOrder = people.length > 0 ? Math.max(...people.map((p) => p.sort_order || 0)) + 1 : 0

    const res = await fetch("/api/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPersonName.trim(), sort_order: newSortOrder }),
    })

    if (!res.ok) {
      setPersonError(t("tracker.couldNotAddPerson", language))
      return
    }

    const data = await res.json()
    if (data) {
      setPeople([...people, data])
      setNewPersonName("")
      setShowAddPerson(false)
      setPersonError("")
    }
  }

  const addExamplePeople = async () => {
    const newPeople = EXAMPLE_PEOPLE.filter((name) => !people.some((p) => p.name.toLowerCase() === name.toLowerCase()))

    if (newPeople.length === 0) return

    // Update: assign sort_order when adding example people
    const currentMaxSortOrder = people.length > 0 ? Math.max(...people.map((p) => p.sort_order || 0)) : -1
    const peopleToAdd = newPeople.map((name, index) => ({
      name,
      sort_order: currentMaxSortOrder + 1 + index,
    }))

    const res = await fetch("/api/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(peopleToAdd),
    })

    if (res.ok) {
      const data = await res.json()
      setPeople([...people, ...data])
    }
  }

  const deletePerson = async (personId: string) => {
    await fetch(`/api/people/${personId}`, { method: "DELETE" })
    setPeople(people.filter((p) => p.id !== personId))
    setGifts(gifts.filter((g) => g.person_id !== personId))
  }

  const saveGift = async () => {
    if (!giftForm.person_id || !giftForm.title.trim()) return

    const giftData = {
      person_id: giftForm.person_id,
      title: giftForm.title.trim(),
      description: giftForm.description.trim() || null,
      occasion: giftForm.occasion,
      occasion_custom: giftForm.occasion === "annet" ? giftForm.occasion_custom.trim() : null,
      year: giftForm.year,
      is_idea: giftForm.is_idea,
    }

    if (convertingIdea) {
      const res = await fetch(`/api/gifts/${convertingIdea.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(giftData),
      })
      if (res.ok) {
        const updated = await res.json()
        setGifts(gifts.map((g) => (g.id === convertingIdea.id ? updated : g)))
      }
    } else if (editingGift) {
      const res = await fetch(`/api/gifts/${editingGift.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(giftData),
      })
      if (res.ok) {
        const updated = await res.json()
        setGifts(gifts.map((g) => (g.id === editingGift.id ? updated : g)))
      }
    } else {
      const res = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(giftData),
      })
      if (res.ok) {
        const newGift = await res.json()
        setGifts([newGift, ...gifts])
      }
    }

    resetGiftForm()
  }

  const deleteGift = async (giftId: string) => {
    await fetch(`/api/gifts/${giftId}`, { method: "DELETE" })
    setGifts(gifts.filter((g) => g.id !== giftId))
  }

  const openGiveGiftDialog = (gift: Gift) => {
    setGiftToGive(gift) // Set the gift for the simple dialog
    setGiveGiftForm({
      occasion: "christmas",
      occasion_custom: "",
      year: new Date().getFullYear(),
    })
    setIsGiveGiftDialogOpen(true) // Open the simple dialog that exists in showAllIdeas
  }

  const markAsGiven = async () => {
    if (!giftToGive) {
      return
    }

    const res = await fetch(`/api/gifts/${giftToGive.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        is_idea: false,
        occasion: giveGiftForm.occasion,
        occasion_custom: giveGiftForm.occasion === "other" ? giveGiftForm.occasion_custom : null,
        year: giveGiftForm.year,
      }),
    })

    if (!res.ok) return

    const updated = await res.json()
    setGifts(gifts.map((g) => (g.id === giftToGive.id ? updated : g)))
    setIsGiveGiftDialogOpen(false)
    setGiftToGive(null)
  }

  const resetGiftForm = () => {
    setGiftForm({
      person_id: "",
      title: "",
      description: "",
      occasion: "jul",
      occasion_custom: "",
      year: new Date().getFullYear(),
      is_idea: false,
    })
    setEditingGift(null)
    setConvertingIdea(null) // Reset converting idea state
    setGiftDialogOpen(false)
  }

  const startEditGift = (gift: Gift) => {
    setGiftForm({
      person_id: gift.person_id,
      title: gift.title,
      description: gift.description || "",
      occasion: gift.occasion,
      occasion_custom: gift.occasion_custom || "",
      year: gift.year,
      is_idea: gift.is_idea,
    })
    setEditingGift(gift)
    setGiftDialogOpen(true)
  }

  const openGiftDialogForPerson = (personId: string) => {
    setPreSelectedPersonId(personId)
    setGiftForm({
      person_id: personId,
      title: "",
      description: "",
      occasion: "jul",
      occasion_custom: "",
      year: new Date().getFullYear(),
      is_idea: true,
    })
    setEditingGift(null)
    setGiftDialogOpen(true)
  }

  const selectedPersonGifts = selectedPerson ? gifts.filter((g) => g.person_id === selectedPerson.id) : []
  const givenGifts = selectedPersonGifts.filter((g) => !g.is_idea)
  const ideaGifts = selectedPersonGifts.filter((g) => g.is_idea)
  const allIdeas = gifts.filter((g) => g.is_idea)

  const allGivenGifts = gifts.filter((g) => !g.is_idea)

  const filteredHistoryGifts = allGivenGifts.filter((gift) => {
    const matchesYear = historyFilterYear === "all" || gift.year.toString() === historyFilterYear
    const matchesOccasion = historyFilterOccasion === "all" || gift.occasion === historyFilterOccasion
    return matchesYear && matchesOccasion
  })

  // Filter gifts
  const filteredGifts = gifts.filter((gift) => {
    const matchesSearch =
      searchQuery === "" ||
      gift.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.person?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesYear = filterYear === "all" || gift.year.toString() === filterYear
    const matchesOccasion = filterOccasion === "all" || gift.occasion === filterOccasion
    const matchesPerson = filterPerson === "all" || gift.person_id === filterPerson
    const matchesIdea = !showIdeasOnly || gift.is_idea

    return matchesSearch && matchesYear && matchesOccasion && matchesPerson && matchesIdea
  })

  // Get unique years for filter
  const uniqueGiftYears = [...new Set(gifts.map((g) => g.year))].sort((a, b) => b - a)

  const getOccasionLabel = (occasion: string, custom?: string | null) => {
    if (occasion === "jul") return t("tracker.christmas", language)
    if (occasion === "bursdag") return t("tracker.birthday", language)
    if (occasion === "christmas") return t("tracker.christmas", language)
    if (occasion === "birthday") return t("tracker.birthday", language)
    return custom || t("tracker.other", language)
  }

  const getOccasionColor = (occasion: string) => {
    if (occasion === "jul") return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    if (occasion === "bursdag") return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    if (occasion === "christmas") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    if (occasion === "birthday") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
  }

  const shareIdeasText = (person: Person, ideas: Gift[]) => {
    let text = `${t("tracker.ideasFor", language)} ${person.name}:\n\n`
    ideas.forEach((idea) => {
      text += `• ${idea.title}`
      if (idea.description) {
        text += ` - ${idea.description}`
      }
      text += "\n"
    })
    return text
  }

  const handleShare = () => {
    if (!selectedPerson) return
    const text = shareIdeasText(selectedPerson, ideaGifts)
    setShareText(text)
    setShowShareDialog(true)
    setCopied(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (showAllIdeas) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowAllIdeas(false)} className="text-[#5C4A1F]">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("tracker.back", language)}
          </Button>
          <h2 className="text-xl font-semibold text-[#5C4A1F] font-serif">{t("tracker.allGiftIdeas", language)}</h2>
        </div>

        {allIdeas.length === 0 ? (
          <Card className="bg-gradient-to-br from-[#FDF8F0]/80 to-[#F5EBD7]/80 border-[#C9A227]/30 backdrop-blur-sm">
            <CardContent className="py-1 text-center text-muted-foreground text-lg">
              {t("tracker.noIdeasYet", language)}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-0.5">
            {/* Group ideas by person */}
            {/* Update: ensure people list is sorted by sort_order when displaying */}
            {people
              .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
              .map((person) => {
                const personIdeas = allIdeas.filter((g) => g.person_id === person.id)
                if (personIdeas.length === 0) return null

                return (
                  <Card
                    key={person.id}
                    className="bg-gradient-to-br from-[#FDF8F0]/80 to-[#F5EBD7]/80 border-[#C9A227]/30 rounded-lg backdrop-blur-sm"
                  >
                    <CardHeader className="py-0.5 px-2 pb-0 mb-0">
                      <CardTitle className="text-lg flex items-center gap-1 leading-none mb-0">
                        <User className="h-4 w-4 text-primary" />
                        {person.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-2 pt-0 pb-0.5">
                      <div className="divide-y divide-muted/30">
                        {personIdeas.map((gift) => (
                          <div key={gift.id} className="flex items-center justify-between py-0.5">
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-lg leading-none">{gift.title}</span>
                              {gift.description && (
                                <span className="text-base text-muted-foreground ml-1">- {gift.description}</span>
                              )}
                            </div>
                            <div className="flex items-center flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0"
                                onClick={() => openGiveGiftDialog(gift)}
                                title="Gi gave"
                              >
                                <Check className="h-3 w-3 text-[#C9A227]" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0"
                                onClick={() => deleteGift(gift.id)}
                                title="Slett"
                              >
                                <Trash2 className="h-3 w-3 text-[#8B6914]" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        )}

        {/* Give Gift Dialog for showAllIdeas view */}
        <Dialog open={isGiveGiftDialogOpen} onOpenChange={setIsGiveGiftDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("tracker.giveGift", language)}</DialogTitle>
              <DialogDescription>
                {giftToGive && `${t("tracker.registerGiftAs", language)} "${giftToGive.title}"`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t("tracker.occasion", language)}</Label>
                <Select
                  value={giveGiftForm.occasion}
                  onValueChange={(value: "christmas" | "birthday" | "other") =>
                    setGiveGiftForm({ ...giveGiftForm, occasion: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="christmas">{t("tracker.christmas", language)}</SelectItem>
                    <SelectItem value="birthday">{t("tracker.birthday", language)}</SelectItem>
                    <SelectItem value="other">{t("tracker.other", language)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {giveGiftForm.occasion === "other" && (
                <div className="space-y-2">
                  <Label>{t("tracker.specifyOccasion", language)}</Label>
                  <Input
                    value={giveGiftForm.occasion_custom}
                    onChange={(e) => setGiveGiftForm({ ...giveGiftForm, occasion_custom: e.target.value })}
                    placeholder={t("tracker.occasionPlaceholder", language)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>{t("tracker.year", language)}</Label>
                <Select
                  value={giveGiftForm.year.toString()}
                  onValueChange={(value) =>
                    setGiveGiftForm({ ...giveGiftForm, year: value === "earlier" ? 2022 : Number.parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={year}>
                        {getYearLabel(year)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGiveGiftDialogOpen(false)}>
                {t("tracker.cancel", language)}
              </Button>
              <Button onClick={markAsGiven}>{t("tracker.registerGift", language)}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  if (showHistory) {
    const occasionLabels: Record<GiftOccasion, string> = {
      jul: t("tracker.christmas", language),
      bursdag: t("tracker.birthday", language),
      annet: t("tracker.other", language),
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(false)}
            className="border-[#C9A227] text-[#5C4A1F] hover:bg-[#F5EBD7]"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("tracker.back", language)}
          </Button>
          <h2 className="text-lg font-semibold text-[#5C4A1F] flex-1">{t("tracker.history", language)}</h2>
        </div>

        <Card className="bg-gradient-to-br from-[#FDF8F0]/50 to-[#F5EBD7]/50 border-[#C9A227]/30 backdrop-blur-sm">
          <CardContent className="p-4 space-y-4">
            {/* Filter section with better contrast */}
            <div className="flex flex-wrap gap-4 p-3 bg-[#FDF8F0] rounded-lg border border-[#C9A227]/40">
              <div className="flex-1 min-w-[180px]">
                <Label className="text-sm font-medium text-[#5C4A1F] mb-1.5 block">
                  {t("tracker.occasion", language)}
                </Label>
                <Select value={historyFilterOccasion} onValueChange={setHistoryFilterOccasion}>
                  <SelectTrigger className="w-full h-10 text-sm bg-white border-[#C9A227] text-[#5C4A1F]">
                    <SelectValue placeholder={t("tracker.allOccasions", language)} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#C9A227] text-[#5C4A1F]">
                    <SelectItem
                      value="all"
                      className="text-[#5C4A1F] hover:bg-[#F5EBD7] focus:bg-[#F5EBD7] focus:text-[#5C4A1F]"
                    >
                      {t("tracker.allOccasions", language)}
                    </SelectItem>
                    <SelectItem
                      value="jul"
                      className="text-[#5C4A1F] hover:bg-[#F5EBD7] focus:bg-[#F5EBD7] focus:text-[#5C4A1F]"
                    >
                      {t("tracker.christmas", language)}
                    </SelectItem>
                    <SelectItem
                      value="bursdag"
                      className="text-[#5C4A1F] hover:bg-[#F5EBD7] focus:bg-[#F5EBD7] focus:text-[#5C4A1F]"
                    >
                      {t("tracker.birthday", language)}
                    </SelectItem>
                    <SelectItem
                      value="annet"
                      className="text-[#5C4A1F] hover:bg-[#F5EBD7] focus:bg-[#F5EBD7] focus:text-[#5C4A1F]"
                    >
                      {t("tracker.other", language)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[180px]">
                <Label className="text-sm font-medium text-[#5C4A1F] mb-1.5 block">{t("tracker.year", language)}</Label>
                <Select value={historyFilterYear} onValueChange={setHistoryFilterYear}>
                  <SelectTrigger className="w-full h-10 text-sm bg-white border-[#C9A227] text-[#5C4A1F]">
                    <SelectValue placeholder={t("tracker.allYears", language)} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#C9A227] text-[#5C4A1F]">
                    <SelectItem
                      value="all"
                      className="text-[#5C4A1F] hover:bg-[#F5EBD7] focus:bg-[#F5EBD7] focus:text-[#5C4A1F]"
                    >
                      {t("tracker.allYears", language)}
                    </SelectItem>
                    {YEARS.map((year) => (
                      <SelectItem
                        key={year}
                        value={year}
                        className="text-[#5C4A1F] hover:bg-[#F5EBD7] focus:bg-[#F5EBD7] focus:text-[#5C4A1F]"
                      >
                        {getYearLabel(year)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Gift list as table */}
            {filteredHistoryGifts.length === 0 ? (
              <div className="py-6 text-center text-[#5C4A1F] text-lg">
                {allGivenGifts.length === 0 ? t("tracker.noGiftsYet", language) : t("tracker.noGiftsMatch", language)}
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-[#C9A227]/30 bg-white">
                <table className="w-full">
                  <thead className="bg-[#F5EBD7]">
                    <tr>
                      <th className="text-left text-sm font-medium text-[#5C4A1F] px-3 py-2">
                        {t("tracker.person", language)}
                      </th>
                      <th className="text-left text-sm font-medium text-[#5C4A1F] px-3 py-2">
                        {t("tracker.giftTitle", language)}
                      </th>
                      <th className="text-right text-sm font-medium text-[#5C4A1F] px-3 py-2 hidden sm:table-cell">
                        {t("tracker.occasion", language)}
                      </th>
                      <th className="text-right text-sm font-medium text-[#5C4A1F] px-3 py-2 hidden sm:table-cell">
                        {t("tracker.year", language)}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C9A227]/20">
                    {filteredHistoryGifts.map((gift) => {
                      const person = people.find((p) => p.id === gift.person_id)
                      return (
                        <tr key={gift.id} className="hover:bg-[#FDF8F0]">
                          <td className="px-3 py-2 text-sm text-[#5C4A1F] font-medium">{person?.name}</td>
                          <td className="px-3 py-2 text-sm text-[#5C4A1F]">
                            {gift.title}
                            {/* Show occasion/year on mobile below gift */}
                            <span className="sm:hidden block text-xs text-[#8B6914]/70 mt-0.5">
                              {occasionLabels[gift.occasion]} {getYearLabel(String(gift.year))}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-sm text-[#8B6914] text-right hidden sm:table-cell">
                            {occasionLabels[gift.occasion]}
                          </td>
                          <td className="px-3 py-2 text-sm text-[#8B6914] text-right hidden sm:table-cell">
                            {getYearLabel(String(gift.year))}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary */}
            {filteredHistoryGifts.length > 0 && (
              <div className="text-center text-sm text-[#5C4A1F]">
                {t("tracker.showing", language)} {filteredHistoryGifts.length} {t("tracker.of", language)}{" "}
                {allGivenGifts.length} {t("tracker.gifts", language)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedPerson) {
    return (
      <div className="space-y-6">
        <Dialog
          open={giftDialogOpen}
          onOpenChange={(open) => {
            setGiftDialogOpen(open)
            if (!open) {
              setPreSelectedPersonId(null)
              setEditingGift(null)
              setConvertingIdea(null) // Reset when dialog is closed
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              {/* Replace hardcoded text in Dialog title for gift form */}
              <DialogTitle className="text-[#5C4A1F] font-serif">
                {editingGift
                  ? t("tracker.editGift", language)
                  : convertingIdea
                    ? t("tracker.convertToGift", language)
                    : t("tracker.addGiftOrIdea", language)}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Person</Label>
                <Select value={giftForm.person_id} onValueChange={(v) => setGiftForm({ ...giftForm, person_id: v })}>
                  <SelectTrigger>
                    {/* Replace "Velg person" placeholder */}
                    <SelectValue placeholder={t("tracker.selectPerson", language)} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Update: ensure people list is sorted by sort_order when displaying */}
                    {people
                      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                      .map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tittel</Label>
                <Input
                  value={giftForm.title}
                  onChange={(e) => setGiftForm({ ...giftForm, title: e.target.value })}
                  placeholder="Hva er gaven?"
                />
              </div>

              <div>
                <Label>Beskrivelse (valgfritt)</Label>
                <Input
                  value={giftForm.description}
                  onChange={(e) => setGiftForm({ ...giftForm, description: e.target.value })}
                  placeholder="Mer detaljer..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isIdeaPerson"
                  checked={giftForm.is_idea}
                  onChange={(e) => setGiftForm({ ...giftForm, is_idea: e.target.checked })}
                  className="rounded w-4 h-4 border-[#8B6914] accent-[#C9A227] cursor-pointer"
                />
                <Label htmlFor="isIdeaPerson" className="font-normal cursor-pointer">
                  Dette er en idé (ikke gitt enda)
                </Label>
              </div>

              {!giftForm.is_idea && (
                <>
                  <div>
                    <Label>Anledning</Label>
                    <Select value={giftForm.occasion} onValueChange={(v) => setGiftForm({ ...giftForm, occasion: v })}>
                      <SelectTrigger>
                        {/* Replace "Velg anledning" placeholder */}
                        <SelectValue placeholder={t("tracker.selectOccasion", language)} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jul">Jul</SelectItem>
                        <SelectItem value="bursdag">Bursdag</SelectItem>
                        <SelectItem value="annet">Annet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>År</Label>
                    <Select
                      value={giftForm.year?.toString() || ""}
                      onValueChange={(v) =>
                        setGiftForm({ ...giftForm, year: v === "earlier" ? 2022 : Number.parseInt(v) })
                      }
                    >
                      <SelectTrigger>
                        {/* Replace "Velg år" placeholder */}
                        <SelectValue placeholder={t("tracker.selectYear", language)} />
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS.map((year) => (
                          <SelectItem key={year} value={year}>
                            {getYearLabel(year)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                <Button onClick={saveGift} className="flex-1">
                  {/* Replace button text */}
                  {editingGift ? t("tracker.saveChanges", language) : t("tracker.add", language)}
                </Button>
                <Button variant="outline" onClick={() => setGiftDialogOpen(false)}>
                  Avbryt
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedPerson(null)}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{selectedPerson.name}</h2>
            <p className="text-white/80">
              {givenGifts.length} gaver gitt · {ideaGifts.length} ideer
            </p>
          </div>
          <Button onClick={() => openGiftDialogForPerson(selectedPerson.id)}>
            <Plus className="h-4 w-4 mr-1" />
            Ny gave/idé
          </Button>
        </div>

        {/* Given gifts section */}
        <Card className="bg-gradient-to-br from-[#FDF8F0]/50 to-[#F5EBD7]/50 border-[#C9A227]/30 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2 text-foreground">
              <Check className="h-6 w-6 text-[#C9A227]" />
              Gaver gitt
            </CardTitle>
          </CardHeader>
          <CardContent>
            {givenGifts.length === 0 ? (
              <p className="text-muted-foreground text-lg">Ingen gaver registrert ennå.</p>
            ) : (
              <div className="space-y-3">
                {givenGifts.map((gift) => (
                  <div
                    key={gift.id}
                    className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-lg">{gift.title}</span>
                      {gift.description && <p className="text-lg text-muted-foreground mt-1">{gift.description}</p>}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditGift(gift)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteGift(gift.id)}
                      >
                        <Trash2 className="h-4 w-4 text-[#8B6914]" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ideas section */}
        <Card className="bg-gradient-to-br from-[#FDF8F0]/50 to-[#F5EBD7]/50 border-[#C9A227]/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* Replace person details Gaveideer heading */}
            <CardTitle className="text-xl flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-[#8B6914]" />
              {t("tracker.giftIdeasTitle", language)}
            </CardTitle>
            {ideaGifts.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Del ideer
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {ideaGifts.length === 0 ? (
              <p className="text-muted-foreground text-lg">Ingen ideer registrert ennå.</p>
            ) : (
              <div className="space-y-3">
                {ideaGifts.map((gift) => (
                  <div
                    key={gift.id}
                    className="flex items-start justify-between p-3 rounded-lg border bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-lg">{gift.title}</span>
                      {gift.description && <p className="text-lg text-muted-foreground mt-1">{gift.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 bg-transparent"
                        onClick={() => openGiveGiftDialog(gift)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Gi gave
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditGift(gift)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteGift(gift.id)}
                      >
                        <Trash2 className="h-4 w-4 text-[#8B6914]" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Del gift ideer for {selectedPerson.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  readOnly
                  value={shareText}
                  className="w-full h-48 p-3 text-base border rounded-md bg-muted/50 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                  Lukk
                </Button>
                <Button onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Kopiert!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Kopier til utklippstavle
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Dialog
        open={giftDialogOpen}
        onOpenChange={(open) => {
          setGiftDialogOpen(open)
          if (!open) {
            setPreSelectedPersonId(null)
            setEditingGift(null)
            setConvertingIdea(null) // Reset when dialog is closed
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            {/* Replace hardcoded text in Dialog title for gift form */}
            <DialogTitle className="text-[#5C4A1F] font-serif">
              {editingGift
                ? t("tracker.editGift", language)
                : convertingIdea
                  ? t("tracker.convertToGift", language)
                  : t("tracker.addGiftOrIdea", language)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Person</Label>
              <Select value={giftForm.person_id} onValueChange={(v) => setGiftForm({ ...giftForm, person_id: v })}>
                <SelectTrigger>
                  {/* Replace "Velg person" placeholder */}
                  <SelectValue placeholder={t("tracker.selectPerson", language)} />
                </SelectTrigger>
                <SelectContent>
                  {/* Update: ensure people list is sorted by sort_order when displaying */}
                  {people
                    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                    .map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tittel</Label>
              <Input
                value={giftForm.title}
                onChange={(e) => setGiftForm({ ...giftForm, title: e.target.value })}
                placeholder="Hva er gaveen?"
              />
            </div>

            <div>
              <Label>Beskrivelse (valgfritt)</Label>
              <Input
                value={giftForm.description}
                onChange={(e) => setGiftForm({ ...giftForm, description: e.target.value })}
                placeholder="Mer detaljer..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isIdea"
                checked={giftForm.is_idea}
                onChange={(e) => setGiftForm({ ...giftForm, is_idea: e.target.checked })}
                className="rounded w-4 h-4 border-[#8B6914] accent-[#C9A227] cursor-pointer"
              />
              <Label htmlFor="isIdea" className="font-normal cursor-pointer">
                Dette er en idé (ikke gitt enda)
              </Label>
            </div>

            {!giftForm.is_idea && (
              <>
                <div>
                  <Label>Anledning</Label>
                  <Select value={giftForm.occasion} onValueChange={(v) => setGiftForm({ ...giftForm, occasion: v })}>
                    <SelectTrigger>
                      {/* Replace "Velg anledning" placeholder */}
                      <SelectValue placeholder={t("tracker.selectOccasion", language)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jul">Jul</SelectItem>
                      <SelectItem value="bursdag">Bursdag</SelectItem>
                      <SelectItem value="annet">Annet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>År</Label>
                  <Select
                    value={giftForm.year?.toString() || ""}
                    onValueChange={(v) =>
                      setGiftForm({ ...giftForm, year: v === "earlier" ? 2022 : Number.parseInt(v) })
                    }
                  >
                    <SelectTrigger>
                      {/* Replace "Velg år" placeholder */}
                      <SelectValue placeholder={t("tracker.selectYear", language)} />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year}>
                          {getYearLabel(year)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <Button onClick={saveGift} className="flex-1">
                {/* Replace button text */}
                {editingGift ? t("tracker.saveChanges", language) : t("tracker.add", language)}
              </Button>
              <Button variant="outline" onClick={() => setGiftDialogOpen(false)}>
                Avbryt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Person dialog */}
      <Dialog open={showAddPerson} onOpenChange={setShowAddPerson}>
        <DialogContent>
          <DialogHeader>
            {/* Replace Dialog title for add person */}
            <DialogTitle>{t("tracker.addNewPerson", language)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="personName">Navn</Label>
              <Input
                id="personName"
                value={newPersonName}
                onChange={(e) => {
                  setNewPersonName(e.target.value)
                  setPersonError("")
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addPerson()
                  }
                }}
                placeholder="f.eks. Per"
              />
              {personError && <p className="text-base text-[#8B6914] mt-1">{personError}</p>}
            </div>
            <div className="flex gap-2">
              <Button onClick={addPerson} className="flex-1">
                {/* Replace "Legg til" button in add person dialog */}
                {t("tracker.add", language)}
              </Button>
              <Button variant="outline" onClick={() => setShowAddPerson(false)}>
                Avbryt
              </Button>
            </div>
            {people.length === 0 && (
              <div className="pt-2 border-t">
                {/* Replace "Legg til Eksempler" button */}
                <Button variant="ghost" size="sm" onClick={addExamplePeople} className="w-full text-muted-foreground">
                  {t("tracker.addExamples", language)}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Shopping button for all ideas */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">{t("tracker.myPeople", language)}</h3>
        <div className="flex gap-2">
          {/* Replace main button texts */}
          <Button onClick={() => setShowAddPerson(true)} className="bg-[#8B6914] hover:bg-[#6B5210] text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            {t("tracker.addPerson", language)}
          </Button>

          <Button
            onClick={() => setShowAllIdeas(true)}
            variant="outline"
            className="border-[#C9A227] text-[#5C4A1F] hover:bg-[#F5EBD7]"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            {t("tracker.giftIdeasTitle", language)}
          </Button>

          <Button
            onClick={() => setShowHistory(true)}
            variant="outline"
            className="border-[#C9A227] text-[#5C4A1F] hover:bg-[#F5EBD7]"
          >
            <History className="h-4 w-4 mr-2" />
            {t("tracker.history", language)}
          </Button>
        </div>
      </div>

      {/* Person list */}
      <Card className="bg-gradient-to-br from-[#FDF8F0]/50 to-[#F5EBD7]/50 border-[#C9A227]/30 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2 text-foreground">
            <Users className="h-6 w-6 text-primary" />
            {t("tracker.people", language)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {people.length === 0 ? (
            <p className="text-muted-foreground text-lg">{t("tracker.noPeopleYet", language)}</p>
          ) : (
            <div className="space-y-2">
              {/* Update: Add drag and drop functionality */}
              {people.map((person) => (
                <div
                  key={person.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, person)}
                  onDragOver={(e) => handleDragOver(e, person.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, person)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-3 rounded-lg border bg-[#FDF8F0] hover:bg-[#F5EBD7] cursor-grab active:cursor-grabbing transition-colors ${
                    dragOverPersonId === person.id ? "border-[#C9A227] border-2" : ""
                  } ${draggedPerson?.id === person.id ? "opacity-50" : ""}`}
                  onClick={() => setSelectedPerson(person)}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-[#8B6914]/50 cursor-grab" />
                    <span className="font-medium text-foreground">{person.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        openGiftDialogForPerson(person.id)
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePerson(person.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-[#8B6914]" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
