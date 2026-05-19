// ─── SOLAR SYSTEM ────────────────────────────────────────────────────────────

export interface Planet {
  id: string
  name: string
  type: 'star' | 'planet' | 'dwarf'
  radius: number          // display radius (scaled)
  orbitRadius: number     // distance from sun (display units)
  orbitPeriod: number     // Earth years
  rotationPeriod: number  // Earth days
  color: string
  emissive?: string
  description: string
  funFact: string
  diameter: string        // real km
  dayLength: string
  moons: number
  surfaceTemp: string
  distanceFromSun: string
  atmosphere: string
  textureHint: string     // color description for procedural texture
}

export const PLANETS: Planet[] = [
  {
    id: 'sun',
    name: 'The Sun',
    type: 'star',
    radius: 2.8,
    orbitRadius: 0,
    orbitPeriod: 0,
    rotationPeriod: 25,
    color: '#ffd080',
    emissive: '#ff8800',
    description: 'Our star — a massive ball of plasma that has powered life on Earth for 4.6 billion years. It contains 99.86% of all mass in our solar system.',
    funFact: 'The Sun is so large that about 1.3 million Earths could fit inside it.',
    diameter: '1,392,700 km',
    dayLength: '25 Earth days',
    moons: 0,
    surfaceTemp: '5,500°C',
    distanceFromSun: '0 km',
    atmosphere: 'Plasma (hydrogen & helium)',
    textureHint: 'bright yellow-orange with solar flares',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    radius: 0.38,
    orbitRadius: 5.5,
    orbitPeriod: 0.24,
    rotationPeriod: 58.6,
    color: '#a8a09a',
    description: 'The smallest planet and closest to the Sun. Mercury has no atmosphere to retain heat, so temperatures swing wildly from blazing hot to freezing cold.',
    funFact: 'A year on Mercury (88 days) is shorter than its day (176 days).',
    diameter: '4,879 km',
    dayLength: '176 Earth days',
    moons: 0,
    surfaceTemp: '-180°C to 430°C',
    distanceFromSun: '77 million km',
    atmosphere: 'Virtually none',
    textureHint: 'gray, heavily cratered',
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    radius: 0.95,
    orbitRadius: 8,
    orbitPeriod: 0.62,
    rotationPeriod: -243,
    color: '#d4b483',
    description: 'The hottest planet in our solar system, despite not being closest to the Sun. A runaway greenhouse effect has made its surface an inferno wrapped in thick sulfuric acid clouds.',
    funFact: 'Venus rotates backwards compared to most planets — the sun rises in the west.',
    diameter: '12,104 km',
    dayLength: '243 Earth days',
    moons: 0,
    surfaceTemp: '465°C',
    distanceFromSun: '108 million km',
    atmosphere: 'Carbon dioxide, sulfuric acid clouds',
    textureHint: 'pale yellow-orange with thick cloud layers',
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    radius: 1.0,
    orbitRadius: 11,
    orbitPeriod: 1.0,
    rotationPeriod: 1,
    color: '#4a90c8',
    description: 'Our home — the only known world to harbor life. Earth\'s liquid water, breathable atmosphere, and magnetic field create a uniquely habitable environment.',
    funFact: 'Earth is the densest planet in the solar system, and the only one not named after a god.',
    diameter: '12,742 km',
    dayLength: '24 hours',
    moons: 1,
    surfaceTemp: '-88°C to 58°C',
    distanceFromSun: '150 million km',
    atmosphere: 'Nitrogen, oxygen, argon',
    textureHint: 'blue oceans, green/brown land, white clouds',
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    radius: 0.53,
    orbitRadius: 15,
    orbitPeriod: 1.88,
    rotationPeriod: 1.03,
    color: '#c1440e',
    description: 'The Red Planet — a cold desert world with the tallest volcano and deepest canyon in the solar system. Scientists believe Mars once had rivers and an ocean.',
    funFact: 'Olympus Mons on Mars is three times taller than Mount Everest.',
    diameter: '6,779 km',
    dayLength: '24 hours 37 min',
    moons: 2,
    surfaceTemp: '-125°C to 20°C',
    distanceFromSun: '228 million km',
    atmosphere: 'Thin carbon dioxide',
    textureHint: 'rusty red, Valles Marineris canyon visible',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    radius: 2.2,
    orbitRadius: 22,
    orbitPeriod: 11.86,
    rotationPeriod: 0.41,
    color: '#c88b60',
    description: 'The king of the solar system — a gas giant so massive it could hold all other planets inside it. The Great Red Spot is a storm that has raged for over 350 years.',
    funFact: 'Jupiter has 95 known moons — its moon Ganymede is larger than the planet Mercury.',
    diameter: '139,820 km',
    dayLength: '9 hours 56 min',
    moons: 95,
    surfaceTemp: '-110°C (cloud tops)',
    distanceFromSun: '778 million km',
    atmosphere: 'Hydrogen and helium',
    textureHint: 'orange and cream bands, Great Red Spot',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    radius: 1.9,
    orbitRadius: 30,
    orbitPeriod: 29.46,
    rotationPeriod: 0.44,
    color: '#e4d191',
    description: 'Saturn\'s iconic rings are made of billions of ice and rock particles. Despite being the second-largest planet, it\'s the least dense — it would float in water.',
    funFact: 'Saturn\'s rings are enormous but incredibly thin — just 10 to 100 meters thick across 282,000 km.',
    diameter: '116,460 km',
    dayLength: '10 hours 42 min',
    moons: 146,
    surfaceTemp: '-140°C (cloud tops)',
    distanceFromSun: '1.4 billion km',
    atmosphere: 'Hydrogen and helium',
    textureHint: 'pale gold with prominent ring system',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    radius: 1.5,
    orbitRadius: 37,
    orbitPeriod: 84,
    rotationPeriod: -0.72,
    color: '#7de8e8',
    description: 'An ice giant tilted on its side — Uranus rotates almost horizontally, giving it the most extreme seasons of any planet. Its blue-green color comes from methane in its atmosphere.',
    funFact: 'Uranus rotates on its side, likely from a collision with an Earth-sized object long ago.',
    diameter: '50,724 km',
    dayLength: '17 hours 14 min',
    moons: 27,
    surfaceTemp: '-195°C',
    distanceFromSun: '2.9 billion km',
    atmosphere: 'Hydrogen, helium, methane',
    textureHint: 'pale aquamarine, featureless',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    radius: 1.4,
    orbitRadius: 43,
    orbitPeriod: 164.8,
    rotationPeriod: 0.67,
    color: '#3a5fcf',
    description: 'The windiest planet in the solar system, with storms reaching 2,100 km/h. Neptune was predicted mathematically before it was ever observed through a telescope.',
    funFact: 'Neptune was predicted by math before it was observed — Newton\'s laws revealed it was there.',
    diameter: '49,244 km',
    dayLength: '16 hours 6 min',
    moons: 16,
    surfaceTemp: '-200°C',
    distanceFromSun: '4.5 billion km',
    atmosphere: 'Hydrogen, helium, methane',
    textureHint: 'deep cobalt blue with white cloud streaks',
  },
]

