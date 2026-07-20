export interface Person {
  id: string
  user_id: string
  name: string
  relationship: string | null
  created_at: string
  sort_order?: number
}

export type GiftOccasion = "jul" | "bursdag" | "annet"

export interface Gift {
  id: string
  user_id: string
  person_id: string
  title: string
  description: string | null
  occasion: GiftOccasion
  occasion_custom: string | null
  year: number
  is_idea: boolean
  given_date: string | null
  created_at: string
  updated_at: string
  person?: Person // joined data
}

export interface GiftFormData {
  person_id: string
  title: string
  description?: string
  occasion: GiftOccasion
  occasion_custom?: string
  year: number
  is_idea: boolean
  given_date?: string
}

export interface PersonFormData {
  name: string
  relationship?: string
}
