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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      academic_calendar_events: {
        Row: {
          color: string
          created_at: string
          created_by: string | null
          date: string
          description: string | null
          event_type: string
          id: string
          institution: string | null
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          created_by?: string | null
          date: string
          description?: string | null
          event_type?: string
          id?: string
          institution?: string | null
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string | null
          event_type?: string
          id?: string
          institution?: string | null
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          notification_type: string
          related_email: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          notification_type?: string
          related_email?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          notification_type?: string
          related_email?: string | null
          title?: string
        }
        Relationships: []
      }
      alert_subscriptions: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          phone: string | null
          subscription_types: Database["public"]["Enums"]["subscription_type"][]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          subscription_types?: Database["public"]["Enums"]["subscription_type"][]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          subscription_types?: Database["public"]["Enums"]["subscription_type"][]
          updated_at?: string
        }
        Relationships: []
      }
      campus_booking_audit_log: {
        Row: {
          action: string
          booking_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown
          user_agent: string | null
        }
        Insert: {
          action: string
          booking_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Update: {
          action?: string
          booking_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campus_booking_audit_log_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "campus_ticket_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      campus_booking_sensitive_data: {
        Row: {
          booking_id: string
          created_at: string | null
          dietary_requirements: string | null
          emergency_contact: string | null
          id: string
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          dietary_requirements?: string | null
          emergency_contact?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          dietary_requirements?: string | null
          emergency_contact?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campus_booking_sensitive_data_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "campus_ticket_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      campus_events: {
        Row: {
          created_at: string
          current_attendees: number | null
          description: string | null
          event_date: string
          event_time: string
          headliners: string[] | null
          id: string
          image_url: string | null
          location: string
          max_capacity: number | null
          societies: string[] | null
          status: string
          ticket_price: number | null
          university: string
          updated_at: string
          venue: string
        }
        Insert: {
          created_at?: string
          current_attendees?: number | null
          description?: string | null
          event_date: string
          event_time: string
          headliners?: string[] | null
          id?: string
          image_url?: string | null
          location: string
          max_capacity?: number | null
          societies?: string[] | null
          status?: string
          ticket_price?: number | null
          university: string
          updated_at?: string
          venue: string
        }
        Update: {
          created_at?: string
          current_attendees?: number | null
          description?: string | null
          event_date?: string
          event_time?: string
          headliners?: string[] | null
          id?: string
          image_url?: string | null
          location?: string
          max_capacity?: number | null
          societies?: string[] | null
          status?: string
          ticket_price?: number | null
          university?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      campus_ticket_bookings: {
        Row: {
          booking_status: string
          checked_in: boolean | null
          checked_in_at: string | null
          course: string | null
          created_at: string
          dietary_requirements: string | null
          emergency_contact: string | null
          event_id: string
          id: string
          phone_number: string | null
          student_email: string
          student_name: string
          ticket_code: string
          university: string
          updated_at: string
          user_id: string | null
          year_of_study: number | null
        }
        Insert: {
          booking_status?: string
          checked_in?: boolean | null
          checked_in_at?: string | null
          course?: string | null
          created_at?: string
          dietary_requirements?: string | null
          emergency_contact?: string | null
          event_id: string
          id?: string
          phone_number?: string | null
          student_email: string
          student_name: string
          ticket_code: string
          university: string
          updated_at?: string
          user_id?: string | null
          year_of_study?: number | null
        }
        Update: {
          booking_status?: string
          checked_in?: boolean | null
          checked_in_at?: string | null
          course?: string | null
          created_at?: string
          dietary_requirements?: string | null
          emergency_contact?: string | null
          event_id?: string
          id?: string
          phone_number?: string | null
          student_email?: string
          student_name?: string
          ticket_code?: string
          university?: string
          updated_at?: string
          user_id?: string | null
          year_of_study?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campus_ticket_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "campus_events"
            referencedColumns: ["id"]
          },
        ]
      }
      culture_videos: {
        Row: {
          category: string | null
          created_at: string
          file_size: number | null
          id: string
          title: string | null
          updated_at: string
          user_id: string | null
          video_url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          file_size?: number | null
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
          video_url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          file_size?: number | null
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
          video_url?: string
        }
        Relationships: []
      }
      lab_applications: {
        Row: {
          admin_notes: string | null
          applicant_email: string
          applicant_name: string
          created_at: string
          duration_hours: number | null
          equipment_needed: string | null
          id: string
          lab_description: string
          lab_title: string
          mentor_experience: string | null
          motivation: string | null
          phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string
          target_audience: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          applicant_email: string
          applicant_name: string
          created_at?: string
          duration_hours?: number | null
          equipment_needed?: string | null
          id?: string
          lab_description: string
          lab_title: string
          mentor_experience?: string | null
          motivation?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string
          target_audience?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          applicant_email?: string
          applicant_name?: string
          created_at?: string
          duration_hours?: number | null
          equipment_needed?: string | null
          id?: string
          lab_description?: string
          lab_title?: string
          mentor_experience?: string | null
          motivation?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string
          target_audience?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lab_mentors: {
        Row: {
          avatar_url: string | null
          background: string | null
          bio: string | null
          created_at: string
          email: string | null
          expertise: string
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          background?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          expertise: string
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          background?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          expertise?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lab_mentors_secure: {
        Row: {
          avatar_url: string | null
          background: string | null
          bio: string | null
          created_at: string
          expertise: string
          id: string
          is_active: boolean | null
          mentor_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          background?: string | null
          bio?: string | null
          created_at?: string
          expertise: string
          id?: string
          is_active?: boolean | null
          mentor_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          background?: string | null
          bio?: string | null
          created_at?: string
          expertise?: string
          id?: string
          is_active?: boolean | null
          mentor_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_mentors_secure_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "lab_mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_sessions: {
        Row: {
          created_at: string
          current_participants: number | null
          description: string | null
          end_time: string
          id: string
          max_participants: number | null
          mentor_id: string | null
          session_date: string
          start_time: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          end_time: string
          id?: string
          max_participants?: number | null
          mentor_id?: string | null
          session_date: string
          start_time: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          end_time?: string
          id?: string
          max_participants?: number | null
          mentor_id?: string | null
          session_date?: string
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "lab_mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mainframe_content: {
        Row: {
          about_content: string
          about_title: string
          created_at: string
          current_raised: number
          event_audience: string
          event_date: string
          event_location: string
          funding_breakdown: Json | null
          id: string
          subtitle: string
          supporter_count: number
          target_amount: number
          title: string
          updated_at: string
        }
        Insert: {
          about_content?: string
          about_title?: string
          created_at?: string
          current_raised?: number
          event_audience?: string
          event_date?: string
          event_location?: string
          funding_breakdown?: Json | null
          id?: string
          subtitle?: string
          supporter_count?: number
          target_amount?: number
          title?: string
          updated_at?: string
        }
        Update: {
          about_content?: string
          about_title?: string
          created_at?: string
          current_raised?: number
          event_audience?: string
          event_date?: string
          event_location?: string
          funding_breakdown?: Json | null
          id?: string
          subtitle?: string
          supporter_count?: number
          target_amount?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentor_contact_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          mentor_id: string | null
          message: string
          requester_email: string
          requester_name: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          mentor_id?: string | null
          message: string
          requester_email: string
          requester_name: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          mentor_id?: string | null
          message?: string
          requester_email?: string
          requester_name?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_contact_requests_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "lab_mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scnro_ed_registrations: {
        Row: {
          address_newham: string
          age: number
          created_at: string
          email: string
          full_name: string
          id: string
          motivation: string
          phone_number: string
          previous_experience: string | null
          registration_status: string
          updated_at: string
        }
        Insert: {
          address_newham: string
          age: number
          created_at?: string
          email: string
          full_name: string
          id?: string
          motivation: string
          phone_number: string
          previous_experience?: string | null
          registration_status?: string
          updated_at?: string
        }
        Update: {
          address_newham?: string
          age?: number
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          motivation?: string
          phone_number?: string
          previous_experience?: string | null
          registration_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      scnro_ed_schools_registrations: {
        Row: {
          additional_info: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string
          id: string
          preferred_start_date: string | null
          registration_status: string
          school_name: string
          school_type: string
          student_count: number
          updated_at: string
        }
        Insert: {
          additional_info?: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string
          id?: string
          preferred_start_date?: string | null
          registration_status?: string
          school_name: string
          school_type: string
          student_count: number
          updated_at?: string
        }
        Update: {
          additional_info?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          id?: string
          preferred_start_date?: string | null
          registration_status?: string
          school_name?: string
          school_type?: string
          student_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          metadata: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      signal_events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string
          id: string
          is_active: boolean
          location: string | null
          max_attendees: number | null
          registration_closes_at: string | null
          registration_opens_at: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date: string
          id?: string
          is_active?: boolean
          location?: string | null
          max_attendees?: number | null
          registration_closes_at?: string | null
          registration_opens_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string
          id?: string
          is_active?: boolean
          location?: string | null
          max_attendees?: number | null
          registration_closes_at?: string | null
          registration_opens_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      signal_invitations: {
        Row: {
          created_at: string
          email: string
          event_id: string | null
          full_name: string | null
          id: string
          invitation_code: string
          is_active: boolean
          telephone: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          event_id?: string | null
          full_name?: string | null
          id?: string
          invitation_code: string
          is_active?: boolean
          telephone?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string | null
          full_name?: string | null
          id?: string
          invitation_code?: string
          is_active?: boolean
          telephone?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signal_invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "signal_events"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          artist: string
          audio_url: string
          content_type: Database["public"]["Enums"]["content_type"]
          cover_image_url: string | null
          created_at: string
          description: string | null
          duration: number
          file_size: number
          genre: string | null
          id: string
          platform: string | null
          play_count: number
          playlist_number: number | null
          position: number | null
          producer: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          artist: string
          audio_url: string
          content_type?: Database["public"]["Enums"]["content_type"]
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          duration?: number
          file_size?: number
          genre?: string | null
          id?: string
          platform?: string | null
          play_count?: number
          playlist_number?: number | null
          position?: number | null
          producer?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          artist?: string
          audio_url?: string
          content_type?: Database["public"]["Enums"]["content_type"]
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          duration?: number
          file_size?: number
          genre?: string | null
          id?: string
          platform?: string | null
          play_count?: number
          playlist_number?: number | null
          position?: number | null
          producer?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          max_operations?: number
          operation_type: string
          time_window_minutes?: number
        }
        Returns: boolean
      }
      generate_invitation_code: { Args: never; Returns: string }
      generate_ticket_code: { Args: never; Returns: string }
      get_user_role: {
        Args: { user_id?: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: { Args: { user_id?: string }; Returns: boolean }
      log_sensitive_access: {
        Args: {
          action_type: string
          additional_metadata?: Json
          record_id?: string
          table_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      content_type: "sound" | "interview"
      subscription_type:
        | "event_alerts"
        | "merchandise_alerts"
        | "signal_show_announcements"
      user_role: "admin" | "user"
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
    Enums: {
      content_type: ["sound", "interview"],
      subscription_type: [
        "event_alerts",
        "merchandise_alerts",
        "signal_show_announcements",
      ],
      user_role: ["admin", "user"],
    },
  },
} as const