// ─── CONSTELLATIONS ───────────────────────────────────────────────────────────

export interface Star {
  id: string
  x: number  // normalized 0-1
  y: number
  brightness: number  // 0-1
  name?: string
}

export interface Constellation {
  id: string
  name: string
  latin: string
  season: string
  hemisphere: string
  mythology: string
  howToFind: string
  stars: Star[]
  lines: Array<[string, string]>  // star id pairs
  color: string
  brightestStar?: string
  area: string
}

export const CONSTELLATIONS: Constellation[] = [
  {
    id: 'orion',
    name: 'Orion',
    latin: 'Orion',
    season: 'Winter',
    hemisphere: 'Both',
    mythology: 'In Greek mythology, Orion was a giant huntsman placed among the stars by Zeus. The three stars of his belt are among the most recognizable in the night sky, visible across the entire world.',
    howToFind: 'Look for three bright stars in a straight line — Orion\'s Belt. Betelgeuse (his right shoulder) is distinctly reddish-orange, while Rigel (his left foot) shines brilliant blue-white.',
    brightestStar: 'Rigel',
    area: '594 square degrees',
    color: '#a8d8ff',
    stars: [
      { id: 'betelgeuse', x: 0.35, y: 0.3, brightness: 0.9, name: 'Betelgeuse' },
      { id: 'bellatrix', x: 0.65, y: 0.32, brightness: 0.75, name: 'Bellatrix' },
      { id: 'mintaka', x: 0.42, y: 0.5, brightness: 0.7, name: 'Mintaka' },
      { id: 'alnilam', x: 0.5, y: 0.52, brightness: 0.72, name: 'Alnilam' },
      { id: 'alnitak', x: 0.58, y: 0.54, brightness: 0.7, name: 'Alnitak' },
      { id: 'rigel', x: 0.65, y: 0.72, brightness: 0.95, name: 'Rigel' },
      { id: 'saiph', x: 0.37, y: 0.74, brightness: 0.7, name: 'Saiph' },
      { id: 'meissa', x: 0.5, y: 0.15, brightness: 0.6, name: 'Meissa' },
    ],
    lines: [
      ['betelgeuse', 'mintaka'], ['bellatrix', 'mintaka'],
      ['mintaka', 'alnilam'], ['alnilam', 'alnitak'],
      ['alnitak', 'rigel'], ['alnitak', 'saiph'],
      ['betelgeuse', 'meissa'], ['bellatrix', 'meissa'],
      ['betelgeuse', 'saiph'], ['bellatrix', 'rigel'],
    ],
  },
  {
    id: 'ursa-major',
    name: 'Ursa Major',
    latin: 'Ursa Major',
    season: 'Spring',
    hemisphere: 'Northern',
    mythology: 'Zeus transformed the nymph Callisto into a bear and placed her in the stars. The Big Dipper asterism forms the bear\'s back and tail, and has guided travellers for millennia.',
    howToFind: 'Find the Big Dipper — seven bright stars forming a saucepan shape. The two stars at the outer edge of the "bowl" point directly to Polaris, the North Star.',
    brightestStar: 'Alioth',
    area: '1,280 square degrees',
    color: '#ffd4a8',
    stars: [
      { id: 'dubhe', x: 0.65, y: 0.22, brightness: 0.88, name: 'Dubhe' },
      { id: 'merak', x: 0.6, y: 0.35, brightness: 0.82, name: 'Merak' },
      { id: 'phecda', x: 0.44, y: 0.38, brightness: 0.78, name: 'Phecda' },
      { id: 'megrez', x: 0.42, y: 0.28, brightness: 0.68, name: 'Megrez' },
      { id: 'alioth', x: 0.32, y: 0.28, brightness: 0.9, name: 'Alioth' },
      { id: 'mizar', x: 0.24, y: 0.32, brightness: 0.82, name: 'Mizar' },
      { id: 'alkaid', x: 0.16, y: 0.44, brightness: 0.8, name: 'Alkaid' },
    ],
    lines: [
      ['dubhe', 'merak'], ['merak', 'phecda'], ['phecda', 'megrez'],
      ['megrez', 'dubhe'], ['megrez', 'alioth'], ['alioth', 'mizar'], ['mizar', 'alkaid'],
    ],
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    latin: 'Cassiopeia',
    season: 'Autumn',
    hemisphere: 'Northern',
    mythology: 'Queen Cassiopeia of Ethiopia, punished by Poseidon for her vanity, was placed in the sky and condemned to circle the celestial pole forever — sometimes hanging upside down.',
    howToFind: 'Look for a distinctive W or M shape (depending on season) opposite the Big Dipper across Polaris. It\'s circumpolar — visible year-round from northern latitudes.',
    brightestStar: 'Schedar',
    area: '598 square degrees',
    color: '#ffa8d8',
    stars: [
      { id: 'caph', x: 0.18, y: 0.45, brightness: 0.78, name: 'Caph' },
      { id: 'schedar', x: 0.34, y: 0.35, brightness: 0.88, name: 'Schedar' },
      { id: 'cih', x: 0.5, y: 0.5, brightness: 0.82, name: 'Cih (γ Cas)' },
      { id: 'ruchbah', x: 0.66, y: 0.35, brightness: 0.76, name: 'Ruchbah' },
      { id: 'segin', x: 0.82, y: 0.45, brightness: 0.72, name: 'Segin' },
    ],
    lines: [
      ['caph', 'schedar'], ['schedar', 'cih'], ['cih', 'ruchbah'], ['ruchbah', 'segin'],
    ],
  },
  {
    id: 'scorpius',
    name: 'Scorpius',
    latin: 'Scorpius',
    season: 'Summer',
    hemisphere: 'Southern',
    mythology: 'Scorpius was sent by the goddess Artemis to kill Orion, which is why they are placed on opposite sides of the sky — Orion sets as Scorpius rises, and vice versa, forever fleeing each other.',
    howToFind: 'Look for the bright reddish-orange star Antares in the southern sky during summer. The curved tail curving to the south and bright head make it one of the most recognizable constellations.',
    brightestStar: 'Antares',
    area: '497 square degrees',
    color: '#ffa080',
    stars: [
      { id: 'antares', x: 0.38, y: 0.35, brightness: 0.96, name: 'Antares' },
      { id: 'graffias', x: 0.28, y: 0.22, brightness: 0.72, name: 'Graffias' },
      { id: 'dschubba', x: 0.38, y: 0.2, brightness: 0.75, name: 'Dschubba' },
      { id: 'pi-sco', x: 0.48, y: 0.22, brightness: 0.68, name: 'π Sco' },
      { id: 'sigma-sco', x: 0.32, y: 0.46, brightness: 0.7, name: 'σ Sco' },
      { id: 'tau-sco', x: 0.38, y: 0.55, brightness: 0.68, name: 'τ Sco' },
      { id: 'lesath', x: 0.44, y: 0.7, brightness: 0.72, name: 'Lesath' },
      { id: 'shaula', x: 0.5, y: 0.75, brightness: 0.82, name: 'Shaula' },
      { id: 'girtab', x: 0.58, y: 0.7, brightness: 0.7, name: 'Girtab' },
    ],
    lines: [
      ['graffias', 'dschubba'], ['dschubba', 'pi-sco'], ['graffias', 'antares'],
      ['antares', 'sigma-sco'], ['sigma-sco', 'tau-sco'], ['tau-sco', 'lesath'],
      ['lesath', 'shaula'], ['shaula', 'girtab'],
    ],
  },
  {
    id: 'lyra',
    name: 'Lyra',
    latin: 'Lyra',
    season: 'Summer',
    hemisphere: 'Northern',
    mythology: 'The lyre of Orpheus, the greatest musician of Greek mythology. When he was killed, Zeus placed his lyre in the stars. Vega, its brightest star, will become the North Star in 12,000 years.',
    howToFind: 'Find the brilliant blue-white star Vega — the fifth-brightest in the night sky — and you\'ve found Lyra. It forms the Summer Triangle with Deneb and Altair.',
    brightestStar: 'Vega',
    area: '286 square degrees',
    color: '#a8c8ff',
    stars: [
      { id: 'vega', x: 0.5, y: 0.18, brightness: 0.96, name: 'Vega' },
      { id: 'sheliak', x: 0.38, y: 0.42, brightness: 0.72, name: 'Sheliak' },
      { id: 'sulafat', x: 0.62, y: 0.42, brightness: 0.7, name: 'Sulafat' },
      { id: 'delta1-lyr', x: 0.35, y: 0.58, brightness: 0.62, name: 'δ¹ Lyr' },
      { id: 'delta2-lyr', x: 0.42, y: 0.62, brightness: 0.65, name: 'δ² Lyr' },
      { id: 'zeta-lyr', x: 0.58, y: 0.62, brightness: 0.63, name: 'ζ Lyr' },
    ],
    lines: [
      ['vega', 'sheliak'], ['vega', 'sulafat'],
      ['sheliak', 'sulafat'], ['sheliak', 'delta1-lyr'],
      ['delta1-lyr', 'delta2-lyr'], ['delta2-lyr', 'zeta-lyr'],
      ['sulafat', 'zeta-lyr'],
    ],
  },
]

