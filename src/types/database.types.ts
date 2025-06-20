export type Json =
  | string
  | number
  | boolean
  | null
  | {[key: string]: Json | undefined}
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      character_progress: {
        Row: {
          category: string;
          character_id: string;
          id: string;
          item_name: string;
          max_value: number | null;
          metadata: Json | null;
          progress_value: number;
          updated_at: string;
        };
        Insert: {
          category: string;
          character_id: string;
          id?: string;
          item_name: string;
          max_value?: number | null;
          metadata?: Json | null;
          progress_value?: number;
          updated_at?: string;
        };
        Update: {
          category?: string;
          character_id?: string;
          id?: string;
          item_name?: string;
          max_value?: number | null;
          metadata?: Json | null;
          progress_value?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'character_progress_character_id_fkey';
            columns: ['character_id'];
            isOneToOne: false;
            referencedRelation: 'characters';
            referencedColumns: ['id'];
          },
        ];
      };
      characters: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          server: string | null;
          updated_at: string;
          user_id: string;
          is_public: boolean;
          public_url_slug: string | null;
          privacy_updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          server?: string | null;
          updated_at?: string;
          user_id: string;
          is_public?: boolean;
          public_url_slug?: string | null;
          privacy_updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          server?: string | null;
          updated_at?: string;
          user_id?: string;
          is_public?: boolean;
          public_url_slug?: string | null;
          privacy_updated_at?: string;
        };
        Relationships: [];
      };
      character_job_progress: {
        Row: {
          character_id: string;
          id: string;
          is_unlocked: boolean;
          job_id: string;
          job_points: number;
          main_level: number;
          master_level: number;
          sub_level: number;
          updated_at: string;
        };
        Insert: {
          character_id: string;
          id?: string;
          is_unlocked?: boolean;
          job_id: string;
          job_points?: number;
          main_level?: number;
          master_level?: number;
          sub_level?: number;
          updated_at?: string;
        };
        Update: {
          character_id?: string;
          id?: string;
          is_unlocked?: boolean;
          job_id?: string;
          job_points?: number;
          main_level?: number;
          master_level?: number;
          sub_level?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'character_job_progress_character_id_fkey';
            columns: ['character_id'];
            isOneToOne: false;
            referencedRelation: 'characters';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'character_job_progress_job_id_fkey';
            columns: ['job_id'];
            isOneToOne: false;
            referencedRelation: 'jobs';
            referencedColumns: ['id'];
          },
        ];
      };
      character_skill_progress: {
        Row: {
          character_id: string;
          current_level: number;
          id: string;
          skill_id: string;
          updated_at: string;
        };
        Insert: {
          character_id: string;
          current_level?: number;
          id?: string;
          skill_id: string;
          updated_at?: string;
        };
        Update: {
          character_id?: string;
          current_level?: number;
          id?: string;
          skill_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'character_skill_progress_character_id_fkey';
            columns: ['character_id'];
            isOneToOne: false;
            referencedRelation: 'characters';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'character_skill_progress_skill_id_fkey';
            columns: ['skill_id'];
            isOneToOne: false;
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
        ];
      };
      jobs: {
        Row: {
          created_at: string;
          id: string;
          is_advanced_job: boolean;
          job_type: string;
          name: string;
          required_expansion: string | null;
          short_name: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_advanced_job?: boolean;
          job_type: string;
          name: string;
          required_expansion?: string | null;
          short_name: string;
          sort_order: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_advanced_job?: boolean;
          job_type?: string;
          name?: string;
          required_expansion?: string | null;
          short_name?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          category: string | null;
          created_at: string;
          id: string;
          max_base_level: number;
          name: string;
          skill_type: string;
          sort_order: number;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          id?: string;
          max_base_level?: number;
          name: string;
          skill_type: string;
          sort_order: number;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          id?: string;
          max_base_level?: number;
          name?: string;
          skill_type?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_character_by_slug: {
        Args: {
          slug: string;
        };
        Returns: Json;
      };
      get_character_progress_summary: {
        Args: {
          character_uuid: string;
        };
        Returns: Json;
      };
      toggle_character_privacy: {
        Args: {
          character_uuid: string;
          new_is_public: boolean;
        };
        Returns: Json;
      };
      update_job_progress: {
        Args: {
          character_uuid: string;
          job_uuid: string;
          new_main_level?: number;
          new_sub_level?: number;
          new_job_points?: number;
          new_master_level?: number;
        };
        Returns: Json;
      };
      update_skill_progress: {
        Args: {
          character_uuid: string;
          skill_uuid: string;
          new_level: number;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | {schema: keyof Database},
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {schema: keyof Database}
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | {schema: keyof Database},
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {schema: keyof Database}
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | {schema: keyof Database},
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {schema: keyof Database}
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | {schema: keyof Database},
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {schema: keyof Database}
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | {schema: keyof Database},
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {schema: keyof Database}
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
