import { supabase } from "./config";
import { serializeData } from "./serializer";
import type { Profile, Education, Skill, Project, Certification, ContactMessage, Settings } from "@/types";

type SupabaseFilter = {
  column: string;
  value: unknown;
  operator?: string;
};

type SupabaseSort = {
  column: string;
  ascending?: boolean;
};

const toCamelCase = (value: string) => value.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const toSnakeCase = (value: string) =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").toLowerCase();

function formatSupabaseError(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;

    if (typeof record.message === "string") return record.message;
    if (typeof record.error === "string") return record.error;
    if (typeof record.details === "string") return record.details;
    if (typeof record.hint === "string") return record.hint;
  }

  return "Unknown error occurred";
}

function throwSupabaseError(error: unknown): never {
  throw new Error(formatSupabaseError(error));
}

function normalizeRecord<T>(record: Record<string, any> | null): T | null {
  if (!record) return null;

  const normalized: Record<string, any> = {};

  Object.entries(record).forEach(([key, value]) => {
    normalized[toCamelCase(key)] = serializeData(value);
  });

  return normalized as T;
}

function normalizeObjectForSupabase<T>(data: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
    result[toSnakeCase(key)] = value;
  });

  return result;
}

async function getCollection<T>(
  tableName: string,
  filters: SupabaseFilter[] = [],
  sorts: SupabaseSort[] = []
): Promise<(T & { id: string })[]> {
  try {
    let query = supabase.from(tableName).select("*");

    filters.forEach(({ column, operator = "eq", value }) => {
      query = query.filter(column, operator, value);
    });

    sorts.forEach(({ column, ascending = true }) => {
      query = query.order(column, { ascending });
    });

    const { data, error } = await query;
    if (error) throwSupabaseError(error);

    return (data ?? []).map((item) => normalizeRecord<T & { id: string }>(item) as T & { id: string });
  } catch (error) {
    console.error(`❌ Error loading ${tableName}:`, error);
    return [];
  }
}

async function getDocument<T>(tableName: string, docId: string): Promise<(T & { id: string }) | null> {
  try {
    const { data, error } = await supabase.from(tableName).select("*").eq("id", docId).maybeSingle();

    if (error && error.code !== "PGRST116") throwSupabaseError(error);
    if (!data) {
      console.log(`⚠️ Document ${docId} not found in ${tableName}`);
      return null;
    }

    return normalizeRecord<T & { id: string }>(data) as T & { id: string };
  } catch (error) {
    console.error(`❌ Error loading document ${docId} from ${tableName}:`, error);
    return null;
  }
}

export async function getProfile(): Promise<Profile | null> {
  return getDocument<Profile>("settings", "profile");
}

export async function saveProfile(data: Partial<Profile>): Promise<void> {
  const payload = normalizeObjectForSupabase({
    id: "profile",
    ...data,
    updated_at: new Date().toISOString(),
  });

  const { error } = await supabase.from("settings").upsert(payload, { onConflict: "id" });
  if (error) throwSupabaseError(error);
}

export async function getEducation(visibleOnly = false): Promise<(Education & { id: string })[]> {
  const filters: SupabaseFilter[] = [];
  if (visibleOnly) filters.push({ column: "visible", value: true });

  return getCollection<Education>("education", filters, [{ column: "order", ascending: true }]);
}

