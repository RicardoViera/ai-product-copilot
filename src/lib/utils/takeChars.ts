export function takeUpToChars(items: { content: string }[], maxChars: number) {
    const out: string[] = [];
    let used = 0;
  
    for (const it of items) {
      if (used >= maxChars) break;
      const remaining = maxChars - used;
      const slice = it.content.slice(0, remaining);
      out.push(slice);
      used += slice.length;
    }
  
    return out;
  }
  