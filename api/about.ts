import type { VercelRequest, VercelResponse } from "@vercel/node";

type AboutEditor = {
  name: string;
  username: string;
  role: string;
  bio: string;
  avatar: string;
  followers: number;
  mediumUrl: string;
};

type AboutWriter = {
  name: string;
  username: string;
  role: string;
  bio: string;
};

type AboutData = {
  description: string;
  officialWebsite: string;
  editors: AboutEditor[];
  writers: AboutWriter[];
};

const FALLBACK_ABOUT: AboutData = {
  description: "The Ink Home is a place where words feel at home. Here, we share stories that explore life, writing, technology, productivity, relationships and mental health. Every piece is a reflection, a lesson, or a moment meant to inspire, connect, and spark thought.",
  officialWebsite: "https://theinkhome.live/",
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
      name: "Adam McClarin",
      username: "adammcclarin",
      role: "VeloxSync Creator & AI Engineer",
      bio: "Adam McClarin | Founder of Meraki Is Love · Creator of VeloxSync · Full-Stack Dev · AI Engineer · Published Author · Friendswood, TX · adammcclarin.com"
    },
    {
      name: "Mabel Penrose",
      username: "mabelpenrose",
      role: "HSP & Creative Essayist",
      bio: "Free spirit, HSP, and former military brat exploring what it means to feel deeply in a chaotic world."
    },
    {
      name: "Yiwan Ye",
      username: "yiwanye",
      role: "Assistant Professor & Health Researcher",
      bio: "Assistant Professor of Health & Human Services. Research interests include population health, happiness, cohort analysis, Bayesian statistics, and AI."
    },
    {
      name: "Soami Daya Krishnananda",
      username: "soamidayakrishnananda",
      role: "Physicist & Metaphysics Columnist",
      bio: "A physicist at the crossroads of science and conscience, reflecting on bio-logic of life in the vast landscape of metaphysics."
    },
    {
      name: "curious but grounded | Anna Jaworska",
      username: "annajaworska",
      role: "Systems & Emotional Patterns Essayist",
      bio: "I write about misunderstood things: people, systems, materials, ideas, and emotional patterns that don't fit neatly into modern life. Curious but grounded."
    },
    {
      name: "M. Arman Reza Shah",
      username: "marmanrezashah",
      role: "Geotechnical Engineer & Researcher",
      bio: "Scientist | Geotechnical Engineer | Geo-Environmental Researcher | Academic Author | Faculty | Activist | Politician"
    },
    {
      name: "Achelle Santos",
      username: "achellesantos",
      role: "Freelance Writer & Children's Author",
      bio: "10+ years as a freelance writer/editor; aspiring to be a published children's book author."
    },
    {
      name: "Amber Faulk",
      username: "amberfaulk",
      role: "Mindfulness & Workplace Wellness Advisor",
      bio: "My background in mindfulness, corporate wellness, and employee benefits helps me translate how people feel into practical, business-aligned workplace solutions."
    },
    {
      name: "Paushali Das",
      username: "paushalidas",
      role: "Literary & Emotional Well-being Columnist",
      bio: "Paushali translates raw emotional experiences, trauma work, and creative writing practices into deeply connecting reflective essays."
    },
    {
      name: "Sadman Taqi",
      username: "sadmantaqi",
      role: "Mechanical Engineer & Culture Writer",
      bio: "A mechanical engineer deeply involved with art,culture,geopolitics, sports and many aspects of life. Searching tranquillity and serenity."
    },
    {
      name: "Taiba Mansuri",
      username: "taibamansuri",
      role: "Storytelling & Daily Chaos Observer",
      bio: "Writer of modern life, emotions, and the psychology behind our daily chaos. If you like soulful storytelling mixed with sharp insight, you're home."
    },
    {
      name: "Claudio Casella",
      username: "claudiocasella",
      role: "Literature & Music Writer",
      bio: "I'm static italian writer. Deeply love about literature, music and people."
    },
    {
      name: "Amoo Ridwan",
      username: "amooridwan",
      role: "Finance & Personal Discipline Columnist",
      bio: "I'm deeply interested in the overlap between technology, financial growth, and personal discipline. Most of my time is spent figuring out how to work smarter."
    },
    {
      name: "LOGESH T V | Genai Developer",
      username: "logeshtv",
      role: "AI Engineer & GenAI Explainer",
      bio: "AI Engineer & founder. Explaining GenAI so simply even your grandma gets it. Making tech funny because debugging hurts. Welcome to the chaos!"
    },
    {
      name: "Mim Maya",
      username: "mimmaya",
      role: "Tech, Relationships & Healing Essayist",
      bio: "I write about Tech, AI, Web-apps, Relationships, Motivation & Healing... where innovation meets what makes us human."
    },
    {
      name: "Dua Batool",
      username: "dbatool242",
      role: "Published Author & Zoology Researcher",
      bio: "Published Book Author | Zoology Student. Exploring society, human emotions, and untold realities through words that inspire reflection and meaningful dialogue."
    },
    {
      name: "Jmactavish",
      username: "jmactavish",
      role: "Independent Creative Columnist",
      bio: "Creative essayist and observer of human interactions, politics, and modern environments."
    },
    {
      name: "Vikra K Krishnasamy",
      username: "vikrakkrisnasamy",
      role: "Cultural & Analytical Thinker",
      bio: "Writing about human philosophy, technology intersections, and thoughts on growth."
    },
    {
      name: "LC Squared",
      username: "lc-squared",
      role: "Human Resilience & Motherhood Essayist",
      bio: "Writing about invisible exhaustion, reinvention, grief, motherhood, and the beautifully messy parts of being human."
    },
    {
      name: "Michael Koyfman",
      username: "michaelkoyfman",
      role: "Politics, Finance & AI Student",
      bio: "Hello! My name is Michael, a student who is incredibility interested in politics, finance, and artificial intelligence. Come check my blogs out!"
    }
  ]
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
  return res.status(200).json(FALLBACK_ABOUT);
}