export async function addEducation(data: Omit<Education, "id">): Promise<string> {
  const payload = normalizeObjectForSupabase({
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const { data: inserted, error } = await supabase.from("education").insert(payload).select("id").single();
  if (error) throwSupabaseError(error);
  return inserted.id;
}

export async function updateEducation(id: string, data: Partial<Education>): Promise<void> {
  const payload = normalizeObjectForSupabase({
    ...data,
    updated_at: new Date().toISOString(),
  });

  const { error } = await supabase.from("education").update(payload).eq("id", id);
  if (error) throwSupabaseError(error);
}

export async function deleteEducation(id: string): Promise<void> {
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throwSupabaseError(error);
}

export async function getSkills(visibleOnly = false): Promise<(Skill & { id: string })[]> {
  const filters: SupabaseFilter[] = [];
  if (visibleOnly) filters.push({ column: "visible", value: true });

  return getCollection<Skill>("skills", filters, [{ column: "order", ascending: true }]);
}

export async function addSkill(data: Omit<Skill, "id">): Promise<string> {
  const payload = normalizeObjectForSupabase({
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const { data: inserted, error } = await supabase.from("skills").insert(payload).select("id").single();
  if (error) throwSupabaseError(error);
  return inserted.id;
}

export async function updateSkill(id: string, data: Partial<Skill>): Promise<void> {
  const payload = normalizeObjectForSupabase({
    ...data,
    updated_at: new Date().toISOString(),
  });

  const { error } = await supabase.from("skills").update(payload).eq("id", id);
  if (error) throwSupabaseError(error);
}

export async function deleteSkill(id: string): Promise<void> {
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throwSupabaseError(error);
}

export async function getProjects(visibleOnly = false): Promise<(Project & { id: string })[]> {
  const filters: SupabaseFilter[] = [];
  if (visibleOnly) filters.push({ column: "visible", value: true });

  return getCollection<Project>("projects", filters, [{ column: "order", ascending: true }]);
}

export async function getProject(id: string): Promise<(Project & { id: string }) | null> {
  return getDocument<Project>("projects", id);
}

export async function addProject(data: Omit<Project, "id">): Promise<string> {
  const payload = normalizeObjectForSupabase({
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const { data: inserted, error } = await supabase.from("projects").insert(payload).select("id").single();
  if (error) throwSupabaseError(error);
  return inserted.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  const payload = normalizeObjectForSupabase({
    ...data,
    updated_at: new Date().toISOString(),
  });

  const { error } = await supabase.from("projects").update(payload).eq("id", id);
  if (error) throwSupabaseError(error);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throwSupabaseError(error);
}

export async function getCertifications(visibleOnly = false): Promise<(Certification & { id: string })[]> {
  const filters: SupabaseFilter[] = [];
  if (visibleOnly) filters.push({ column: "visible", value: true });

  return getCollection<Certification>("certifications", filters, [{ column: "order", ascending: true }]);
}

export async function addCertification(data: Omit<Certification, "id">): Promise<string> {
  const payload = normalizeObjectForSupabase({
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const { data: inserted, error } = await supabase.from("certifications").insert(payload).select("id").single();
  if (error) throwSupabaseError(error);
  return inserted.id;
}

export async function updateCertification(id: string, data: Partial<Certification>): Promise<void> {
  const payload = normalizeObjectForSupabase({
    ...data,
    updated_at: new Date().toISOString(),
  });

  const { error } = await supabase.from("certifications").update(payload).eq("id", id);
  if (error) throwSupabaseError(error);
}

export async function deleteCertification(id: string): Promise<void> {
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) throwSupabaseError(error);
}

export async function getMessages(): Promise<(ContactMessage & { id: string })[]> {
  return getCollection<ContactMessage>("messages", [], [{ column: "created_at", ascending: false }]);
}

export async function addMessage(data: Omit<ContactMessage, "id" | "read">): Promise<string> {
  const payload = normalizeObjectForSupabase({
    ...data,
    read: false,
    created_at: new Date().toISOString(),
  });

  const { data: inserted, error } = await supabase.from("messages").insert(payload).select("id").single();
  if (error) throwSupabaseError(error);
  return inserted.id;
}

export async function markMessageRead(id: string): Promise<void> {
  const { error } = await supabase.from("messages").update({ read: true }).eq("id", id);
  if (error) throwSupabaseError(error);
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throwSupabaseError(error);
}

export async function getSettings(): Promise<Settings | null> {
  return getDocument<Settings>("settings", "app");
}

export async function saveSettings(data: Partial<Settings>): Promise<void> {
  const payload = normalizeObjectForSupabase({
    id: "app",
    ...data,
  });

  const { error } = await supabase.from("settings").upsert(payload, { onConflict: "id" });
  if (error) throwSupabaseError(error);
}