// ─── DEEP SPACE OBJECTS ───────────────────────────────────────────────────────

export interface DeepSpaceObject {
  id: string
  name: string
  type: 'nebula' | 'galaxy' | 'black-hole' | 'pulsar' | 'cluster'
  distance: string
  size: string
  description: string
  science: string
  discovery: string
  visualColor: string
  glowColor: string
  facts: string[]
}

export const DEEP_SPACE: DeepSpaceObject[] = [
  {
    id: 'orion-nebula',
    name: 'Orion Nebula',
    type: 'nebula',
    distance: '1,344 light-years',
    size: '24 light-years across',
    description: 'The closest stellar nursery to Earth — a vast cloud of gas and dust where new stars are being born right now. Visible to the naked eye as the fuzzy middle "star" in Orion\'s sword.',
    science: 'The Orion Nebula (M42) is an HII region — a cloud of ionized hydrogen lit by the intense ultraviolet radiation of hot young stars called the Trapezium cluster at its heart.',
    discovery: 'Known since antiquity, scientifically catalogued by Nicolas-Claude Fabri de Peiresc in 1610.',
    visualColor: '#ff9955',
    glowColor: '#ff6622',
    facts: [
      'Stars in the nebula are only 1–2 million years old — newborns in cosmic terms',
      'Contains enough material to form 10,000 stars like our Sun',
      'The Trapezium cluster at its core illuminates the entire cloud',
      'Protoplanetary disks around forming stars have been photographed by Hubble',
    ],
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy',
    type: 'galaxy',
    distance: '2.537 million light-years',
    size: '220,000 light-years across',
    description: 'Our galactic neighbor and the farthest object visible to the naked eye. Andromeda contains roughly 1 trillion stars and is on a collision course with the Milky Way.',
    science: 'A barred spiral galaxy similar to our own Milky Way. The collision with our galaxy in approximately 4.5 billion years will likely not result in any star collisions — the spaces between stars are vast.',
    discovery: 'Recorded by Persian astronomer Abd al-Rahman al-Sufi in 964 AD. Identified as a separate galaxy by Edwin Hubble in 1925.',
    visualColor: '#d4c8ff',
    glowColor: '#8866dd',
    facts: [
      'Approaching us at about 110 km/s — it will collide with the Milky Way in ~4.5 billion years',
      'Contains about 1 trillion stars compared to our galaxy\'s 200–400 billion',
      'Has at least 14 satellite dwarf galaxies, including M32 and M110',
      'The light you see left Andromeda 2.5 million years ago',
    ],
  },
  {
    id: 'sagittarius-a',
    name: 'Sagittarius A*',
    type: 'black-hole',
    distance: '26,673 light-years',
    size: '44 million km event horizon',
    description: 'The supermassive black hole at the center of our own Milky Way galaxy. Though invisible by nature, we know it\'s there by watching stars orbit a point of nothingness at extraordinary speeds.',
    science: 'With a mass of 4 million solar masses, Sgr A* is a relatively "quiet" black hole compared to active galactic nuclei. In 2022, the Event Horizon Telescope captured the first image of its shadow.',
    discovery: 'Radio source discovered in 1974. Its black hole nature confirmed over decades by tracking stellar orbits, notably the star S2 which completes an orbit every 16 years at 2.7% the speed of light.',
    visualColor: '#ff6644',
    glowColor: '#ff3300',
    facts: [
      'Four million times the mass of our Sun compressed into a region smaller than our solar system',
      'First directly imaged by the Event Horizon Telescope collaboration in 2022',
      'The star S2 orbits it at up to 2.7% the speed of light — enough to test General Relativity',
      'Occasionally "flares" when gas clouds fall into it, briefly becoming millions of times brighter in X-rays',
    ],
  },
  {
    id: 'crab-nebula',
    name: 'Crab Nebula',
    type: 'pulsar',
    distance: '6,523 light-years',
    size: '11 light-years across',
    description: 'The remnant of a supernova explosion witnessed and recorded by Chinese astronomers in 1054 AD. At its heart is a rapidly spinning pulsar — a dead star sending pulses of radiation 30 times per second.',
    science: 'A pulsar is a neutron star — the collapsed core of a massive star — that rotates rapidly and emits beams of electromagnetic radiation. The Crab Pulsar spins 30 times per second and powers the nebula\'s continued glow.',
    discovery: 'The supernova was observed on July 4, 1054 AD and recorded by Chinese, Arab, and possibly Native American astronomers. John Bevis discovered the nebula in 1731.',
    visualColor: '#88ccff',
    glowColor: '#4488ff',
    facts: [
      'The supernova explosion in 1054 AD was bright enough to see in daylight for 23 days',
      'The Crab Pulsar rotates 30 times per second — the energy released powers the expanding nebula',
      'It\'s expanding at 1,500 km/s — it has grown about 7 light-years in diameter since the explosion',
      'One of the most studied objects in astronomy, a benchmark for understanding supernovae',
    ],
  },
  {
    id: 'pillars-of-creation',
    name: 'Pillars of Creation',
    type: 'nebula',
    distance: '6,500–7,000 light-years',
    size: '4–5 light-years tall',
    description: 'One of the most iconic images in astronomy — towering columns of gas and dust in the Eagle Nebula where new stars are being sculpted by stellar winds. Photographed by Hubble in 1995, the image changed how humanity saw the cosmos.',
    science: 'The pillars are examples of Evaporating Gaseous Globules (EGGs) — dense pockets of gas that resist being blown away by radiation from nearby hot stars. Stars are actively forming inside these pillars.',
    discovery: 'Photographed by the Hubble Space Telescope in April 1995. New infrared images by the James Webb Space Telescope in 2022 revealed previously hidden details.',
    visualColor: '#66aa88',
    glowColor: '#228855',
    facts: [
      'The original Hubble image is one of the most reproduced astronomical photographs ever taken',
      'Recent Spitzer Space Telescope data suggests the pillars may already be destroyed by a supernova — we just haven\'t seen the light arrive yet',
      'James Webb Space Telescope imaged them in infrared in 2022, revealing stars forming inside',
      'The "EGGs" (Evaporating Gaseous Globules) at pillar tips are protostellar cocoons',
    ],
  },
]

