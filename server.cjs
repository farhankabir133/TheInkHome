var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var DEFAULT_STORIES = [
  {
    title: "The Spatial Medium: Redefining Digital Architecture",
    link: "https://medium.com/the-ink-home/spatial-medium-redefining-digital-architecture",
    author: "Elena Rostov",
    role: "Editor-in-Chief",
    pubDate: "Sun, 31 May 2026 10:00:00 GMT",
    categories: ["Architecture", "Digital Art", "Design"],
    description: "An inquiry into the collapse of screen borders, tracing how digital typography transitions from absolute grid references to floating spatial objects in three-dimensional environments.",
    content: '<p>The screen is no longer a surface. It is a portal with physical, kinetic depth. As we transition from flat editorial spaces to volumetric layouts, we are forced to rethink typography, paragraph spacing, and user eye tracking. In this first major thesis from the Spatial Design lab at The Ink Home, we trace the transition from paper to pixels, and finally, into multi-dimensional kinetic canvases.</p><figure><img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" /></figure><p>The concept of digital printing elements floating in depth allows editors to establish physical visual hierarchy. Larger headers can sit 20px closer to the camera, creating natural parallax during scroll.</p>',
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    slug: "spatial-medium-redefining-digital-architecture",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    title: "Aesthesis and the Algorithmic Composer",
    link: "https://medium.com/the-ink-home/aesthesis-algorithmic-composer",
    author: "Devon Vance",
    role: "AI Creative Lead",
    pubDate: "Fri, 29 May 2026 14:15:00 GMT",
    categories: ["Artificial Intelligence", "Sound", "Philosophy"],
    description: "How neural networks are rebuilding the acoustic syntax of modern interactive journalism, generating ambient soundtracks keyed directly to reading velocity.",
    content: '<p>What does text sound like when it is read? Not spoken, but felt. At The Ink Home, we\u2019ve developed a generative ambient soundscape system that dynamically syncs background tones with the user\u2019s reading position. High-density words trigger subtle high-frequency resonances, while narrative gaps bring in deep drone base hums.</p><figure><img src="https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1200&q=80" /></figure><p>This is the future of immersive editorial. The browser serves not just as a visual reader, but as a sensory conductor.</p>',
    cover: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1200&q=80",
    slug: "aesthesis-algorithmic-composer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    title: "Liquid Typography: The Kinetic Textures of Midnight",
    link: "https://medium.com/the-ink-home/liquid-typography-kinetic-textures",
    author: "Sophia Sterling",
    role: "Senior Graphic Editor",
    pubDate: "Wed, 27 May 2026 09:30:00 GMT",
    categories: ["Typography", "Motion Design", "Creative Coding"],
    description: "Plunging deep into viscous web text layouts. We explore the implementation of fluid shaders that bend, float, and flow dynamically as the cursor collides with headlines.",
    content: '<p>Static fonts are dead. When we look at a screen, we expect characters to display organic behaviors like tension and viscosity. Liquid Typography examines WebGL-based typeface meshes that adapt to mouse momentum, splitting and re-joining with gorgeous metallic finishes.</p><figure><img src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80" /></figure><p>The tactile weight of these digital glyphs creates physical engagement, transforming reading from a passive habit into an active somatic experience.</p>',
    cover: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    slug: "liquid-typography-kinetic-textures",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    title: "The Ink Archive: Tracing the Philosophy of Cyber-Scribes",
    link: "https://medium.com/the-ink-home/philosophy-of-cyber-scribes",
    author: "Elena Rostov",
    role: "Editor-in-Chief",
    pubDate: "Mon, 25 May 2026 18:20:00 GMT",
    categories: ["Philosophy", "Literature", "Cyberculture"],
    description: "An archival study of electronic literary clubs, examining how the ink on our hands became code in the browser, and the collective spirit of the digital publication.",
    content: '<p>The ink of the modern age does not stain fingers; it alters screens. In tracing the lineage from printed zines to the Medium feed, the cybernetic publishing space retains its punk roots. This long-form article details our collective\u2019s mission to preserve raw editorial control amidst algorithmic feed curation.</p><figure><img src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80" /></figure><p>By transforming Medium metadata into spatial coordinates, we free the articles from standardized corporate grids into infinite editorial solar systems.</p>',
    cover: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
    slug: "philosophy-of-cyber-scribes",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    title: "Metadimensional Interfaces: Beyond the Desktop Metaphor",
    link: "https://medium.com/the-ink-home/metadimensional-interfaces-beyond-desktop",
    author: "Marcus Chen",
    role: "Interaction Director",
    pubDate: "Thu, 21 May 2026 11:10:00 GMT",
    categories: ["UI/UX", "Future", "Science Fiction"],
    description: "A prospective review of zero-gravity dashboards, spatial data stacks, and multi-layered typography systems designed for neural-link and depth interfaces.",
    content: '<p>For forty years, human-computer interaction has lived in the flat confines of cardboard-desktop file systems. But what happens when interfaces occupy floating depths? We present a speculative UI suite that arranges ideas in atomic orbits, letting stories interact with one another based on content tags.</p><figure><img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80" /></figure><p>In the spatial web, context is visual distance. High relevance brings items closer, while divergent files drift to the horizons.</p>',
    cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    slug: "metadimensional-interfaces-beyond-desktop",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  }
];
var FALLBACK_ABOUT = {
  description: "The Ink Home is a place where words feel at home. Here, we share stories that explore life, writing, technology, productivity, relationships and mental health. Every piece is a reflection, a lesson, or a moment meant to inspire, connect, and spark thought.",
  officialWebsite: "https://farhankabir133.github.io/The-Ink-Home/",
  editors: [
    {
      name: "Farhan Kabir",
      username: "farhankabir133",
      role: "AI Engineer | Full-Stack Dev",
      bio: "A technology essayist, digital artisan, and design researcher exploring interfaces and spatial publishing mediums at The Ink Home.",
      avatar: "https://miro.medium.com/v2/resize:fit:2400/1*OonAmXM0uBzGf_KYL3s85w.png",
      followers: 684,
      mediumUrl: "https://medium.com/@farhankabir133"
    },
    {
      name: "Dua Batool",
      username: "dbatool242",
      role: "Published Book Author | Zoology Student",
      bio: "An inquisitive mind investigating life patterns, biological ecosystems, and deep narrative themes through published works.",
      avatar: "https://miro.medium.com/v2/resize:fit:2400/1*4o35ax2_LSaOtP-3Lfi0Eg.jpeg",
      followers: 135,
      mediumUrl: "https://medium.com/@dbatool242"
    }
  ],
  writers: [
    {
      name: "Yiwan Ye",
      username: "yiwanye",
      role: "Tech & Productivity Writer",
      bio: "Yiwan explores human-centric productivity frameworks, software system designs, and personal development mechanisms.",
      avatar: "https://miro.medium.com/v2/da:true/resize:fit:2400/0*UtfdEWoDpfcG0zQE"
    },
    {
      name: "Soami Daya Krishnananda",
      username: "soamidayakrishnananda",
      role: "Philosophical & Wellness Essayist",
      bio: "Soami explores the intersection of ancient wisdom, modern mindfulness, mental health resilience, and poetic philosophy.",
      avatar: "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156"
    },
    {
      name: "Anna Jaworska",
      username: "annajaworska",
      role: "Mental Health & Relationships Analyst",
      bio: "Anna researches psychological safety, interpersonal relationship dynamics, and mental wellness in a digital-dominated world.",
      avatar: "https://miro.medium.com/v2/resize:fit:2400/0*_D8djmuiTP88tAfM.jpeg"
    },
    {
      name: "M. Arman Reza Shah",
      username: "marmanrezashah",
      role: "Creative Tech Writer",
      bio: "Arman writes about emerging paradigms in web technology, software engineering, and digital art interfaces.",
      avatar: "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156"
    },
    {
      name: "Achelle Santos",
      username: "achellesantos",
      role: "Human Behavior Researcher",
      bio: "Achelle focuses on life patterns, cognitive wellness, human relations, and narratives of growth.",
      avatar: "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156"
    },
    {
      name: "Amber Faulk",
      username: "amberfaulk",
      role: "Culture & Creative Writer",
      bio: "Amber crafts reflective essays about modern culture, storytelling, the art of writing, and personal resilience.",
      avatar: "https://miro.medium.com/v2/da:true/resize:fit:2400/0*p2SLJ4oqFubl4-Fw"
    },
    {
      name: "Paushali Das",
      username: "paushalidas",
      role: "Literary & Mental Health Columnist",
      bio: "Paushali translates raw emotional experiences, trauma work, and creative writing practices into deeply connecting reflective essays.",
      avatar: "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156"
    },
    {
      name: "Sadman Taqi",
      username: "sadmantaqi",
      role: "Productivity & Tech Columnist",
      bio: "Sadman explores mental design, optimization habits, modern workspaces, and technical productivity systems.",
      avatar: "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156"
    },
    {
      name: "Taiba Mansuri",
      username: "taibamansuri",
      role: "Life & Empathy Essayist",
      bio: "Taiba investigates the nuances of human connection, empathy-driven product designs, and modern mental health landscapes.",
      avatar: "https://miro.medium.com/v2/resize:fit:2400/1*1dpRDcpKeFMMpwXY2PT8nw.jpeg"
    },
    {
      name: "Claudio Casella",
      username: "claudiocasella",
      role: "Socio-Technical Writer",
      bio: "Claudio explores cybernetic design, organizational structures, technology integration, and philosophical writing.",
      avatar: "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156"
    },
    {
      name: "Amoo Ridwan",
      username: "amooridwan",
      role: "System & Life Philosopher",
      bio: "Amoo discusses personal development tactics, software productivity frameworks, and mindful focus-building.",
      avatar: "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156"
    },
    {
      name: "LOGESH T V",
      username: "logeshtv",
      role: "Digital Media Developer & Critic",
      bio: "Logesh is a developer examining information flow, UI interactions, digital publishing frameworks, and writing culture.",
      avatar: "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156"
    },
    {
      name: "Mim Maya",
      username: "mimmaya",
      role: "Human Relations & Psychology Writer",
      bio: "Mim translates psychological research and emotional learning into relatable wellness patterns and relationship guidelines.",
      avatar: "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156"
    }
  ]
};
var avatarCache = /* @__PURE__ */ new Map();
async function getMediumAvatarWithCache(username) {
  const cacheKey = username.toLowerCase().trim();
  if (avatarCache.has(cacheKey)) {
    return avatarCache.get(cacheKey) || "";
  }
  const staticPreserves = {
    "farhankabir133": "https://miro.medium.com/v2/resize:fit:2400/1*OonAmXM0uBzGf_KYL3s85w.png",
    "dbatool242": "https://miro.medium.com/v2/resize:fit:2400/1*4o35ax2_LSaOtP-3Lfi0Eg.jpeg",
    "yiwanye": "https://miro.medium.com/v2/da:true/resize:fit:2400/0*UtfdEWoDpfcG0zQE",
    "soamidayakrishnananda": "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156",
    "annajaworska": "https://miro.medium.com/v2/resize:fit:2400/0*_D8djmuiTP88tAfM.jpeg",
    "marmanrezashah": "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156",
    "achellesantos": "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156",
    "amberfaulk": "https://miro.medium.com/v2/da:true/resize:fit:2400/0*p2SLJ4oqFubl4-Fw",
    "paushalidas": "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156",
    "sadmantaqi": "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156",
    "taibamansuri": "https://miro.medium.com/v2/resize:fit:2400/1*1dpRDcpKeFMMpwXY2PT8nw.jpeg",
    "claudiocasella": "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156",
    "amooridwan": "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156",
    "logeshtv": "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156",
    "mimmaya": "https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156"
  };
  if (staticPreserves[cacheKey]) {
    avatarCache.set(cacheKey, staticPreserves[cacheKey]);
    return staticPreserves[cacheKey];
  }
  try {
    const profileUrl = "https://medium.com/@" + username;
    const response = await fetch(profileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    if (response.ok) {
      const html = await response.text();
      if (html) {
        const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) || html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i);
        if (ogMatch && ogMatch[1]) {
          const imgUrl = ogMatch[1].trim();
          if (imgUrl && imgUrl.startsWith("http") && !imgUrl.includes("avatar/default") && !imgUrl.includes("dn-uploads")) {
            avatarCache.set(cacheKey, imgUrl);
            return imgUrl;
          }
        }
      }
    }
  } catch (err) {
  }
  try {
    const userFeedUrl = `https://medium.com/feed/@${username}`;
    const rss2JsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(userFeedUrl)}`;
    const res = await fetch(rss2JsonUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === "ok" && data.feed && data.feed.image) {
        const imgUrl = data.feed.image.trim();
        if (imgUrl && imgUrl.startsWith("http") && !imgUrl.includes("avatar/default")) {
          avatarCache.set(cacheKey, imgUrl);
          return imgUrl;
        }
      }
    }
  } catch (err) {
  }
  try {
    const profileUrl = "https://medium.com/@" + username;
    const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(profileUrl)}`;
    const response = await fetch(allOriginsUrl);
    if (response.ok) {
      const data = await response.json();
      const html = data && data.contents;
      if (html) {
        const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) || html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i);
        if (ogMatch && ogMatch[1]) {
          const imgUrl = ogMatch[1].trim();
          if (imgUrl && imgUrl.startsWith("http") && !imgUrl.includes("avatar/default") && !imgUrl.includes("dn-uploads")) {
            avatarCache.set(cacheKey, imgUrl);
            return imgUrl;
          }
        }
      }
    }
  } catch (err) {
  }
  const unavatarUrl = `https://unavatar.io/medium/${username}`;
  avatarCache.set(cacheKey, unavatarUrl);
  return unavatarUrl;
}
function prefetchAvatars(aboutData) {
  console.log("Starting silent prefetch of Medium profile images...");
  const allScribes = [...aboutData.editors, ...aboutData.writers];
  Promise.all(
    allScribes.map(async (scribe) => {
      if (scribe.username) {
        await getMediumAvatarWithCache(scribe.username);
      }
    })
  ).catch(() => {
  });
}
function parseMediumRSS(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];
    let title = "Untitled Story";
    const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/title>/);
    if (titleMatch) {
      title = (titleMatch[1] || titleMatch[2] || "").trim();
    }
    let link = "";
    const linkMatch = itemContent.match(/<link>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/link>/);
    if (linkMatch) {
      link = (linkMatch[1] || linkMatch[2] || "").trim();
    }
    let author = "The Ink Home Team";
    const creatorMatch = itemContent.match(/<dc:creator>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/dc:creator>/) || itemContent.match(/<creator>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/creator>/);
    if (creatorMatch) {
      author = (creatorMatch[1] || creatorMatch[2] || "").trim();
    }
    let pubDate = (/* @__PURE__ */ new Date()).toUTCString();
    const pubDateMatch = itemContent.match(/<pubDate>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/pubDate>/);
    if (pubDateMatch) {
      pubDate = (pubDateMatch[1] || pubDateMatch[2] || "").trim();
    }
    const categoryRegex = /<category>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/category>/g;
    const categories = [];
    let catMatch;
    while ((catMatch = categoryRegex.exec(itemContent)) !== null) {
      categories.push((catMatch[1] || catMatch[2] || "").trim());
    }
    if (categories.length === 0) {
      categories.push("Editorial", "The Ink Home");
    }
    let content = "";
    const contentMatch = itemContent.match(/<content:encoded>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/content:encoded>/) || itemContent.match(/<description>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/description>/);
    if (contentMatch) {
      content = (contentMatch[1] || contentMatch[2] || "").trim();
    }
    let cover = "";
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;
    const imgMatch = content.match(imgRegex);
    if (imgMatch && imgMatch[1]) {
      cover = imgMatch[1];
    } else {
      const randSeed = Math.abs(title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0));
      const presetCovers = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
      ];
      cover = presetCovers[randSeed % presetCovers.length];
    }
    const authorAvatars = {
      "Elena Rostov": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      "Devon Vance": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      "Sophia Sterling": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      "Marcus Chen": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    };
    const avatar = authorAvatars[author] || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`;
    const authorRoles = {
      "Elena Rostov": "Editor-in-Chief",
      "Devon Vance": "AI Creative Lead",
      "Sophia Sterling": "Senior Graphic Editor",
      "Marcus Chen": "Interaction Director"
    };
    const role = authorRoles[author] || "Staff Editor";
    let slug = "";
    if (link) {
      const parts = link.split("/");
      const lastPart = parts[parts.length - 1];
      slug = lastPart ? lastPart.split("?")[0] : "";
    }
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const cleanSnippet = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 180) + "...";
    items.push({
      title,
      link,
      author,
      role,
      pubDate,
      categories,
      description: cleanSnippet,
      content,
      cover,
      slug,
      avatar
    });
  }
  return items;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/stories", async (req, res) => {
    let xmlData = "";
    let fetchedStories = [];
    let methodUsed = "rss2json";
    try {
      console.log("Tier 1: Fetching stories from Medium via rss2json translation API...");
      const rss2JsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://medium.com/feed/the-ink-home")}`;
      const proxyRes = await fetch(rss2JsonUrl);
      if (proxyRes.ok) {
        const jsonPayload = await proxyRes.json();
        if (jsonPayload && jsonPayload.status === "ok" && Array.isArray(jsonPayload.items)) {
          fetchedStories = jsonPayload.items.map((item) => {
            let cover = "";
            let content = item.content || item.description || "";
            const imgMatches = content.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatches && imgMatches[1]) {
              cover = imgMatches[1];
            } else {
              const randSeed = Math.abs(item.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0));
              const presetCovers = [
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
              ];
              cover = presetCovers[randSeed % presetCovers.length];
            }
            const authorAvatars = {
              "Elena Rostov": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
              "Devon Vance": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
              "Sophia Sterling": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
              "Marcus Chen": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
            };
            const author = item.author || "The Ink Home Team";
            const avatar = authorAvatars[author] || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`;
            const authorRoles = {
              "Elena Rostov": "Editor-in-Chief",
              "Devon Vance": "AI Creative Lead",
              "Sophia Sterling": "Senior Graphic Editor",
              "Marcus Chen": "Interaction Director"
            };
            const role = authorRoles[author] || "Staff Editor";
            let slug = "";
            if (item.link) {
              const parts = item.link.split("/");
              const lastPart = parts[parts.length - 1];
              slug = lastPart ? lastPart.split("?")[0] : "";
            }
            if (!slug) {
              slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            }
            const cleanSnippet = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 180) + "...";
            return {
              title: item.title,
              link: item.link,
              author,
              role,
              pubDate: item.pubDate,
              categories: Array.isArray(item.categories) ? item.categories : ["Editorial"],
              description: cleanSnippet,
              content,
              cover,
              slug,
              avatar
            };
          });
          console.log(`Successfully parsed ${fetchedStories.length} stories via translator proxy.`);
        }
      }
    } catch (e) {
    }
    if (fetchedStories.length === 0) {
      try {
        console.log("Tier 2: Attempting direct retrieve of RSS channel feed as fallback...");
        const response = await fetch("https://medium.com/feed/the-ink-home", {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          }
        });
        if (response.ok) {
          xmlData = await response.text();
          fetchedStories = parseMediumRSS(xmlData);
          methodUsed = "direct";
          console.log(`Successfully parsed ${fetchedStories.length} stories via direct fallback.`);
        }
      } catch (directError) {
      }
    }
    try {
      if (fetchedStories && fetchedStories.length > 0) {
        const uniqueStories = [...fetchedStories];
        DEFAULT_STORIES.forEach((ds) => {
          const alreadyExists = uniqueStories.some(
            (us) => us.title.toLowerCase() === ds.title.toLowerCase() || us.slug === ds.slug
          );
          if (!alreadyExists) {
            uniqueStories.push(ds);
          }
        });
        res.json({ source: methodUsed, stories: uniqueStories });
      } else {
        console.log("No dynamic stories fetched. Serving robust Tier 3 curated fallback feed.");
        res.json({ source: "fallback", stories: DEFAULT_STORIES });
      }
    } catch (responseError) {
      console.warn("Error during response formatting. Returning defaults as ultimate protection:", responseError);
      res.json({ source: "fallback", stories: DEFAULT_STORIES });
    }
  });
  app.get("/api/about", async (req, res) => {
    try {
      console.log("Serving high-fidelity editorial about information with automated profile image sync...");
      const responseAbout = {
        description: FALLBACK_ABOUT.description,
        officialWebsite: FALLBACK_ABOUT.officialWebsite,
        editors: await Promise.all(
          FALLBACK_ABOUT.editors.map(async (e) => {
            const avatar = await getMediumAvatarWithCache(e.username);
            return {
              ...e,
              avatar: avatar || e.avatar
            };
          })
        ),
        writers: await Promise.all(
          FALLBACK_ABOUT.writers.map(async (w) => {
            const avatar = await getMediumAvatarWithCache(w.username);
            return {
              ...w,
              avatar: avatar || w.avatar
            };
          })
        )
      };
      res.json(responseAbout);
    } catch (error) {
      console.error("Failed to serve about endpoint: ", error);
      res.json(FALLBACK_ABOUT);
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Ink Home Server running on http://localhost:${PORT}`);
    prefetchAvatars(FALLBACK_ABOUT);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
