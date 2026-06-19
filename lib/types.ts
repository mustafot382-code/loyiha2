export type Group = {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
};

export type Student = {
  id: string;
  group_id: string;
  full_name: string;
  age: number | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
};

export type GroupWithCount = Group & { student_count: number };

// Minimal hand-written Database type so the supabase-js client gets
// table-level autocomplete without needing the Supabase CLI codegen step.
export type Database = {
  public: {
    Tables: {
      groups: {
        Row: Group;
        Insert: Partial<Group> & { name: string };
        Update: Partial<Group>;
      };
      students: {
        Row: Student;
        Insert: Partial<Student> & { full_name: string; group_id: string };
        Update: Partial<Student>;
      };
    };
  };
};
