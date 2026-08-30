/**
 * Convert Firestore objects to plain JavaScript objects for client components
 * Strips out toJSON methods and converts Timestamps to ISO strings
 */

export function serializeData<T>(data: any): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Convert Firestore Timestamp objects
  if (data && typeof data === 'object') {
    // Check if it's a Firestore Timestamp (has toDate method or seconds property)
    if ((typeof data.toDate === 'function') || (typeof data.seconds === 'number')) {
      try {
        const date = typeof data.toDate === 'function' 
          ? data.toDate() 
          : new Date(data.seconds * 1000);
        return date.toISOString() as any;
      } catch (e) {
        // If conversion fails, return the timestamp as-is
        return { seconds: data.seconds, nanoseconds: data.nanoseconds } as any;
      }
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => serializeData(item)) as any;
    }

    // Handle plain objects - recursively serialize all properties
    const serialized: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        serialized[key] = serializeData(data[key]);
      }
    }
    // Remove toJSON method if it exists
    delete serialized.toJSON;
    return serialized;
  }

  return data;
}
