export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      college_notes: {
        Row: {
          category: string | null
          created_at: string
          deadline: string | null
          id: string
          notes: string | null
          priority: number | null
          school: string
          status: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          school: string
          status?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          school?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      competitions: {
        Row: {
          category: string | null
          created_at: string
          deadline: string | null
          id: string
          name: string
          notes: string | null
          organizer: string | null
          status: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          name: string
          notes?: string | null
          organizer?: string | null
          status?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          name?: string
          notes?: string | null
          organizer?: string | null
          status?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      highlights: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          source: string | null
          title: string
          url: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          source?: string | null
          title: string
          url?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          source?: string | null
          title?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          body: string | null
          created_at: string
          entry_date: string
          id: string
          mood: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          entry_date?: string
          id?: string
          mood?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          entry_date?: string
          id?: string
          mood?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
        }
        Relationships: []
      }
      tournament_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          is_cover: boolean
          is_mvp_moment: boolean
          sort_order: number
          storage_path: string
          tournament_id: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          is_cover?: boolean
          is_mvp_moment?: boolean
          sort_order?: number
          storage_path: string
          tournament_id: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          is_cover?: boolean
          is_mvp_moment?: boolean
          sort_order?: number
          storage_path?: string
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_photos_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          assists: number | null
          created_at: string
          date: string | null
          id: string
          is_upcoming: boolean
          location: string | null
          name: string
          points: number | null
          rebounds: number | null
          result: string | null
          review: string | null
          stage: string | null
          tip_off: string | null
          user_id: string
        }
        Insert: {
          assists?: number | null
          created_at?: string
          date?: string | null
          id?: string
          is_upcoming?: boolean
          location?: string | null
          name: string
          points?: number | null
          rebounds?: number | null
          result?: string | null
          review?: string | null
          stage?: string | null
          tip_off?: string | null
          user_id: string
        }
        Update: {
          assists?: number | null
          created_at?: string
          date?: string | null
          id?: string
          is_upcoming?: boolean
          location?: string | null
          name?: string
          points?: number | null
          rebounds?: number | null
          result?: string | null
          review?: string | null
          stage?: string | null
          tip_off?: string | null
          user_id?: string
        }
        Relationships: []
      }
      training_logs: {
        Row: {
          created_at: string
          duration_min: number | null
          focus: string
          id: string
          intensity: number | null
          log_date: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_min?: number | null
          focus: string
          id?: string
          intensity?: number | null
          log_date?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          duration_min?: number | null
          focus?: string
          id?: string
          intensity?: number | null
          log_date?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
