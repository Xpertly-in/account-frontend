export interface State {
  id: number
  name: string
  code: string
  created_at: string
}

export interface District {
  id: number
  name: string
  state_id: number
  created_at: string
}

export interface Language {
  id: number
  name: string
  code?: string
  native_name?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SpecializationCategory {
  id: number
  name: string
  code: string
  description?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Specialization {
  id: number
  name: string
  code: string
  category_id: number
  description?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SpecializationWithCategory extends Specialization {
  category_name: string
  category_code: string
  category_description?: string
  category_display_order: number
} 