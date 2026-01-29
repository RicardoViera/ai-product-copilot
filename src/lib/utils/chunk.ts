export function chunkText(
    text: string,
    opts: { maxChars?: number; overlapChars?: number } = {}
  ) {
    const maxChars = opts.maxChars ?? 1400;
    const overlapChars = opts.overlapChars ?? 200;
  
    const paras = text
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
  
    const chunks: string[] = [];
    let current = "";
  
    for (const p of paras) {
      const candidate = current ? `${current}\n\n${p}` : p;
  
      if (candidate.length <= maxChars) {
        current = candidate;
        continue;
      }
  
      if (current) chunks.push(current);
  
      const overlap = current
        ? current.slice(Math.max(0, current.length - overlapChars))
        : "";
  
      current = overlap ? `${overlap}\n\n${p}` : p;
  
      while (current.length > maxChars) {
        chunks.push(current.slice(0, maxChars));
        current = current.slice(maxChars - overlapChars);
      }
    }
  
    if (current) chunks.push(current);
  
    return chunks;
  }
  