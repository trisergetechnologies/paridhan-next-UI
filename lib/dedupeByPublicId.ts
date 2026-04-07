/** Drops duplicate products when the API or pagination merges produce repeated publicIds. */
export function dedupeByPublicId<T extends { publicId?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const id = String(item.publicId ?? "");
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(item);
  }
  return out;
}
