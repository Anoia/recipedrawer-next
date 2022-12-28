export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ingredient: {
        Row: {
          id: number
          created_at: string
          name: string
          recipe_id: number | null
          diet: string
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          recipe_id?: number | null
          diet: string
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          recipe_id?: number | null
          diet?: string
        }
      }
      recipe: {
        Row: {
          id: number
          name: string
          description: string | null
          image: string | null
          steps: Json
          created_at: string
          user_id: string | null
          cook_time: unknown | null
          prep_time: unknown | null
          portions: number
          diet: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          image?: string | null
          steps: Json
          created_at?: string
          user_id?: string | null
          cook_time?: unknown | null
          prep_time?: unknown | null
          portions: number
          diet: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          image?: string | null
          steps?: Json
          created_at?: string
          user_id?: string | null
          cook_time?: unknown | null
          prep_time?: unknown | null
          portions?: number
          diet?: string
        }
      }
      recipe_ingredient: {
        Row: {
          id: number
          recipe_id: number
          ingredient_id: number
          amount: number
          unit_id: number
          index: number
          section: string | null
          extra_info: string | null
        }
        Insert: {
          id?: number
          recipe_id: number
          ingredient_id: number
          amount: number
          unit_id?: number
          index?: number
          section?: string | null
          extra_info?: string | null
        }
        Update: {
          id?: number
          recipe_id?: number
          ingredient_id?: number
          amount?: number
          unit_id?: number
          index?: number
          section?: string | null
          extra_info?: string | null
        }
      }
      unit: {
        Row: {
          id: number
          long_name: string
          short_name: string
        }
        Insert: {
          id?: number
          long_name: string
          short_name: string
        }
        Update: {
          id?: number
          long_name?: string
          short_name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

