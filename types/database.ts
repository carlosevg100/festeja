export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          avatar_url: string | null;
          pix_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          phone?: string | null;
          avatar_url?: string | null;
          pix_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          pix_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          user_id: string;
          slug: string;
          title: string;
          description: string | null;
          event_type: 'birthday' | 'baby_shower' | 'quinceanera' | 'corporate' | 'other';
          honoree_name: string;
          honoree_age: number | null;
          event_date: string;
          event_end_date: string | null;
          location_name: string | null;
          location_address: string | null;
          location_lat: number | null;
          location_lng: number | null;
          dress_code: string | null;
          observations: string | null;
          theme: string | null;
          color_primary: string;
          color_secondary: string;
          cover_image_url: string | null;
          invite_image_url: string | null;
          is_published: boolean;
          is_archived: boolean;
          max_guests: number | null;
          allow_plus_ones: boolean;
          ask_dietary_restrictions: boolean;
          pix_enabled: boolean;
          photo_wall_enabled: boolean;
          message_board_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          slug: string;
          title: string;
          description?: string | null;
          event_type: 'birthday' | 'baby_shower' | 'quinceanera' | 'corporate' | 'other';
          honoree_name: string;
          honoree_age?: number | null;
          event_date: string;
          event_end_date?: string | null;
          location_name?: string | null;
          location_address?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          dress_code?: string | null;
          observations?: string | null;
          theme?: string | null;
          color_primary?: string;
          color_secondary?: string;
          cover_image_url?: string | null;
          invite_image_url?: string | null;
          is_published?: boolean;
          is_archived?: boolean;
          max_guests?: number | null;
          allow_plus_ones?: boolean;
          ask_dietary_restrictions?: boolean;
          pix_enabled?: boolean;
          photo_wall_enabled?: boolean;
          message_board_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          event_type?: 'birthday' | 'baby_shower' | 'quinceanera' | 'corporate' | 'other';
          honoree_name?: string;
          honoree_age?: number | null;
          event_date?: string;
          event_end_date?: string | null;
          location_name?: string | null;
          location_address?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          dress_code?: string | null;
          observations?: string | null;
          theme?: string | null;
          color_primary?: string;
          color_secondary?: string;
          cover_image_url?: string | null;
          invite_image_url?: string | null;
          is_published?: boolean;
          is_archived?: boolean;
          max_guests?: number | null;
          allow_plus_ones?: boolean;
          ask_dietary_restrictions?: boolean;
          pix_enabled?: boolean;
          photo_wall_enabled?: boolean;
          message_board_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      guests: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          rsvp_status: 'pending' | 'confirmed' | 'declined' | 'maybe';
          plus_ones: number;
          dietary_restrictions: string | null;
          checked_in: boolean;
          checked_in_at: string | null;
          rsvp_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          rsvp_status?: 'pending' | 'confirmed' | 'declined' | 'maybe';
          plus_ones?: number;
          dietary_restrictions?: string | null;
          checked_in?: boolean;
          checked_in_at?: string | null;
          rsvp_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          rsvp_status?: 'pending' | 'confirmed' | 'declined' | 'maybe';
          plus_ones?: number;
          dietary_restrictions?: string | null;
          checked_in?: boolean;
          checked_in_at?: string | null;
          rsvp_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      gifts: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          price: number | null;
          product_url: string | null;
          store_name: string | null;
          category: string | null;
          gift_type: 'product' | 'quota' | 'experience' | 'pix';
          is_group_gift: boolean;
          group_goal: number | null;
          group_raised: number;
          status: 'available' | 'reserved' | 'purchased';
          reserved_by: string | null;
          reserved_at: string | null;
          priority: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          price?: number | null;
          product_url?: string | null;
          store_name?: string | null;
          category?: string | null;
          gift_type: 'product' | 'quota' | 'experience' | 'pix';
          is_group_gift?: boolean;
          group_goal?: number | null;
          group_raised?: number;
          status?: 'available' | 'reserved' | 'purchased';
          reserved_by?: string | null;
          reserved_at?: string | null;
          priority?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          price?: number | null;
          product_url?: string | null;
          store_name?: string | null;
          category?: string | null;
          gift_type?: 'product' | 'quota' | 'experience' | 'pix';
          is_group_gift?: boolean;
          group_goal?: number | null;
          group_raised?: number;
          status?: 'available' | 'reserved' | 'purchased';
          reserved_by?: string | null;
          reserved_at?: string | null;
          priority?: number;
          created_at?: string;
        };
      };
      gift_contributions: {
        Row: {
          id: string;
          gift_id: string;
          contributor_name: string;
          amount: number;
          payment_method: string | null;
          payment_status: 'pending' | 'completed' | 'failed';
          created_at: string;
        };
        Insert: {
          id?: string;
          gift_id: string;
          contributor_name: string;
          amount: number;
          payment_method?: string | null;
          payment_status?: 'pending' | 'completed' | 'failed';
          created_at?: string;
        };
        Update: {
          id?: string;
          gift_id?: string;
          contributor_name?: string;
          amount?: number;
          payment_method?: string | null;
          payment_status?: 'pending' | 'completed' | 'failed';
          created_at?: string;
        };
      };
      event_photos: {
        Row: {
          id: string;
          event_id: string;
          uploaded_by: string | null;
          photo_url: string;
          caption: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          uploaded_by?: string | null;
          photo_url: string;
          caption?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          uploaded_by?: string | null;
          photo_url?: string;
          caption?: string | null;
          created_at?: string;
        };
      };
      event_messages: {
        Row: {
          id: string;
          event_id: string;
          author_name: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          author_name: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          author_name?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      event_type: 'birthday' | 'baby_shower' | 'quinceanera' | 'corporate' | 'other';
      rsvp_status: 'pending' | 'confirmed' | 'declined' | 'maybe';
      gift_type: 'product' | 'quota' | 'experience' | 'pix';
      gift_status: 'available' | 'reserved' | 'purchased';
      payment_status: 'pending' | 'completed' | 'failed';
    };
  };
};

// Convenience types
export type User = Database['public']['Tables']['users']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type Guest = Database['public']['Tables']['guests']['Row'];
export type Gift = Database['public']['Tables']['gifts']['Row'];
export type GiftContribution = Database['public']['Tables']['gift_contributions']['Row'];
export type EventPhoto = Database['public']['Tables']['event_photos']['Row'];
export type EventMessage = Database['public']['Tables']['event_messages']['Row'];

export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];
export type GuestInsert = Database['public']['Tables']['guests']['Insert'];
export type GuestUpdate = Database['public']['Tables']['guests']['Update'];
export type GiftInsert = Database['public']['Tables']['gifts']['Insert'];
export type GiftUpdate = Database['public']['Tables']['gifts']['Update'];
export type GiftContributionInsert = Database['public']['Tables']['gift_contributions']['Insert'];
