/**
 * Normalize Supabase row objects into plain JavaScript values for the app.
 * This keeps the existing UI code working without Firebase-specific objects.
 */

export function serializeData<T>(data: any): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => serializeData(item)) as T;
  }

  if (data && typeof data === "object") {
    const serialized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      if (key === "toJSON") continue;
      const normalizedKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      serialized[normalizedKey] = serializeData(value);
    }

    return serialized as T;
  }

  return data;
}
