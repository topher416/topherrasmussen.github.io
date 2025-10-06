import React, { useState, useEffect, useRef } from 'react';
import { Shuffle, Eye, Star, Calendar, Skull, Moon, Zap, Flame, Ghost, Crown, Sparkles, Music, VolumeX } from 'lucide-react';
import * as Tone from 'tone';
  {
    title: "Hereditary",
    year: 2018,
    score: 95,
    type: "Film",
    blurb: "Ari Aster's family trauma horror builds occult dread through exceptional performances and disturbing imagery. Atmospheric terror that stays with you for days.",
    rarity: "epic"
  },
  {
    title: "The Wailing",
    year: 2016,
    score: 94,
    type: "Film",
    blurb: "Korean masterpiece blending possession, shamanism, and folk horror. 99% Rotten Tomatoes confirms this mystery keeps you guessing until its devastating finale.",
    rarity: "epic"
  },
  {
    title: "The Orphanage",
    year: 2007,
    score: 93,
    type: "Film",
    blurb: "Spanish Gothic ghost story about mother searching for missing son in former orphanage. Produced by Guillermo del Toro with emotional depth and genuine scares.",
    rarity: "rare"
  },
  {
    title: "Lake Mungo",
    year: 2008,
    score: 93,
    type: "Film",
    blurb: "Australian mockumentary about drowned girl creates genuinely unsettling atmosphere through found footage and family interviews. Slow-burn masterpiece.",
    rarity: "rare"
  },
  {
    title: "The Lighthouse",
    year: 2019,
    score: 92,
    type: "Film",
    blurb: "Eggers' black-and-white psychological horror with Pattinson and Dafoe descending into madness. Atmospheric isolation creates surreal nightmare on remote island.",
    rarity: "rare"
  },
  {
    title: "Kairo (Pulse)",
    year: 2001,
    score: 92,
    type: "Film",
    blurb: "Kiyoshi Kurosawa's existential J-horror about ghosts invading through internet. Creates profound dread through empty spaces and technological isolation.",
    rarity: "rare"
  },
  {
    title: "Get Out",
    year: 2017,
    score: 91,
    type: "Film",
    blurb: "Jordan Peele's social horror masterpiece combines psychological terror with sharp commentary. 98% Rotten Tomatoes confirms intelligent scares and brilliant execution.",
    rarity: "rare"
  },
  {
    title: "The Autopsy of Jane Doe",
    year: 2016,
    score: 91,
    type: "Film",
    blurb: "Single-location supernatural mystery in morgue. Father-son coroners uncover witchcraft secrets through exceptional atmospheric tension without gore reliance.",
    rarity: "rare"
  },
  {
    title: "A Tale of Two Sisters",
    year: 2003,
    score: 90,
    type: "Film",
    blurb: "Korean psychological ghost story with stunning cinematography. Family trauma meets supernatural horror through beautiful Gothic imagery and narrative complexity.",
    rarity: "uncommon"
  },
  {
    title: "Ringu",
    year: 1998,
    score: 90,
    type: "Film",
    blurb: "Original Japanese cursed videotape film that inspired The Ring. Superior atmosphere and urban legend dread without Hollywood jump scares.",
    rarity: "uncommon"
  },
  {
    title: "The Night House",
    year: 2020,
    score: 89,
    type: "Film",
    blurb: "Rebecca Hall's widow discovers husband's dark secrets in lakehouse. Sophisticated supernatural mystery with psychological depth and intelligent scares.",
    rarity: "uncommon"
  },
  {
    title: "His House",
    year: 2020,
    score: 89,
    type: "Film",
    blurb: "Refugee couple haunted in English home. Netflix supernatural horror using genre to explore trauma and guilt with cultural authenticity and genuine scares.",
    rarity: "uncommon"
  },
  {
    title: "Crimson Peak",
    year: 2015,
    score: 88,
    type: "Film",
    blurb: "Del Toro's Gothic romance with stunning production design. Lush Victorian ghost story emphasizes beauty and atmosphere over cheap scares.",
    rarity: "uncommon"
  },
  {
    title: "The Ritual",
    year: 2017,
    score: 88,
    type: "Film",
    blurb: "British hiking trip becomes Norse folk horror nightmare. Atmospheric forest isolation builds to Lovecraftian creature reveal with psychological trauma themes.",
    rarity: "uncommon"
  },
  {
    title: "Insidious",
    year: 2010,
    score: 87,
    type: "Film",
    blurb: "James Wan's astral projection horror with The Further realm. Creative supernatural rules and practical effects create memorable haunted house scares.",
    rarity: "uncommon"
  },
  {
    title: "Midsommar",
    year: 2019,
    score: 87,
    type: "Film",
    blurb: "Ari Aster's daylight folk horror in Swedish commune. Disturbing pagan rituals shot in bright sunshine create unique atmospheric dread.",
    rarity: "uncommon"
  },
  {
    title: "A Dark Song",
    year: 2016,
    score: 86,
    type: "Film",
    blurb: "Grieving mother performs months-long occult ritual. Slow-burn supernatural drama treats magic seriously with authentic ceremonial atmosphere.",
    rarity: "common"
  },
  {
    title: "The Blackcoat's Daughter",
    year: 2015,
    score: 86,
    type: "Film",
    blurb: "Atmospheric boarding school possession horror from Oz Perkins. Non-linear storytelling and minimal dialogue create unease through isolation.",
    rarity: "common"
  },
  {
    title: "Ghost Stories",
    year: 2017,
    score: 85,
    type: "Film",
    blurb: "British anthology investigating three paranormal cases. Skeptic professor confronts genuine supernatural evidence in clever narrative framework.",
    rarity: "common"
  },
  {
    title: "Noroi: The Curse",
    year: 2005,
    score: 85,
    type: "Film",
    blurb: "Japanese found footage documentary style about paranormal investigator. Complex mythology and authentic presentation create deeply unsettling experience.",
    rarity: "common"
  },
  {
    title: "Personal Shopper",
    year: 2016,
    blurb: "Kristen Stewart communicates with dead brother while working in Paris fashion. Art-house ghost story blends existential dread with supernatural mystery.",
    score: 84,
    type: "Film",
    rarity: "common"
  },
  {
    title: "Relic",
    year: 2020,
    score: 84,
    type: "Film",
    blurb: "Dementia horror metaphor about grandmother's declining mind. Australian supernatural drama creates genuine emotional terror through family deterioration.",
    rarity: "common"
  },
  {
    title: "The Lodge",
    year: 2019,
    score: 84,
    type: "Film",
    blurb: "Isolated cabin psychological horror with religious trauma themes. Slow-burn winter atmosphere builds paranoia through ambiguous supernatural elements.",
    rarity: "common"
  },
  {
    title: "The Empty Man",
    year: 2020,
    score: 83,
    type: "Film",
    blurb: "Underrated cosmic horror about urban legend investigation. Ambitious supernatural mystery expands into existential territory with Lovecraftian overtones.",
    rarity: "common"
  },
  {
    title: "Ju-On: The Grudge",
    year: 2002,
    score: 83,
    type: "Film",
    blurb: "Original Japanese curse film with non-linear structure. Takashi Shimizu creates atmospheric dread through iconic imagery and sound design.",
    rarity: "common"
  },
  {
    title: "Us",
    year: 2019,
    score: 83,
    type: "Film",
    blurb: "Jordan Peele's doppelganger invasion horror. Lupita Nyong'o's dual performance anchors allegorical nightmare with striking imagery and social commentary.",
    rarity: "common"
  },
  {
    title: "The Invitation",
    year: 2015,
    score: 82,
    type: "Film",
    blurb: "Dinner party psychological thriller builds paranoia through grief and cult suspicion. Slow-burn tension in single location creates unbearable unease.",
    rarity: "common"
  },
  {
    title: "Dark Water",
    year: 2002,
    score: 82,
    type: "Film",
    blurb: "Japanese apartment ghost story emphasizing emotional horror over scares. Atmospheric dread through water imagery and maternal sacrifice themes.",
    rarity: "common"
  },
  {
    title: "Mama",
    year: 2013,
    score: 81,
    type: "Film",
    blurb: "Guillermo del Toro produced ghost story about feral children raised by entity. Jessica Chastain anchors atmospheric horror with strong visual design.",
    rarity: "common"
  },
  {
    title: "The Skeleton Key",
    year: 2005,
    score: 81,
    type: "Film",
    blurb: "Louisiana hoodoo mystery in plantation house. Kate Hudson investigates voodoo secrets with atmospheric Southern Gothic setting and clever twist.",
    rarity: "common"
  },
  {
    title: "In the Mouth of Madness",
    year: 1994,
    score: 81,
    type: "Film",
    blurb: "John Carpenter's Lovecraftian meta-horror about reality-bending horror novels. Sam Neill investigates author whose fiction becomes reality.",
    rarity: "common"
  },
  {
    title: "The Blair Witch Project",
    year: 1999,
    score: 80,
    type: "Film",
    blurb: "Revolutionary found footage that created genre template. Three filmmakers lost in woods build psychological terror through minimalist approach.",
    rarity: "common"
  },
  {
    title: "Candyman",
    year: 1992,
    score: 80,
    type: "Film",
    blurb: "Clive Barker adaptation explores urban legends and racial trauma. Tony Todd's iconic hook-handed ghost haunts Chicago housing projects.",
    rarity: "common"
  },
  {
    title: "Candyman",
    year: 2021,
    score: 80,
    type: "Film",
    blurb: "Jordan Peele produced spiritual sequel updating mythology. Nia DaCosta's atmospheric horror examines gentrification and artistic trauma through legend.",
    rarity: "common"
  },
  {
    title: "The Ninth Gate",
    year: 1999,
    score: 79,
    type: "Film",
    blurb: "Johnny Depp authenticates occult book that may summon devil. Roman Polanski's atmospheric mystery builds supernatural dread through European settings.",
    rarity: "common"
  },
  {
    title: "Angel Heart",
    year: 1987,
    score: 79,
    type: "Film",
    blurb: "Mickey Rourke's detective investigates voodoo mystery in New Orleans. Atmospheric noir horror builds to supernatural revelation about identity and deals.",
    rarity: "common"
  },
  {
    title: "Jacob's Ladder",
    year: 1990,
    score: 79,
    type: "Film",
    blurb: "Vietnam vet experiences reality-bending horror visions. Psychological thriller with disturbing imagery creates ambiguity between madness and supernatural.",
    rarity: "common"
  },
  {
    title: "The Gift",
    year: 2000,
    score: 78,
    type: "Film",
    blurb: "Cate Blanchett's psychic investigates murder in Southern Gothic setting. Atmospheric supernatural mystery with strong ensemble cast.",
    rarity: "common"
  },
  {
    title: "Shutter",
    year: 2004,
    score: 78,
    type: "Film",
    blurb: "Thai ghost photography horror with genuinely scary imagery. Photographer haunted by spirit captured in photos builds to emotional revelation.",
    rarity: "common"
  },
  {
    title: "The Eye",
    year: 2002,
    score: 77,
    type: "Film",
    blurb: "Hong Kong supernatural horror about blind woman receiving cornea transplant. Sees ghosts with new eyes in atmospheric Asian horror tradition.",
    rarity: "common"
  },
  {
    title: "REC",
    year: 2007,
    score: 77,
    type: "Film",
    blurb: "Spanish found footage in quarantined apartment building. Reporter trapped with infected residents creates claustrophobic supernatural infection horror.",
    rarity: "common"
  },
  {
    title: "The Mist",
    year: 2007,
    score: 76,
    type: "Film",
    blurb: "Stephen King adaptation about creatures in fog besieging supermarket. Atmospheric creature horror with devastating ending and religious hysteria themes.",
    rarity: "common"
  },
  {
    title: "Apostle",
    year: 2018,
    score: 76,
    type: "Film",
    blurb: "Folk horror cult on remote island holds dark secrets. Dan Stevens infiltrates religious commune in atmospheric period horror with pagan undertones.",
    rarity: "common"
  },
  {
    title: "The Endless",
    year: 2017,
    score: 75,
    type: "Film",
    blurb: "Brothers return to cult discovering time loop cosmic horror. Low-budget indie creates ambitious Lovecraftian mystery with intelligent storytelling.",
    rarity: "common"
  },
  {
    title: "A Ghost Story",
    year: 2017,
    score: 75,
    type: "Film",
    blurb: "Casey Affleck's ghost watches time pass in former home. Meditative art-house horror explores grief and existence through minimalist supernatural lens.",
    rarity: "common"
  },
  {
    title: "I Am the Pretty Thing That Lives in the House",
    year: 2016,
    score: 74,
    type: "Film",
    blurb: "Slow-burn Netflix ghost story about nurse in haunted house. Meditative atmospheric horror emphasizes mood and dread over conventional scares.",
    rarity: "common"
  },
  {
    title: "The Little Stranger",
    year: 2018,
    score: 73,
    type: "Film",
    blurb: "British Gothic ghost story in decaying manor. Domhnall Gleeson investigates supernatural disturbances with ambiguous psychological horror.",
    rarity: "common"
  },
  {
    title: "Kill List",
    year: 2011,
    score: 73,
    type: "Film",
    blurb: "British hitman film transforms into occult folk horror. Genre-bending nightmare builds from crime thriller to disturbing cult ritual.",
    rarity: "common"
  },
  {
    title: "The Haunting",
    year: 1963,
    score: 98,
    type: "Film", 
    blurb: "Robert Wise's revolutionary sound design transforms a haunted house into pure psychological terror without showing a single ghost. The gold standard of supernatural cinema.",
    rarity: "legendary"
  },
  {
    title: "The Sixth Sense",
    year: 1999,
    score: 98,
    type: "Film",
    blurb: "M. Night Shyamalan's modern supernatural masterpiece proves elevated horror can achieve mainstream acclaim while delivering genuine scares through emotional storytelling.",
    rarity: "legendary"
  },
  {
    title: "The Others",
    year: 2001,
    score: 97,
    type: "Film",
    blurb: "Nicole Kidman anchors this candlelit Gothic mansion ghost story that builds dread through isolation and suggestion. Elegance personified in supernatural terror.",
    rarity: "epic"
  },
  {
    title: "The Witch",
    year: 2015,
    score: 97,
    type: "Film",
    blurb: "Robert Eggers' period witchcraft horror shot with natural light and historical dialogue. Museum-level authenticity meets terrifying supernatural folklore.",
    rarity: "epic"
  },
  {
    title: "Rosemary's Baby",
    year: 1968,
    score: 94,
    type: "Film",
    blurb: "Paranoid perfection transforms urban pregnancy into occult nightmare. Polanski builds dread through realistic NYC setting and naturalistic performances.",
    rarity: "epic"
  },
  {
    title: "Nosferatu",
    year: 2024,
    score: 94,
    type: "Film",
    blurb: "Eggers' Gothic vampire remake with meticulous period craftsmanship. Bill Skarsgård and exceptional production design create atmospheric masterpiece.",
    rarity: "epic"
  },
  {
    title: "Don't Look Now",
    year: 1973,
    score: 93,
    type: "Film",
    blurb: "Grief meets supernatural mystery in Venice's atmospheric canals. Revolutionary editing and stunning cinematography create psychological unease that lingers.",
    rarity: "rare"
  },
  {
    title: "The Ring",
    year: 2002,
    score: 93,
    type: "Film",
    blurb: "Atmospheric masterpiece with cursed videotape concept. Creates genuine dread through sound design and iconic imagery rather than cheap scares.",
    rarity: "rare"
  },
  {
    title: "The Conjuring",
    year: 2013,
    score: 92,
    type: "Film",
    blurb: "Modern haunted house horror proving classical techniques work. Expert pacing creates supernatural terror through practical effects and atmospheric cinematography.",
    rarity: "rare"
  },
  {
    title: "The Babadook",
    year: 2014,
    score: 92,
    type: "Film",
    blurb: "Grief horror using supernatural metaphor with exceptional sound design. Psychological sophistication without the devastating trauma of similar films.",
    rarity: "rare"
  },
  {
    title: "Oddity",
    year: 2024,
    score: 92,
    type: "Film",
    blurb: "Blind psychic investigates sister's murder using cursed objects. 96% Rotten Tomatoes confirms elegant tension building without gore.",
    rarity: "rare"
  },
  {
    title: "It Follows",
    year: 2014,
    score: 91,
    type: "Film",
    blurb: "Innovative supernatural stalker with dream-like atmosphere. Synth score and wide-lens cinematography create constant unease and reward careful observation.",
    rarity: "rare"
  },
  {
    title: "Paranormal Activity 3",
    year: 2011,
    score: 91,
    type: "Film",
    blurb: "Superior found footage with innovative oscillating fan camera. Proves the format works when crafted with intelligence and genuine supernatural escalation.",
    rarity: "rare"
  },
  {
    title: "Late Night with the Devil",
    year: 2024,
    score: 91,
    type: "Film",
    blurb: "Found footage possession horror set during 1977 talk show Halloween special. Smart satire with atmospheric tension and excellent practical effects.",
    rarity: "rare"
  },
  {
    title: "The Changeling",
    year: 1980,
    score: 90,
    type: "Film",
    blurb: "George C. Scott elevates this mansion ghost story through powerhouse performance. Combines supernatural scares with emotional depth and atmospheric elegance.",
    rarity: "uncommon"
  },
  {
    title: "Longlegs",
    year: 2024,
    score: 90,
    type: "Film",
    blurb: "FBI procedural with occult elements starring Maika Monroe and Nicolas Cage. Masterful atmosphere building creates supernatural mystery without gratuitous violence.",
    rarity: "uncommon"
  },
  {
    title: "Black Sunday",
    year: 1960,
    score: 89,
    type: "Film",
    blurb: "Bava's atmospheric Gothic masterpiece combines witchcraft with stunning black-and-white cinematography. Barbara Steele's iconic performance anchors this visual feast.",
    rarity: "uncommon"
  },
  {
    title: "The Exorcist",
    year: 1973,
    score: 89,
    type: "Film",
    blurb: "Elevated supernatural horror exploring faith versus doubt. Exceptional production values and genuine scares make this accessible elevated horror.",
    rarity: "uncommon"
  },
  {
    title: "Talk to Me",
    year: 2023,
    score: 89,
    type: "Film",
    blurb: "Australian supernatural horror about teens conjuring spirits with embalmed hand. 94% Rotten Tomatoes confirms smart supernatural rules and expert tension.",
    rarity: "uncommon"
  },
  {
    title: "Suspiria",
    year: 1977,
    score: 88,
    type: "Film",
    blurb: "Argento transforms dance academy into witches' coven through revolutionary color cinematography and hypnotic Goblin score. Surreal atmosphere rewards multiple viewings.",
    rarity: "uncommon"
  },
  {
    title: "Under the Shadow",
    year: 2016,
    score: 88,
    type: "Film",
    blurb: "Persian mythology meets wartime terror in Tehran. Incredible supernatural tension through cultural authenticity and masterful sound design.",
    rarity: "uncommon"
  },
  {
    title: "Saint Maud",
    year: 2019,
    score: 87,
    type: "Film",
    blurb: "Religious obsession becomes supernatural horror through stunning cinematography and Morfydd Clark's committed performance. Artistic sophistication in body horror.",
    rarity: "uncommon"
  },
  {
    title: "Oculus",
    year: 2013,
    score: 87,
    type: "Film",
    blurb: "Ingenious supernatural mirror concept uses surveillance elements effectively. Brilliant editing blurs reality and memory while building genuine supernatural dread.",
    rarity: "uncommon"
  },
  {
    title: "The Love Witch",
    year: 2016,
    score: 87,
    type: "Film",
    blurb: "Modern witch story with stunning 35mm Technicolor aesthetics. Thoughtful witchcraft themes through gorgeous handmade production design and costumes.",
    rarity: "uncommon"
  },
  {
    title: "What Lies Beneath",
    year: 2000,
    score: 86,
    type: "Film",
    blurb: "Haunted Vermont lakehouse mystery with Harrison Ford and Michelle Pfeiffer. Part of late-90s ghost story renaissance emphasizing atmosphere over gore.",
    rarity: "common"
  },
  {
    title: "The Devil's Backbone",
    year: 2001,
    score: 86,
    type: "Film",
    blurb: "Del Toro's Spanish Civil War orphanage ghost story with signature visual poetry. Combines political allegory with supernatural horror through beautiful cinematography.",
    rarity: "common"
  },
  {
    title: "Stir of Echoes",
    year: 1999,
    score: 85,
    type: "Film",
    blurb: "Kevin Bacon anchors blue-collar psychic awakening story. Grounded supernatural thriller with neighborhood mystery elements that reward attention to detail.",
    rarity: "common"
  },
  {
    title: "Session 9",
    year: 2001,
    score: 85,
    type: "Film",
    blurb: "Abandoned asylum creates genuine dread through atmosphere and found recordings. Builds psychological terror through isolation without relying on gore.",
    rarity: "common"
  },
  {
    title: "Thelma",
    year: 2017,
    score: 85,
    type: "Film",
    blurb: "Norwegian coming-of-age supernatural story about young woman discovering powers. Beautiful cinematography with less traumatic family dynamics.",
    rarity: "common"
  },
  {
    title: "Sinister",
    year: 2012,
    score: 84,
    type: "Film",
    blurb: "Combines found footage elements with traditional narrative. Super 8 film aesthetic creates genuinely unsettling murder mystery with supernatural stalking.",
    rarity: "common"
  },
  {
    title: "1408",
    year: 2007,
    score: 84,
    type: "Film",
    blurb: "John Cusack's compelling single-location performance in Stephen King adaptation. Psychological room-based horror that bends reality without excessive violence.",
    rarity: "common"
  },
  {
    title: "The Frighteners",
    year: 1996,
    score: 83,
    type: "Film",
    blurb: "Peter Jackson balances humor with genuine horror in Michael J. Fox supernatural investigator story. High production values and innovative special effects.",
    rarity: "common"
  },
  {
    title: "Dead Silence",
    year: 2007,
    score: 83,
    type: "Film",
    blurb: "Early James Wan ventriloquist dummy ghost story with atmospheric small-town setting. Creepy doll imagery handled with sophisticated restraint.",
    rarity: "common"
  },
  {
    title: "The Mothman Prophecies",
    year: 2002,
    score: 82,
    type: "Film",
    blurb: "Richard Gere investigates supernatural harbinger mystery based on 'true' events. Eerie phone calls and premonitions create unique atmospheric dread.",
    rarity: "common"
  },
  {
    title: "Signs",
    year: 2002,
    score: 82,
    type: "Film",
    blurb: "Shyamalan's alien invasion builds tension through suggestion and masterful sound design. Family-friendly scares reward careful observation of details.",
    rarity: "common"
  },
  {
    title: "Drag Me to Hell",
    year: 2009,
    score: 81,
    type: "Film",
    blurb: "Sam Raimi's return elevates B-movie gypsy curse concept through sophisticated execution. PG-13 supernatural scares avoid excessive gore.",
    rarity: "common"
  },
  {
    title: "The Last Exorcism",
    year: 2010,
    score: 80,
    type: "Film",
    blurb: "Intelligent found footage with strong character development in evangelical minister story. Builds to genuinely unsettling supernatural climax.",
    rarity: "common"
  },
  {
    title: "The Haunting of Hill House",
    year: 2018,
    score: 96,
    type: "Series",
    blurb: "Flanagan's ten-episode masterpiece Stephen King called 'close to genius.' Sophisticated psychological horror with hidden ghosts and emotional depth.",
    rarity: "legendary"
  },
  {
    title: "Midnight Mass",
    year: 2021,
    score: 94,
    type: "Series",
    blurb: "Seven-episode limited series examining faith and community on isolated island. Builds supernatural tension through outstanding monologues and atmospheric setting.",
    rarity: "epic"
  },
  {
    title: "The Terror",
    year: 2018,
    score: 94,
    type: "Series",
    blurb: "Arctic expedition supernatural creature story with exceptional production values. 94% Rotten Tomatoes confirms historical supernatural horror excellence.",
    rarity: "epic"
  },
  {
    title: "Dark",
    year: 2017,
    score: 93,
    type: "Series",
    blurb: "German time-travel mystery with supernatural elements spanning generations. Complex narrative creates existential dread through interconnected family horror.",
    rarity: "rare"
  },
  {
    title: "The Haunting of Bly Manor",
    year: 2020,
    score: 92,
    type: "Series",
    blurb: "Nine-episode gothic romance based on Henry James. Beautiful cinematography and LGBTQ+ representation create emotional supernatural storytelling.",
    rarity: "rare"
  },
  {
    title: "Channel Zero",
    year: 2016,
    score: 92,
    type: "Series",
    blurb: "Four six-episode seasons adapting internet creepypasta. Critics praised as superior to American Horror Story with atmospheric psychological horror.",
    rarity: "rare"
  },
  {
    title: "Yellowjackets",
    year: 2021,
    score: 91,
    type: "Series",
    blurb: "Survival horror with possible supernatural elements after plane crash. Dual timelines explore trauma and mysterious wilderness events with stellar cast.",
    rarity: "rare"
  },
  {
    title: "The Fall of the House of Usher",
    year: 2023,
    score: 90,
    type: "Series",
    blurb: "Eight-episode Edgar Allan Poe adaptation with all-star cast. Stylish supernatural consequences for corrupt family empire through Poe-inspired deaths.",
    rarity: "uncommon"
  },
  {
    title: "Cabinet of Curiosities",
    year: 2022,
    score: 90,
    type: "Series",
    blurb: "Eight-episode anthology curated by del Toro featuring master filmmakers. Highest-rated horror anthology on Rotten Tomatoes with sophisticated storytelling.",
    rarity: "uncommon"
  },
  {
    title: "Evil",
    year: 2019,
    score: 89,
    type: "Series",
    blurb: "Psychologist and priest investigate supernatural phenomena for Catholic church. Smart procedural balances skepticism with genuine demonic scares.",
    rarity: "uncommon"
  },
  {
    title: "From",
    year: 2022,
    score: 88,
    type: "Series",
    blurb: "Town residents trapped by mysterious force and nightly creatures. Lost-style mystery with supernatural horror and strong character development.",
    rarity: "uncommon"
  },
  {
    title: "Marianne",
    year: 2019,
    score: 87,
    type: "Series",
    blurb: "French horror about author whose fictional witch becomes real. Netflix series praised for genuinely scary atmosphere and creative supernatural horror.",
    rarity: "uncommon"
  },
  {
    title: "1899",
    year: 2022,
    score: 86,
    type: "Series",
    blurb: "Dark creators' mystery on immigrant ship with supernatural elements. Stunning period production design creates multilingual atmospheric puzzle.",
    rarity: "common"
  },
  {
    title: "Archive 81",
    year: 2022,
    score: 85,
    type: "Series",
    blurb: "Archivist restores tapes revealing 1990s cult mystery. Found footage series builds supernatural dread through layered timeline investigation.",
    rarity: "common"
  },
  {
    title: "The Outsider",
    year: 2020,
    score: 85,
    type: "Series",
    blurb: "Stephen King adaptation about supernatural entity framing innocents. Detective investigation becomes increasingly supernatural with atmospheric dread.",
    rarity: "common"
  },
  {
    title: "Servant",
    year: 2019,
    score: 84,
    type: "Series",
    blurb: "M. Night Shyamalan produced mystery about mysterious nanny and replacement doll. Claustrophobic Philadelphia brownstone setting creates unsettling atmosphere.",
    rarity: "common"
  },
  {
    title: "Brand New Cherry Flavor",
    year: 2021,
    score: 83,
    type: "Series",
    blurb: "Filmmaker seeks supernatural revenge in 1990s LA. Surreal Netflix series combines witchcraft with Hollywood satire and body horror.",
    rarity: "common"
  },
  {
    title: "Lovecraft Country",
    year: 2020,
    score: 82,
    type: "Series",
    blurb: "1950s Jim Crow America meets Lovecraftian horror. Jordan Peele produced series exploring racism through supernatural lens with strong performances.",
    rarity: "common"
  },
  {
    title: "Castle Rock",
    year: 2018,
    score: 81,
    type: "Series",
    blurb: "Anthology series set in Stephen King universe. Two seasons explore interconnected King mythology with psychological supernatural horror.",
    rarity: "common"
  },
  {
    title: "Chapelwaite",
    year: 2021,
    score: 80,
    type: "Series",
    blurb: "Stephen King prequel to Salem's Lot with Adrien Brody. Gothic family curse story in 1850s Maine with vampire mythology origins.",
    rarity: "common"
  },
  {
    title: "Penny Dreadful",
    year: 2014,
    score: 80,
    type: "Series",
    blurb: "Victorian literary characters unite against supernatural threats. Eva Green's performance anchors Gothic horror with exceptional production design.",
    rarity: "common"
  },
  {
    title: "The Midnight Club",
    year: 2022,
    score: 79,
    type: "Series",
    blurb: "Terminal teens tell horror stories in hospice. Mike Flanagan's young adult series explores death through nested supernatural tales.",
    rarity: "common"
  },
  {
    title: "Requiem",
    year: 2018,
    score: 78,
    type: "Series",
    blurb: "Cellist investigates mother's suicide discovering childhood mystery. British supernatural thriller with atmospheric Welsh village setting.",
    rarity: "common"
  },
  {
    title: "Them",
    year: 2021,
    score: 77,
    type: "Series",
    blurb: "Black family faces supernatural and human terror in 1950s white neighborhood. Anthology exploring racism through horror lens with unsettling atmosphere.",
    rarity: "common"
  },
  {
    title: "Chambers",
    year: 2019,
    score: 76,
    type: "Series",
    blurb: "Heart transplant recipient experiences deceased donor's memories. Netflix supernatural mystery explores identity and possession themes.",
    rarity: "common"
  },
  {
    title: "The Third Day",
    year: 2020,
    score: 75,
    type: "Series",
    blurb: "Visitors discover mysterious island with disturbing rituals. Folk horror limited series with Jude Law creates atmospheric cult dread.",
    rarity: "common"
  }
];