// ─── TIME EVENTS ─────────────────────────────────────────────────────────────

export interface CosmicEvent {
  id: string
  name: string
  type: 'eclipse' | 'alignment' | 'meteor' | 'transit' | 'opposition'
  date: string
  description: string
  howToView: string
  icon: string
}

export const COSMIC_EVENTS: CosmicEvent[] = [
  {
    id: 'lunar-eclipse-2025',
    name: 'Total Lunar Eclipse',
    type: 'eclipse',
    date: 'Mar 14, 2025',
    description: 'The Moon passes completely into Earth\'s shadow, turning blood red as Earth\'s atmosphere bends sunlight around the planet onto the lunar surface.',
    howToView: 'No equipment needed — visible with naked eye. Totality lasts about 65 minutes. The red color is literally every sunrise and sunset happening on Earth at once, projected onto the Moon.',
    icon: '🌑',
  },
  {
    id: 'saturn-opposition-2025',
    name: 'Saturn at Opposition',
    type: 'opposition',
    date: 'Sep 21, 2025',
    description: 'Saturn is directly opposite the Sun from Earth — rising at sunset and visible all night. This is the best time to observe Saturn\'s rings through a telescope.',
    howToView: 'Even a small telescope at 30× magnification will reveal Saturn\'s rings. The planet will appear larger and brighter than at any other time of year.',
    icon: '🪐',
  },
  {
    id: 'perseid-meteor',
    name: 'Perseid Meteor Shower',
    type: 'meteor',
    date: 'Aug 11–13, 2025',
    description: 'Earth passes through the debris trail of Comet Swift-Tuttle, producing up to 100 meteors per hour at peak. One of the most reliable and spectacular annual meteor showers.',
    howToView: 'No telescope needed. Find a dark location, lie flat, and look toward the northeast. Allow 20 minutes for your eyes to dark-adapt. Best viewing: 2 AM – dawn.',
    icon: '☄️',
  },
  {
    id: 'jupiter-conjunction',
    name: 'Jupiter-Venus Conjunction',
    type: 'alignment',
    date: 'Jul 1, 2025',
    description: 'Jupiter and Venus appear less than 0.5° apart in the evening sky — close enough to see both through a telescope at the same time. These conjunctions create the star-like objects that inspired the Star of Bethlehem theory.',
    howToView: 'Look west after sunset. Both planets will be brilliant — Venus noticeably brighter. A small telescope will show both in the same field of view.',
    icon: '✨',
  },
]
