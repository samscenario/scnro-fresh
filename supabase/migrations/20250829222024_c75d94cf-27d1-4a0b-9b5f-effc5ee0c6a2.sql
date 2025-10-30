-- Add funding breakdown data to mainframe_content table
ALTER TABLE public.mainframe_content 
ADD COLUMN funding_breakdown jsonb DEFAULT '[
  {
    "area": "Stage, Sound & Setup",
    "cost": 10000,
    "impact": "Main stage, live visuals, performance tech"
  },
  {
    "area": "Youth Workforce Training", 
    "cost": 3000,
    "impact": "Safety, stewarding, event skills for 50+ volunteers"
  },
  {
    "area": "Workshops & Tents",
    "cost": 3500, 
    "impact": "Music tech, media, art with Pioneer, Maschine & others"
  },
  {
    "area": "Licensing, Security, First Aid",
    "cost": 2500,
    "impact": "Health & safety, safeguarding, site risk coverage"
  },
  {
    "area": "Creative Grants + Travel Access",
    "cost": 1000,
    "impact": "Small bursaries for young artists + travel help"
  },
  {
    "area": "Merch & Culture Drop Zone",
    "cost": 2000,
    "impact": "Pop-up for youth fashion + SCNRO creatives"
  }
]'::jsonb;