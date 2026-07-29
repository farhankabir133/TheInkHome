import { KnowledgeDoc } from "./types";
import fs from "fs";
import path from "path";

let bundledDocs: KnowledgeDoc[] | null = null;

export function resolveKnowledgeRoot(): string {
  const candidates = [
    path.join(process.cwd(), "knowledge"),
    path.join(process.cwd(), "dist", "knowledge"),
    path.join(process.cwd(), "src", "knowledge"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return path.join(process.cwd(), "knowledge");
}

function loadBundledDocs(): KnowledgeDoc[] | null {
  if (bundledDocs) return bundledDocs;
  try {
    const { knowledgeDocs } = require("./knowledge-data");
    bundledDocs = knowledgeDocs;
    return bundledDocs;
  } catch {
    return null;
  }
}

function parseFrontmatter(raw: string): { meta: Record<string, any>; body: string } {
  const lines = raw.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") {
    return { meta: {}, body: raw };
  }
  const meta: Record<string, any> = {};
  let i = 1;
  while (i < lines.length && lines[i].trim() !== "---") {
    const line = lines[i];
    const match = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value: any = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      } else if (value.startsWith("[")) {
        try { value = JSON.parse(value); } catch { /* ignore */ }
      } else if (value.startsWith("- ")) {
        value = value.split("\n").map((v) => v.replace(/^-\s*/, "").trim()).filter(Boolean);
      }
      meta[key] = value;
    }
    i++;
  }
  const body = lines.slice(i + 1).join("\n").trim();
  return { meta, body };
}

export async function loadAllDocuments(): Promise<KnowledgeDoc[]> {
  const bundled = loadBundledDocs();
  if (bundled) return bundled;

  const root = resolveKnowledgeRoot();
  if (!fs.existsSync(root)) {
    return [];
  }
  const docs: KnowledgeDoc[] = [];

  async function walk(dir: string, type: string, relativeBase: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(relativeBase, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "__tests__" && !entry.name.startsWith(".")) {
          await walk(fullPath, type, relPath);
        }
      } else if (entry.name.endsWith(".md") && entry.name !== "index.json") {
        try {
          const raw = fs.readFileSync(fullPath, "utf-8");
          const { meta, body } = parseFrontmatter(raw);
          const id = relPath.replace(/\.md$/i, "").replace(/\//g, "-");
          docs.push({
            id,
            type,
            title: meta.title || meta.Title || path.basename(entry.name, ".md"),
            path: relPath,
            content: ([meta.description, body].filter(Boolean).join("\n\n")).trim(),
            tags: [
              ...(meta.categories ? (Array.isArray(meta.categories) ? meta.categories : [meta.categories]) : []),
              ...(meta.tags ? (Array.isArray(meta.tags) ? meta.tags : [meta.tags]) : []),
            ],
            metadata: { ...meta, relativePath: relPath },
          });
        } catch {
          // skip broken docs
        }
      }
    }
  }

  await walk(root, "root", "");
  return docs;
}

export function getDocUrl(relPath: string): string {
  if (relPath.startsWith("articles/")) {
    const slug = relPath.replace(/^articles\//, "").replace(/\.md$/i, "");
    return `https://theinkhome.live/story/${slug}`;
  }
  if (relPath.startsWith("editors/")) {
    const username = relPath.replace(/^editors\//, "").replace(/\.md$/i, "");
    return `https://medium.com/@${username}`;
  }
  if (relPath.startsWith("writers/")) {
    const username = relPath.replace(/^writers\//, "").replace(/\.md$/i, "");
    return `https://medium.com/@${username}`;
  }
  if (relPath.startsWith("founder/")) {
    return "https://theinkhome.live/about";
  }
  if (relPath.startsWith("publication/")) {
    return "https://theinkhome.live/about";
  }
  if (relPath.startsWith("categories/")) {
    return "https://theinkhome.live/about";
  }
  if (relPath.startsWith("support/")) {
    return "https://theinkhome.live/about";
  }
  return "https://theinkhome.live/about";
}

export function getDocTypeLabel(doc: KnowledgeDoc): string {
  if (doc.path.startsWith("articles/")) return "Article";
  if (doc.path.startsWith("editors/")) return "Editor";
  if (doc.path.startsWith("writers/")) return "Writer";
  if (doc.path.startsWith("founder/")) return "Founder";
  if (doc.path.startsWith("publication/")) return "Publication";
  if (doc.path.startsWith("categories/")) return "Category";
  if (doc.path.startsWith("support/")) return "Support";
  return "Document";
}
