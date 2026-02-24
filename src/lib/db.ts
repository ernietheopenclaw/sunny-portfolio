"use client";

import { supabase } from "@/lib/supabase";
import { Project, Post, Publication, Skill } from "@/types";
import { mockProjects, mockPosts, mockPublications, mockSkills } from "@/data/mock";

// Generic fetch + merge helper
async function fetchAndMerge<T extends { id: string }>(
  table: string,
  mockData: T[],
  idField: string = "id"
): Promise<T[]> {
  try {
    const { data: dbRows, error } = await supabase.from(table).select("*");
    if (error || !dbRows) return mockData;

    const dbMap = new Map<string, Record<string, unknown>>();
    for (const row of dbRows) dbMap.set(row[idField], row);

    const result: T[] = [];
    for (const mock of mockData) {
      const override = dbMap.get((mock as Record<string, unknown>)[idField] as string);
      if (override) {
        if (override.is_hidden) continue;
        // Merge override fields onto mock
        const merged = { ...mock };
        for (const [k, v] of Object.entries(override)) {
          if (v !== null && v !== undefined && k !== "is_hidden" && k !== "is_user_created" && k !== "created_at" && k !== "updated_at") {
            (merged as Record<string, unknown>)[k] = v;
          }
        }
        result.push(merged);
        dbMap.delete((mock as Record<string, unknown>)[idField] as string);
      } else {
        result.push(mock);
      }
    }

    // Add user-created items
    for (const [, row] of dbMap) {
      if (row.is_hidden) continue;
      if (row.is_user_created) {
        result.push(row as unknown as T);
      }
    }

    return result;
  } catch {
    return mockData;
  }
}

export async function getProjectsAsync(): Promise<Project[]> {
  return fetchAndMerge("projects", mockProjects);
}

export async function getPostsAsync(): Promise<Post[]> {
  return fetchAndMerge("posts", mockPosts);
}

export async function getPublicationsAsync(): Promise<Publication[]> {
  return fetchAndMerge("publications", mockPublications);
}

export async function getSkillsAsync(): Promise<Skill[]> {
  // Skills don't have id in the type, so we need special handling
  try {
    const { data: dbRows, error } = await supabase.from("skills").select("*");
    if (error || !dbRows || dbRows.length === 0) return mockSkills;

    const dbMap = new Map<string, Record<string, unknown>>();
    for (const row of dbRows) dbMap.set(row.id, row);

    const result: Skill[] = [];
    for (const mock of mockSkills) {
      // Use name as matching key for mock skills
      const mockId = mock.name.toLowerCase().replace(/\s+/g, "-");
      const override = dbMap.get(mockId);
      if (override) {
        if (override.is_hidden) continue;
        const merged: Skill = { ...mock };
        if (override.name) merged.name = override.name as string;
        if (override.category) merged.category = override.category as string;
        if (override.level !== undefined) merged.level = override.level as number;
        if (override.tags) merged.tags = override.tags as string[];
        result.push(merged);
        dbMap.delete(mockId);
      } else {
        result.push(mock);
      }
    }

    for (const [, row] of dbMap) {
      if (row.is_hidden) continue;
      if (row.is_user_created) {
        result.push({
          name: row.name as string,
          category: (row.category as string) || "Other",
          level: (row.level as number) || 50,
          tags: (row.tags as string[]) || undefined,
        });
      }
    }

    return result;
  } catch {
    return mockSkills;
  }
}

export async function getAboutAsync(): Promise<{ intro: string; body1: string; body2: string } | null> {
  try {
    const { data, error } = await supabase.from("about").select("*").eq("id", "main").single();
    if (error || !data) return null;
    return { intro: data.intro, body1: data.body1, body2: data.body2 };
  } catch {
    return null;
  }
}

export async function getSettingsAsync(): Promise<{ auth_type: string; summary_length: number; selected_model: string } | null> {
  try {
    const { data, error } = await supabase.from("settings").select("*").eq("id", "main").single();
    if (error || !data) return null;
    return { auth_type: data.auth_type, summary_length: data.summary_length, selected_model: data.selected_model };
  } catch {
    return null;
  }
}

// Generic save via API route
export async function saveToDb(table: string, row: Record<string, unknown>) {
  const res = await fetch(`/api/db/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...row, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`Failed to save to ${table}`);
  return res.json();
}

export async function deleteFromDb(table: string, id: string) {
  const res = await fetch(`/api/db/${table}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error(`Failed to delete from ${table}`);
  return res.json();
}

export async function hideInDb(table: string, id: string) {
  return saveToDb(table, { id, is_hidden: true });
}