const allCards = [...horrorMovies];

const HorrorMovieTarot = () => {
  // Fisher-Yates shuffle algorithm for proper randomization
  const fisherYatesShuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledDeck, setShuffledDeck] = useState(() => fisherYatesShuffle(allCards));
  const [drawnCard, setDrawnCard] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [deckPosition, setDeckPosition] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [particles, setParticles] = useState([]);
  const synthRef = useRef(null);
  const reverbRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize audio
  useEffect(() => {
    const initAudio = async () => {
      if (audioEnabled && !synthRef.current) {
        // Create echo effect chain: Synth -> Delay -> Reverb -> Output
        reverbRef.current = new Tone.Reverb(6).toDestination(); // Longer reverb for echo
        const delayRef = new Tone.FeedbackDelay("8n", 0.4).connect(reverbRef.current); // Echo delay
        
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: "sawtooth" },
          envelope: { attack: 0.8, decay: 0.4, sustain: 0.6, release: 3 }, // Slower attack for organ feel
          filter: { frequency: 150, rolloff: -24 }
        }).connect(delayRef);
        
        // Exclusively minor chord progressions - darker and more haunting
        const chords = [
          ["D3", "F3", "A3"],     // D minor
          ["A2", "C3", "E3"],     // A minor  
          ["G2", "Bb2", "D3"],    // G minor
          ["F2", "Ab2", "C3"],    // F minor
          ["Bb2", "Db3", "F3"],   // Bb minor
          ["C3", "Eb3", "G3"],    // C minor
          ["E2", "G2", "B2"],     // E minor
          ["D2", "F2", "A2"]      // D minor (octave down)
        ];
        
        const playChords = () => {
          if (!isPlaying) return;
          chords.forEach((chord, i) => {
            setTimeout(() => {
              if (synthRef.current && isPlaying) {
                synthRef.current.triggerAttackRelease(chord, "2n");
              }
            }, i * 4000); // Slower progression for more haunting effect
          });
          setTimeout(playChords, chords.length * 4000);
        };
        
        if (isPlaying) {
          playChords();
        }
      }
    };

    if (audioEnabled) {
      Tone.start().then(initAudio);
    }
  }, [audioEnabled, isPlaying]);

  // Particle system - mobile optimized
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev.filter(p => p.life > 0)];
        
        // Reduce particles on mobile
        const particleCount = isMobile ? 1 : 3;
        
        // Add new particles
        for (let i = 0; i < particleCount; i++) {
          // Keep particles away from center content area on mobile
          const leftSide = Math.random() < 0.5;
          const x = isMobile 
            ? (leftSide ? Math.random() * window.innerWidth * 0.15 : window.innerWidth * 0.85 + Math.random() * window.innerWidth * 0.15)
            : Math.random() * window.innerWidth;
            
          newParticles.push({
            id: Math.random(),
            x: x,
            y: window.innerHeight + 10,
            vx: (Math.random() - 0.5) * (isMobile ? 1 : 2),
            vy: -Math.random() * 3 - 1,
            life: isMobile ? 50 : 100,
            maxLife: isMobile ? 50 : 100,
            symbol: ['✦', '✧', '⟢', '◊', '✤'][Math.floor(Math.random() * 5)]
          });
        }
        
        // Update existing particles
        return newParticles.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 1
        }));
      });
    }, isMobile ? 200 : 100);

    return () => clearInterval(interval);
  }, []);

  const toggleAudio = async () => {
    try {
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }
      
      if (!audioEnabled) {
        setAudioEnabled(true);
        setIsPlaying(true);
      } else {
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.log('Audio not supported on this device');
    }
  };

  const shuffleDeck = () => {
    setIsShuffling(true);
    setDrawnCard(null);
    
    // Animate shuffle - twice as long
    setTimeout(() => {
      const newDeck = fisherYatesShuffle(allCards);
      setShuffledDeck(newDeck);
      setDeckPosition(0);
      setIsShuffling(false);
    }, 3000);
  };

  const drawCard = () => {
    if (deckPosition < shuffledDeck.length) {
      setDrawnCard(shuffledDeck[deckPosition]);
      setDeckPosition(deckPosition + 1);
    }
  };

  const resetDeck = () => {
    setDrawnCard(null);
    setDeckPosition(0);
  };

  const getRarityStyle = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return {
          border: 'border-yellow-400',
          bg: 'from-yellow-900/30 to-orange-900/30',
          glow: 'shadow-yellow-400/50',
          icon: Crown,
          text: 'text-yellow-300'
        };
      case 'epic':
        return {
          border: 'border-purple-400',
          bg: 'from-purple-900/30 to-pink-900/30',
          glow: 'shadow-purple-400/50',
          icon: Star,
          text: 'text-purple-300'
        };
      case 'rare':
        return {
          border: 'border-blue-400',
          bg: 'from-blue-900/30 to-cyan-900/30',
          glow: 'shadow-blue-400/50',
          icon: Sparkles,
          text: 'text-blue-300'
        };
      case 'uncommon':
        return {
          border: 'border-green-400',
          bg: 'from-green-900/30 to-emerald-900/30',
          glow: 'shadow-green-400/50',
          icon: Flame,
          text: 'text-green-300'
        };
      default:
        return {
          border: 'border-gray-400',
          bg: 'from-gray-800/30 to-gray-900/30',
          glow: 'shadow-gray-400/30',
          icon: Ghost,
          text: 'text-gray-300'
        };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-yellow-400';
    if (score >= 90) return 'text-purple-400';
    if (score >= 85) return 'text-blue-400';
    if (score >= 80) return 'text-cyan-400';
    return 'text-teal-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 via-red-900 to-black p-6 overflow-hidden relative">
      {/* Animated background stripes */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent transform skew-y-12 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-red-500 to-transparent transform -skew-y-12 animate-pulse delay-1000"></div>
      </div>

      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none text-purple-400 animate-pulse"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.life / particle.maxLife,
            fontSize: '20px',
            zIndex: 1
          }}
        >
          {particle.symbol}
        </div>
      ))}

      {/* Screen distortion overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-green-500 to-transparent animate-pulse" 
             style={{ animationDuration: '0.1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with holographic effect - mobile optimized */}
        <div className="text-center mb-8 md:mb-12 relative px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 blur-3xl opacity-20 animate-pulse"></div>
          <h1 className="text-3xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 tracking-wide animate-pulse relative">
            ⦿ MYSTICAL HORROR TAROT ⦿
          </h1>
          <div className="flex justify-center items-center gap-3 md:gap-4 mb-4">
            <Skull className="w-6 h-6 md:w-8 md:h-8 text-red-400 animate-bounce" />
            <Moon className="w-5 h-5 md:w-6 md:h-6 text-purple-400 animate-spin" style={{animationDuration: '3s'}} />
            <Zap className="w-6 h-6 md:w-7 md:h-7 text-yellow-400 animate-pulse" />
            <Ghost className="w-5 h-5 md:w-6 md:h-6 text-blue-400 animate-bounce delay-500" />
            <Flame className="w-6 h-6 md:w-7 md:h-7 text-orange-400 animate-pulse delay-1000" />
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 mx-4 md:mx-0">
            <p className="text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2 animate-pulse">
              ⟢ Consult the eldritch cards to reveal your next supernatural viewing experience ⟢
            </p>
            <p className="text-purple-400 font-mono text-base md:text-lg">
              ◊ {allCards.length - deckPosition} cards remain in the ethereal deck ◊
            </p>
          </div>
        </div>

        {/* Audio control */}
        <div className="flex justify-center mb-8">
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 border border-purple-500 rounded-lg text-purple-300 hover:text-purple-200 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            {isPlaying ? <VolumeX className="w-5 h-5" /> : <Music className="w-5 h-5" />}
            {isPlaying ? 'Silence the Organ' : 'Summon Dark Organ'}
          </button>
        </div>

        {/* Controls with enhanced effects - mobile optimized */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12 px-4">
          <button
            onClick={shuffleDeck}
            disabled={isShuffling}
            className={`
              flex items-center justify-center gap-2 px-4 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-500 relative overflow-hidden min-h-[50px]
              ${isShuffling 
                ? 'bg-gradient-to-r from-purple-900 to-red-900 text-purple-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-700 to-red-700 hover:from-purple-600 hover:to-red-600 text-white hover:scale-105 shadow-2xl hover:shadow-purple-500/50 border-2 border-purple-400'
              }
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Shuffle className={`w-5 h-5 md:w-6 md:h-6 ${isShuffling ? 'animate-spin' : 'animate-pulse'}`} />
            <span className="whitespace-nowrap">{isShuffling ? '⟢ SHUFFLING ⟢' : '⦿ SHUFFLE DECK ⦿'}</span>
          </button>

          <button
            onClick={drawCard}
            disabled={deckPosition >= shuffledDeck.length || isShuffling}
            className={`
              flex items-center justify-center gap-2 px-4 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-500 relative overflow-hidden min-h-[50px]
              ${deckPosition >= shuffledDeck.length || isShuffling
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-500 cursor-not-allowed border-2 border-gray-600'
                : 'bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white hover:scale-105 shadow-2xl hover:shadow-indigo-500/50 border-2 border-indigo-400'
              }
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
            <Eye className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
            <span className="whitespace-nowrap">◊ DRAW CARD ◊</span>
          </button>

          <button
            onClick={resetDeck}
            className="flex items-center justify-center gap-2 px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-100 rounded-xl font-bold text-sm md:text-lg transition-all duration-500 hover:scale-105 shadow-2xl border-2 border-gray-500 relative overflow-hidden min-h-[50px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
            <Moon className="w-5 h-5 md:w-6 md:h-6 animate-spin" style={{animationDuration: '2s'}} />
            <span className="whitespace-nowrap">⟢ RESET ⟢</span>
          </button>
        </div>

        {/* Enhanced deck visualization */}
        {!drawnCard && (
          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* Mystical aura around deck */}
              <div className="absolute -inset-16 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              
              {/* Card Back Stack */}
              {[...Array(Math.min(7, allCards.length - deckPosition))].map((_, i) => (
                <div
                  key={i}
                  className={`
                    absolute w-40 h-60 bg-gradient-to-br from-purple-900 via-red-900 to-black 
                    rounded-2xl border-4 border-purple-400 shadow-2xl
                    flex flex-col items-center justify-center
                    transition-all duration-700
                    ${isShuffling ? 'animate-spin' : 'hover:scale-105'}
                  `}
                  style={{
                    transform: `translate(${i * 3}px, ${i * -3}px) rotate(${(i - 3) * 3}deg)`,
                    zIndex: 7 - i,
                    boxShadow: `0 0 ${20 + i * 5}px rgba(147, 51, 234, ${0.3 + i * 0.1})`
                  }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3 text-purple-300 animate-pulse">⦿</div>
                    <div className="text-sm font-serif font-bold text-purple-200 mb-1">HORROR</div>
                    <div className="text-sm font-serif font-bold text-purple-200 mb-2">TAROT</div>
                    <div className="flex gap-1 justify-center text-purple-400">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-ping delay-200"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping delay-400"></div>
                    </div>
                    <div className="text-xs font-mono text-purple-400 mt-2">◊ ⟢ ✦ ⟢ ◊</div>
                  </div>
                </div>
              ))}
              
              {allCards.length - deckPosition === 0 && (
                <div className="w-40 h-60 border-4 border-dashed border-purple-500 rounded-2xl flex items-center justify-center text-purple-400 bg-gradient-to-br from-gray-900/50 to-purple-900/20">
                  <div className="text-center">
                    <Skull className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                    <div className="text-sm font-serif">The Void</div>
                    <div className="text-xs">Awaits</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced drawn card - mobile optimized */}
        {drawnCard && (
          <div className="flex justify-center mb-8 px-4">
            <div className={`
              bg-gradient-to-br ${getRarityStyle(drawnCard.rarity).bg} 
              p-6 md:p-10 rounded-3xl border-4 ${getRarityStyle(drawnCard.rarity).border} 
              shadow-2xl ${getRarityStyle(drawnCard.rarity).glow} 
              max-w-3xl w-full animate-fade-in-scale relative overflow-hidden
            `}>
              {/* Holographic overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
              
              {/* Rarity indicator */}
              <div className="absolute top-4 right-4">
                {React.createElement(getRarityStyle(drawnCard.rarity).icon, {
                  className: `w-6 h-6 md:w-8 md:h-8 ${getRarityStyle(drawnCard.rarity).text} animate-pulse`
                })}
              </div>
              
              <div className="text-center mb-6 md:mb-8 relative">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-4 md:mb-6">
                  {typeof drawnCard.score === 'number' ? (
                    <div className={`flex items-center gap-2 ${getScoreColor(drawnCard.score)} text-xl md:text-2xl font-bold`}>
                      <Star className="w-6 h-6 md:w-8 md:h-8 fill-current animate-pulse" />
                      <span>{drawnCard.score}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400 text-xl md:text-2xl font-bold animate-pulse">
                      <Skull className="w-6 h-6 md:w-8 md:h-8" />
                      <span>{drawnCard.score}</span>
                    </div>
                  )}
                  
                  <div className="text-2xl md:text-4xl text-purple-300 animate-spin" style={{animationDuration: '3s'}}>⦿</div>
                  
                  <div className="flex items-center gap-2 text-purple-300 text-lg md:text-xl">
                    <Calendar className="w-5 h-5 md:w-7 md:h-7" />
                    <span className="font-mono">{drawnCard.year}</span>
                  </div>
                </div>
                
                <h2 className={`
                  text-2xl md:text-4xl font-serif mb-4 tracking-wide animate-pulse px-2
                  ${drawnCard.rarity === 'cursed' 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-black' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300'
                  }
                `}>
                  {drawnCard.title}
                </h2>
                
                <div className={`
                  inline-block px-4 md:px-6 py-2 rounded-full text-base md:text-lg font-bold mb-4 md:mb-6 border-2
                  ${drawnCard.rarity === 'cursed' 
                    ? 'bg-red-900 text-red-200 border-red-500 animate-pulse' 
                    : 'bg-purple-800 text-purple-200 border-purple-400'
                  }
                `}>
                  ◊ {drawnCard.type} ◊
                </div>
              </div>
              
              <div className="relative px-4 md:px-8">
                <div className="absolute -left-2 md:-left-4 top-0 text-4xl md:text-6xl text-purple-400/30 font-serif">"</div>
                <div className="absolute -right-2 md:-right-4 bottom-0 text-4xl md:text-6xl text-purple-400/30 font-serif">"</div>
                <p className={`
                  text-base md:text-xl leading-relaxed text-center font-serif italic
                  ${drawnCard.rarity === 'cursed' 
                    ? 'text-red-200 animate-pulse' 
                    : 'text-purple-100'
                  }
                `}>
                  {drawnCard.blurb}
                </p>
              </div>
              
              <div className="text-center mt-6 md:mt-8">
                <div className="flex justify-center items-center gap-2 text-purple-400 text-base md:text-lg">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                  <span className="font-serif">The cards have spoken</span>
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                </div>
                <div className="mt-2 font-mono text-xs md:text-sm text-purple-500">
                  ⟢ ◊ ✦ ◊ ⟢
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in-scale {
          animation: fade-in-scale 0.8s ease-out;
        }
        
        @keyframes holographic {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .holographic {
          animation: holographic 3s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
};

export default HorrorMovieTarot;