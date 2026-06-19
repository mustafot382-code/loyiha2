"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Group, GroupWithCount, Student } from "@/lib/types";
import { Header } from "@/components/Header";
import { GroupsRail } from "@/components/GroupsRail";
import { StudentsTable } from "@/components/StudentsTable";
import { AddGroupDialog } from "@/components/AddGroupDialog";
import {
  StudentFormDialog,
  type StudentFormValues,
} from "@/components/StudentFormDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type StudentCountRow = Group & { students: { count: number }[] };

export default function Page() {
  const [groups, setGroups] = useState<GroupWithCount[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [studentDialog, setStudentDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    student: Student | null;
  }>({ open: false, mode: "add", student: null });
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  const fetchGroups = useCallback(async () => {
    setLoadingGroups(true);
    const { data, error } = await supabase
      .from("groups")
      .select("*, students(count)")
      .order("created_at", { ascending: true });

    if (error) {
      setErrorMsg(error.message);
      setLoadingGroups(false);
      return;
    }

    const withCounts: GroupWithCount[] = ((data ?? []) as StudentCountRow[]).map(
      (g) => ({
        id: g.id,
        name: g.name,
        is_active: g.is_active,
        created_at: g.created_at,
        student_count: g.students?.[0]?.count ?? 0,
      })
    );

    setGroups(withCounts);
    setLoadingGroups(false);
    return withCounts;
  }, []);

  const fetchStudents = useCallback(async (groupId: string) => {
    setLoadingStudents(true);
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setStudents(data ?? []);
    }
    setLoadingStudents(false);
  }, []);

  // initial load
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // pick a default selected group once groups arrive
  useEffect(() => {
    if (selectedGroupId || groups.length === 0) return;
    const active = groups.find((g) => g.is_active);
    setSelectedGroupId(active?.id ?? groups[0].id);
  }, [groups, selectedGroupId]);

  useEffect(() => {
    if (selectedGroupId) fetchStudents(selectedGroupId);
    else setStudents([]);
  }, [selectedGroupId, fetchStudents]);

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return groups;
    const q = query.trim().toLowerCase();
    return groups.filter((g) => g.name.toLowerCase().includes(q));
  }, [groups, query]);

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) ?? null,
    [groups, selectedGroupId]
  );

  const selectGroup = async (id: string) => {
    setSelectedGroupId(id);
    setGroups((prev) => prev.map((g) => ({ ...g, is_active: g.id === id })));
    const { error } = await supabase
      .from("groups")
      .update({ is_active: true })
      .eq("id", id);
    if (error) setErrorMsg(error.message);
  };

  const handleAddGroup = async (name: string) => {
    const { data, error } = await supabase
      .from("groups")
      .insert({ name, is_active: groups.length === 0 })
      .select()
      .single();
    if (error) throw new Error(error.message);
    const refreshed = await fetchGroups();
    if (data && (groups.length === 0 || !selectedGroupId)) {
      setSelectedGroupId(data.id);
    }
    void refreshed;
  };

  const handleAddStudent = async (values: StudentFormValues) => {
    const { error } = await supabase.from("students").insert({
      group_id: values.group_id,
      full_name: values.full_name.trim(),
      age: values.age ? Number(values.age) : null,
      email: values.email.trim() || null,
    });
    if (error) throw new Error(error.message);
    await fetchGroups();
    if (values.group_id === selectedGroupId) {
      await fetchStudents(values.group_id);
    } else {
      setSelectedGroupId(values.group_id);
    }
  };

  const handleEditStudent = async (values: StudentFormValues) => {
    if (!studentDialog.student) return;
    const { error } = await supabase
      .from("students")
      .update({
        group_id: values.group_id,
        full_name: values.full_name.trim(),
        age: values.age ? Number(values.age) : null,
        email: values.email.trim() || null,
      })
      .eq("id", studentDialog.student.id);
    if (error) throw new Error(error.message);
    await fetchGroups();
    if (selectedGroupId) await fetchStudents(selectedGroupId);
  };

  const toggleStudentActive = async (student: Student, next: boolean) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, is_active: next } : s))
    );
    const { error } = await supabase
      .from("students")
      .update({ is_active: next })
      .eq("id", student.id);
    if (error) {
      setErrorMsg(error.message);
      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id ? { ...s, is_active: !next } : s
        )
      );
    }
  };

  const handleDeleteStudent = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", deleteTarget.id);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    await fetchGroups();
    if (selectedGroupId) await fetchStudents(selectedGroupId);
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl">
      <Header
        query={query}
        onQueryChange={setQuery}
        onAddGroup={() => setAddGroupOpen(true)}
        onAddStudent={() =>
          setStudentDialog({ open: true, mode: "add", student: null })
        }
        addStudentDisabled={!selectedGroupId}
      />

      <div className="px-6 py-6">
        {errorMsg && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-danger/30 bg-danger-tint px-4 py-3 text-sm text-danger">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="font-medium">
              Dismiss
            </button>
          </div>
        )}

        {loadingGroups ? (
          <div className="flex gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[148px] w-64 shrink-0 animate-pulse rounded-xl2 border border-border bg-surface"
              />
            ))}
          </div>
        ) : (
          <GroupsRail
            groups={filteredGroups}
            selectedGroupId={selectedGroupId}
            onSelect={selectGroup}
            query={query}
          />
        )}

        {loadingStudents ? (
          <div className="mt-8 h-40 animate-pulse rounded-xl2 border border-border bg-surface" />
        ) : (
          <StudentsTable
            students={students}
            groupName={selectedGroup?.name ?? null}
            onToggleActive={toggleStudentActive}
            onEdit={(student) =>
              setStudentDialog({ open: true, mode: "edit", student })
            }
            onDelete={(student) => setDeleteTarget(student)}
          />
        )}
      </div>

      <AddGroupDialog
        open={addGroupOpen}
        onClose={() => setAddGroupOpen(false)}
        onSubmit={handleAddGroup}
      />

      <StudentFormDialog
        open={studentDialog.open}
        mode={studentDialog.mode}
        groups={groups}
        defaultGroupId={selectedGroupId}
        student={studentDialog.student}
        onClose={() =>
          setStudentDialog({ open: false, mode: "add", student: null })
        }
        onSubmit={
          studentDialog.mode === "add" ? handleAddStudent : handleEditStudent
        }
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete student"
        description={
          deleteTarget
            ? `Remove ${deleteTarget.full_name} from the roster? This can't be undone.`
            : ""
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteStudent}
      />
    </main>
  );
}
