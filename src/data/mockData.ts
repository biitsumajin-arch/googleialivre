import { TokaidoStation, ChapterTeaser, PhilosophicalPillar, ManuscriptStats } from '../types';

export const MANUSCRIPT_STATS: ManuscriptStats = {
  totalWords: 80000,
  chapterCount: 26,
  hasEpilogue: true,
  tokaidoStationsCovered: 53,
  historicalPeriod: '1603 (Ère Keichō / Ieyasu Tokugawa) — Contemporain',
  mainCharacters: [
    {
      name: 'Adrien V.',
      role: 'Le narrateur (Ex-responsable ADV)',
      description: 'Trente-huit ans. Échappé de la tour Franklin de La Défense, il marche pour dissoudre l’injonction au chiffre et réapprendre la gravité.'
    },
    {
      name: 'Tokugawa Ieyasu',
      role: 'Figure tutélaire & Premier Shogun',
      description: 'Le stratège patient d’Edo, qui sut attendre que le coucou chante avant d’unifier le Japon par la retenue plutôt que la hâte.'
    },
    {
      name: 'Le Père (Paul V.)',
      role: 'La figure de la conformité',
      description: 'Ancien ingénieur rigide d’Évreux, dont le fantôme et l’obsession des tableaux de bord pèsent sur chaque pas du narrateur.'
    },
    {
      name: 'Maître Kenji Matsubara',
      role: 'Le libraire de Nezu',
      description: 'Gardien d’estampes et de reliures anciennes à Tokyo, passeur discret de la carte secrète du Tōkaidō.'
    }
  ]
};

export const TOKAIDO_STATIONS: TokaidoStation[] = [
  {
    id: 'la-defense',
    name: 'La Défense (Tour Franklin)',
    japaneseName: 'ラ・デファンス',
    stageNumber: 'Origine / Paris',
    category: 'departure',
    coordinates: { x: 5, y: 72 },
    modernLocation: 'Quartier d’affaires de Paris, 33e étage de la Tour Franklin',
    historicalContext: 'L’arène moderne des flux, du contrôle de gestion et des réunions d’administration des ventes où le corps s’efface au profit du tableur.',
    modernContext: 'Le point zéro du déracinement contemporain. C’est là que le narrateur rend son badge pour partir vers l’archipel nippon.',
    isWritten: true,
    elevation: '42 m',
    distanceFromEdo: '9 715 km',
    ukiyoEImage: {
      title: 'La Tour sous la pluie oblique',
      artist: 'Hommage contemporain / Style Hasui Kawase',
      period: 'XXIe siècle',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
      description: 'La Défense sous un voile de pluie de novembre, miroirs de verre reflétant la solitude des cols blancs.'
    }
  },
  {
    id: 'ueno',
    name: 'Ueno (Kan’ei-ji)',
    japaneseName: '上野・寛永寺',
    stageNumber: 'Sanctuaire Nord',
    category: 'edo_sanctuary',
    coordinates: { x: 18, y: 35 },
    modernLocation: 'Arrondissement de Taitō, Tokyo',
    historicalContext: 'Fondé en 1625 par le moine Tenkai et le shogun Ieyasu pour protéger Edo des esprits maléfiques venus du nord-est.',
    modernContext: 'Première halte du narrateur à Tokyo. Sous les cryptomérias centenaires, la rupture avec le monde occidental prend corps.',
    quote: '« L\'Histoire n\'était pas une matière morte réservée aux manuels scolaires. C\'était une empreinte encore chaude, laissée par des hommes qui avaient fait le choix, un jour, d\'organiser le monde plutôt que d\'en subir la dérive. »',
    isWritten: true,
    elevation: '24 m',
    distanceFromEdo: '5 km',
    ukiyoEImage: {
      title: 'Cerisiers du temple Kan’ei-ji à Ueno',
      artist: 'Utagawa Hiroshige',
      period: '1856 (Meisho Edo Hyakkei)',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
      description: 'La colline sacrée d’Ueno enveloppée dans la brume du matin, entre sanctuaires funéraires et cèdres millénaires.'
    }
  },
  {
    id: 'yanaka',
    name: 'Yanaka',
    japaneseName: '谷中',
    stageNumber: 'Quartier des temples',
    category: 'edo_sanctuary',
    coordinates: { x: 23, y: 28 },
    modernLocation: 'Quartier historique préservé de Tokyo',
    historicalContext: 'Quartier populaire rescapé du séisme de 1923 et des bombardements, préservant l’atmosphère des ruelles de l’ancien Edo (Shitamachi).',
    modernContext: 'Labyrinthe d’artisans du bois, de chats errants et de marchands d’encens où le narrateur apprend la décélération.',
    isWritten: true,
    elevation: '18 m',
    distanceFromEdo: '6 km',
    ukiyoEImage: {
      title: 'Ruelles du crépuscule à Yanaka',
      artist: 'Kobayashi Kiyochika',
      period: '1881',
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
      description: 'Lumière cuivrée sur les toits de tuiles de Yanaka, où le temps s’est figé dans l’odeur du cèdre brûlé.'
    }
  },
  {
    id: 'nikko',
    name: 'Nikkō (Tōshō-gū)',
    japaneseName: '日光東照宮',
    stageNumber: 'Mausolée Divin',
    category: 'shogun_legacy',
    coordinates: { x: 28, y: 15 },
    modernLocation: 'Préfecture de Tochigi, montagnes du nord',
    historicalContext: 'Mausolée sacré où repose Ieyasu Tokugawa divinisé sous le nom de Tōshō Daigongen. Chef-d’œuvre d’orfèvrerie et de géométrie spirituelle.',
    modernContext: 'Étape initiatique où le narrateur contemple le pilier inversé (Sakasa-bashira), volontairement imparfait pour repousser le déclin.',
    quote: '« La perfection absolue est une impasse mortelle. C\'est l\'imperfection calculée qui offre à la structure sa capacité de résistance. »',
    isWritten: true,
    elevation: '640 m',
    distanceFromEdo: '140 km',
    ukiyoEImage: {
      title: 'Porte Yōmeimon sous la neige à Nikkō',
      artist: 'Hasui Kawase',
      period: '1930',
      imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1200&auto=format&fit=crop',
      description: 'Les dorures flamboyantes de la porte Yōmeimon se découpant contre la forêt de cèdres enneigée.'
    }
  },
  {
    id: 'nihonbashi',
    name: 'Nihonbashi',
    japaneseName: '日本橋',
    stageNumber: '01 / Km 0',
    category: 'tokaido_post',
    coordinates: { x: 35, y: 45 },
    modernLocation: 'Chūō-ku, Tokyo (Pont du Japon)',
    historicalContext: 'Point d’origine officiel des Cinq Routes d’Edo (Gokaidō) instauré par décret shogunal en 1603.',
    modernContext: 'Le premier pas concret sur la route du Tōkaidō. Au-dessus du pont historique coule aujourd’hui une autoroute de béton.',
    quote: '« Nihonbashi. Starting point of all roads. »',
    isWritten: true,
    elevation: '3 m',
    distanceFromEdo: '0 km',
    ukiyoEImage: {
      title: 'Nihonbashi : Le cortège au lever du soleil',
      artist: 'Utagawa Hiroshige',
      period: '1833 (Les Cinquante-trois Stations du Tōkaidō)',
      imageUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1200&auto=format&fit=crop',
      description: 'Départ des voyageurs sous la brume rosée du matin, chiens errants et marchands de poissons frais franchissant le pont en bois.'
    }
  },
  {
    id: 'odawara',
    name: 'Odawara',
    japaneseName: '小田原',
    stageNumber: '09',
    category: 'tokaido_post',
    coordinates: { x: 44, y: 55 },
    modernLocation: 'Préfecture de Kanagawa, Baie de Sagami',
    historicalContext: 'Fief légendaire du clan Hōjō, dernière grande forteresse avant la redoutable barrière montagneuse de Hakone.',
    modernContext: 'Soirée de pluie dans un ryokan discret. Le narrateur commence à sentir ses épaules se dénouer du fardeau corporatif.',
    quote: '« La troisième voie ne menait nulle part [...] la certitude tranquille que je pouvais enfin demeurer immobile sans avoir à justifier de mon existence devant le monde. »',
    isWritten: true,
    elevation: '12 m',
    distanceFromEdo: '83 km',
    ukiyoEImage: {
      title: 'Odawara : Traversée de la rivière Sakawa',
      artist: 'Utagawa Hiroshige',
      period: '1833',
      imageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=1200&auto=format&fit=crop',
      description: 'Les porteurs de palanquins affrontant les flots tumultueux de la rivière au pied des contreforts brumeux de Hakone.'
    }
  },
  {
    id: 'hakone-sekisho',
    name: 'Hakone-Sekisho',
    japaneseName: '箱根関所',
    stageNumber: '10',
    category: 'tokaido_post',
    coordinates: { x: 50, y: 62 },
    modernLocation: 'Lac Ashi, Col de Hakone',
    historicalContext: 'Le poste de contrôle militaire le plus sévère du shogunat (« Femmes qui sortent d’Edo, fusils qui entrent »).',
    modernContext: 'Épreuve physique intense sur les pavés humides de cèdres (Sugi-namiki). Franchir le col, c’est abandonner définitivement l’arrière.',
    quote: '« Le voyage ne sert pas à chercher des réponses. Il sert à user la nécessité de poser des questions. »',
    isWritten: true,
    elevation: '725 m',
    distanceFromEdo: '99 km',
    ukiyoEImage: {
      title: 'Hakone : Vue du lac et des cimes escarpées',
      artist: 'Utagawa Hiroshige',
      period: '1833',
      imageUrl: 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?q=80&w=1200&auto=format&fit=crop',
      description: 'Les cimes bleutées et vertigineuses de Hakone surplombant les eaux sombres du lac Ashi.'
    }
  },
  {
    id: 'kanaya',
    name: 'Kanaya',
    japaneseName: '金谷',
    stageNumber: '24',
    category: 'tokaido_post',
    coordinates: { x: 58, y: 68 },
    modernLocation: 'Préfecture de Shizuoka, rive droite du fleuve Ōi',
    historicalContext: 'Relais redouté sur la rive du fleuve Ōi, interdit de ponts et de bacs par le shogun pour protéger la capitale des invasions rebelles.',
    modernContext: 'Attente forcée de la décrue. Le silence intérieur s’installe enfin tandis que les collines de thé vert fument dans la bruine.',
    quote: '« On ne rentre pas chez soi en retournant là d\'où l\'on vient. On rentre chez soi au moment où le bruit du monde cesse de faire obstacle au silence que l\'on porte en soi. »',
    isWritten: true,
    elevation: '55 m',
    distanceFromEdo: '210 km',
    ukiyoEImage: {
      title: 'Kanaya : Rive du fleuve Ōi',
      artist: 'Utagawa Hiroshige',
      period: '1833',
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
      description: 'Une myriade de porteurs traversant à gué le lit immense et caillouteux du fleuve sous la silhouette lointaine du Fuji.'
    }
  },
  {
    id: 'kakegawa',
    name: 'Kakegawa',
    japaneseName: '掛川',
    stageNumber: '26',
    category: 'tokaido_post',
    coordinates: { x: 63, y: 70 },
    modernLocation: 'Préfecture de Shizuoka',
    historicalContext: 'Ville castrale et étape réputée pour son sanctuaire d’Akiba et son château reconstruit en bois noble traditionnel.',
    modernContext: 'Pause dans les allées des théiers parfumés. Réflexion sur la valeur de la lente maturation des choses.',
    isWritten: false,
    elevation: '40 m',
    distanceFromEdo: '230 km',
    ukiyoEImage: {
      title: 'Kakegawa : Le cerf-volant sur la colline d’Akiba',
      artist: 'Utagawa Hiroshige',
      period: '1833',
      imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1200&auto=format&fit=crop',
      description: 'Paysans franchissant un pont rustique tandis qu’un cerf-volant s’élève dans les bourrasques de printemps.'
    }
  },
  {
    id: 'kunozan',
    name: 'Kunōzan (Tōshō-gū)',
    japaneseName: '久能山東照宮',
    stageNumber: 'Sanctuaire d’Origine',
    category: 'shogun_legacy',
    coordinates: { x: 68, y: 73 },
    modernLocation: 'Shizuoka, Mont Kunō face à l’océan Pacifique',
    historicalContext: 'Lieu de sépulture initial de Tokugawa Ieyasu avant le transfert de ses cendres à Nikkō. Un promontoire rocheux vertigineux battu par les vents marins.',
    modernContext: 'L’apogée de la marche du Tōkaidō. Au sommet des 1 159 marches de pierre, l’apaisement absolu.',
    isWritten: false,
    elevation: '216 m',
    distanceFromEdo: '175 km',
    ukiyoEImage: {
      title: 'Kunōzan : Le promontoire sacré face aux flots',
      artist: 'Utagawa Kunisada',
      period: '1850',
      imageUrl: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1200&auto=format&fit=crop',
      description: 'Les escaliers de pierre taillée grimpant la falaise abrupte vers le sanctuaire laqué de rouge et or.'
    }
  },
  {
    id: 'kuwana',
    name: 'Kuwana',
    japaneseName: '桑名',
    stageNumber: '42',
    category: 'tokaido_post',
    coordinates: { x: 74, y: 65 },
    modernLocation: 'Préfecture de Mie, Baie d’Ise',
    historicalContext: 'Port de l’unique traversée maritime du Tōkaidō (« Les Sept Lieues par la mer » depuis Miya).',
    modernContext: 'L’attente du navire et le spectacle des voiles blanches qui se déploient au couchant.',
    isWritten: false,
    elevation: '5 m',
    distanceFromEdo: '380 km',
    ukiyoEImage: {
      title: 'Kuwana : Le port et le château au crépuscule',
      artist: 'Utagawa Hiroshige',
      period: '1833',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop',
      description: 'Jonques amarrées au pied des remparts blancs du château de Kuwana face à la mer calme.'
    }
  },
  {
    id: 'sekigahara',
    name: 'Sekigahara',
    japaneseName: '関ヶ原',
    stageNumber: 'Champ de Bataille 1600',
    category: 'shogun_legacy',
    coordinates: { x: 80, y: 55 },
    modernLocation: 'Préfecture de Gifu, vallée étroite',
    historicalContext: 'Le 21 octobre 1600, le destin du Japon s’est joué en six heures de pluie et de sang. Victoire décisive d’Ieyasu scellant 250 ans de paix.',
    modernContext: 'Une plaine herbeuse où le vent fait bruire les bambous. Méditation sur la décision, le timing et le coût de la paix.',
    isWritten: false,
    elevation: '140 m',
    distanceFromEdo: '420 km',
    ukiyoEImage: {
      title: 'La plaine brumeuse de Sekigahara',
      artist: 'Tsukioka Yoshitoshi',
      period: '1885',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
      description: 'Les étendards aux trois feuilles de mauve flottant dans la bruine d’automne sur les collines silencieuses.'
    }
  },
  {
    id: 'himeji',
    name: 'Himeji (Château du Héron Blanc)',
    japaneseName: '姫路城',
    stageNumber: 'Prolongement Ouest',
    category: 'western_extension',
    coordinates: { x: 88, y: 50 },
    modernLocation: 'Préfecture de Hyōgo',
    historicalContext: 'Chef-d’œuvre absolu de l’architecture militaire nippone, forteresse imprenable en plâtre blanc immaculé aux charpentes de cèdre croisées.',
    modernContext: 'L’examen des tenons et mortaises invisibles qui maintiennent l’édifice debout depuis plus de quatre siècles sans un seul clou de fer.',
    quote: '« Ce qui tient debout ne doit rien au hasard : tout est affaire d\'assemblage sous la surface. »',
    isWritten: true,
    elevation: '45 m',
    distanceFromEdo: '590 km',
    ukiyoEImage: {
      title: 'Himeji : Le donjon du Héron Blanc',
      artist: 'Hasui Kawase',
      period: '1935',
      imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=1200&auto=format&fit=crop',
      description: 'Le donjon spectaculaire d’Himeji surgissant comme un oiseau blanc déployant ses ailes au-dessus des remparts.'
    }
  },
  {
    id: 'okayama',
    name: 'Okayama (Kōraku-en)',
    japaneseName: '岡山・後楽園',
    stageNumber: 'Terminus Intérieur',
    category: 'western_extension',
    coordinates: { x: 94, y: 44 },
    modernLocation: 'Préfecture d’Okayama',
    historicalContext: 'Le jardin Kōraku-en (« se réjouir après les autres »), symbole confucéen du gouverneur qui veille avant de songer à son propre repos.',
    modernContext: 'Dernière escale. L’homme qui marchait a déposé son fardeau sans bruit pour se fondre dans l’ordre serein du monde.',
    quote: '« La vraie force n\'est pas celle qui s\'impose par l\'éclat, mais celle qui sait s\'effacer dans le paysage pour en devenir la charpente invisible. »',
    isWritten: true,
    elevation: '10 m',
    distanceFromEdo: '660 km',
    ukiyoEImage: {
      title: 'Le jardin Kōraku-en sous la lune d’automne',
      artist: 'Yoshida Hiroshi',
      period: '1928',
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
      description: 'Les îles d’herbe rase et les pins taillés se mirant dans l’étang silencieux sous un croissant doré.'
    }
  }
];

export const CHAPTERS_LIST: ChapterTeaser[] = [
  {
    number: 1,
    title: "La chambre d'Ueno",
    japaneseSubtitle: "上野の部屋",
    location: "Tokyo (Ueno)",
    wordCount: 3120,
    teaser: "L’arrivée à Tokyo dans un silence ouaté. Entre les murs étroits d'une chambre d'hôtel donnant sur les cèdres de Kan’ei-ji, le narrateur mesure pour la première fois le vide vertigineux laissé par sa démission.",
    keyThemes: ["Désengagement", "Silence", "Kan'ei-ji"]
  },
  {
    number: 2,
    title: "La foule d'Akihabara",
    japaneseSubtitle: "秋葉原の雑踏",
    location: "Tokyo (Akihabara)",
    wordCount: 2980,
    teaser: "Le contraste violent des néons électriques et de l'hyper-stimulation visuelle. Tentative vaine de noyer l'angoisse dans le flux marchand avant de fuir vers les ruelles sombres.",
    keyThemes: ["Flux moderne", "Aliénation", "Satellites urbains"]
  },
  {
    number: 3,
    title: "La porte de Kan'ei-ji",
    japaneseSubtitle: "寛永寺の門",
    location: "Tokyo (Ueno)",
    wordCount: 3450,
    teaser: "Sous la porte de bois laqué épargnée par les siècles, la découverte fortuite de la marque shogunal. L'Histoire cesse d'être un concept abstrait pour devenir une présence physique.",
    keyThemes: ["Trace historique", "Tokugawa Ieyasu", "Protection spirituelle"]
  },
  {
    number: 4,
    title: "L'ancrage de la première page",
    japaneseSubtitle: "最初の一頁の錨",
    location: "Tokyo (Nezu)",
    wordCount: 2840,
    teaser: "L'achat d'un carnet en papier washi chez un artisan relieur. Le premier trait d'encre noire posé sur le papier : le refus de continuer à vivre par procuration.",
    keyThemes: ["Papier Washi", "Écriture", "Décision"]
  },
  {
    number: 5,
    title: "Le libraire de Nezu",
    japaneseSubtitle: "根津の古書店主",
    location: "Tokyo (Nezu)",
    wordCount: 3610,
    teaser: "Rencontre avec Maître Matsubara. Entre piles de rouleaux d'estampes et odeur d'encre de Chine, le vieil homme déplie une carte gravée du Tōkaidō de l'ère Keichō.",
    keyThemes: ["Transmission", "Estampe", "Carte du Tōkaidō"]
  },
  {
    number: 6,
    title: "L'art de la conformité",
    japaneseSubtitle: "同調の技法",
    location: "Souvenir / La Défense",
    wordCount: 3300,
    teaser: "Flashback impitoyable sur les dix années passées au 33e étage de la Tour Franklin. La mécanique sournoise des réunions de reporting et la tyrannie des objectifs trimestriels.",
    keyThemes: ["Tour Franklin", "Corporatisme", "Fardeau"]
  },
  {
    number: 7,
    title: "La géométrie du Tōshō-gū",
    japaneseSubtitle: "東照宮の幾何学",
    location: "Nikkō",
    wordCount: 3890,
    teaser: "Excursion dans la forêt de Nikkō. Devant la porte Yōmeimon, la découverte du pilier sculpté à l'envers : leçon de survie d'un souverain qui se méfiait de l'achèvement absolu.",
    keyThemes: ["Imperfection calculée", "Nikkō", "Architecture sacrée"]
  },
  {
    number: 8,
    title: "La carte de Nihonbashi",
    japaneseSubtitle: "日本橋の地図",
    location: "Tokyo (Nihonbashi)",
    wordCount: 2750,
    teaser: "Sur la plaque de bronze du Km 0, les semelles foulent le départ officiel. L'heure n'est plus aux préparatifs mentaux mais à l'épreuve de la route.",
    keyThemes: ["Km 0", "Départ", "Méridien d'Edo"]
  },
  {
    number: 9,
    title: "Le hall de Roissy",
    japaneseSubtitle: "シャルル・ド・ゴール空港の記憶",
    location: "Souvenir / Paris",
    wordCount: 2900,
    teaser: "Le souvenir de l'embarquement à Paris sans bagage en soute, avec pour seul bien un sac à dos de vingt-cinq litres et les carnets noirs de son père.",
    keyThemes: ["Dépouillement", "Vol inaugural", "Rupture"]
  },
  {
    number: 10,
    title: "L'appartement de la rue Caulaincourt",
    japaneseSubtitle: "コーランクール通りの部屋",
    location: "Souvenir / Montmartre",
    wordCount: 3150,
    teaser: "Le tri des objets accumulés dans son deux-pièces parisien. La liquidation méthodique des faux conforts et le vertige de la liberté nue.",
    keyThemes: ["Tri", "Solitude", "Épure"]
  },
  {
    number: 11,
    title: "La réunion du mardi",
    japaneseSubtitle: "火曜日の定例会議",
    location: "Souvenir / La Défense",
    wordCount: 3400,
    teaser: "La scène clé de la rupture : au milieu d'un PowerPoint sur les marges brutes de la division Europe, le silence inattendu du narrateur qui refuse d'argumenter.",
    keyThemes: ["Bascule", "Silence", "Défiance"]
  },
  {
    number: 12,
    title: "Le café de la place Clichy",
    japaneseSubtitle: "クリシー広場のカフェ",
    location: "Souvenir / Paris",
    wordCount: 2650,
    teaser: "La dernière conversation avec son ancien supérieur hiérarchique, incapable de concevoir qu'on puisse démissionner sans avoir négocié un point de chute.",
    keyThemes: ["Incompréhension", "Statut social", "Courage"]
  },
  {
    number: 13,
    title: "Les quais de la Seine et le Jardin des Plantes",
    japaneseSubtitle: "セーヌ河岸と植物園",
    location: "Souvenir / Paris",
    wordCount: 3050,
    teaser: "Les journées d'errance préparatoire dans Paris. L'observation des grands arbres séculaires comme antidote au bruit des klaxons.",
    keyThemes: ["Nature en ville", "Patience", "Respiration"]
  },
  {
    number: 14,
    title: "La nuit sur les carnets",
    japaneseSubtitle: "手帖の夜",
    location: "Shinagawa (Tōkaidō)",
    wordCount: 3200,
    teaser: "Première nuit d'étape hors de la métropole. Déchiffrage des notes mathématiques laissées par le père dans ses agendas d'ingénieur d'Évreux.",
    keyThemes: ["Héritage paternel", "Chiffres vs Sens", "Première ampoule"]
  },
  {
    number: 15,
    title: "La lettre du libraire",
    japaneseSubtitle: "古書店主の書簡",
    location: "Kawasaki (Tōkaidō)",
    wordCount: 2800,
    teaser: "Réception d'une missive brève de Maître Matsubara contenant une énigme sur le passage du col de Hakone et le véritable sens du mot fardeau.",
    keyThemes: ["Guidance", "Kōan", "Poste restante"]
  },
  {
    number: 16,
    title: "L'entretien de rupture",
    japaneseSubtitle: "退職の面談",
    location: "Souvenir / DRH",
    wordCount: 3500,
    teaser: "Le face-à-face final avec la directrice des ressources humaines. Quand le langage corporatif se heurte à la détermination inébranlable d'un homme qui a déjà levé l'ancre.",
    keyThemes: ["Démission", "Protocole", "Délivrance"]
  },
  {
    number: 17,
    title: "L'inventaire de la maison d'Évreux",
    japaneseSubtitle: "エヴルーの家の棚卸し",
    location: "Souvenir / Normandie",
    wordCount: 3750,
    teaser: "Après la mort du père, le vidage méthodique de la maison provinciale. L'alignement maniaque des outils dans l'atelier et la découverte d'une passion secrète pour le Japon.",
    keyThemes: ["Deuil", "Secret de famille", "Outils d'Évreux"]
  },
  {
    number: 18,
    title: "La balance des vents",
    japaneseSubtitle: "風の天秤",
    location: "Totsuka à Hiratsuka",
    wordCount: 3100,
    teaser: "Marche côtière face aux rafales du Pacifique. Apprentissage du réglage du pas en fonction du souffle des marées et du poids du sac.",
    keyThemes: ["Rythme physique", "Vents marins", "Cadence"]
  },
  {
    number: 19,
    title: "La troisième voie : la pénombre d'Odawara",
    japaneseSubtitle: "第三の道：小田原の薄暗がり",
    location: "Odawara",
    wordCount: 3950,
    teaser: "Sous les murs du château d'Odawara, la révélation qu'il existe une alternative entre la soumission aveugle au système et la révolte stérile : la voie de la présence immobile.",
    keyThemes: ["Odawara", "La troisième voie", "Apaisement"]
  },
  {
    number: 20,
    title: "L'ombre des Hōjō",
    japaneseSubtitle: "北条氏の影",
    location: "Odawara",
    wordCount: 2950,
    teaser: "Méditation sur la chute des seigneurs Hōjō face à Toyotomi Hideyoshi en 1590, et comment Ieyasu choisit d'observer sans se hâter pour hériter du pays.",
    keyThemes: ["Stratégie", "Patience politique", "Temps long"]
  },
  {
    number: 21,
    title: "Le téléphone du ryokan",
    japaneseSubtitle: "旅館の黒電話",
    location: "Yumoto (Hakone)",
    wordCount: 2600,
    teaser: "Un appel impromptu venu de France qu'on laisse sonner dans le couloir de tatamis sans décrocher. Le cordon ombilical est tranché.",
    keyThemes: ["Coupure", "Tatami", "Sérénité"]
  },
  {
    number: 22,
    title: "La traversée du lac",
    japaneseSubtitle: "湖上の渡河",
    location: "Lac Ashi (Hakone)",
    wordCount: 3350,
    teaser: "Les eaux sombres et profondes du lac Ashi enveloppées dans le brouillard matinal. Le Mont Fuji apparaît brièvement entre deux nuages comme une promesse muette.",
    keyThemes: ["Lac Ashi", "Fuji-san", "Brumes Suyari"]
  },
  {
    number: 23,
    title: "Le signal de Kanaya",
    japaneseSubtitle: "金谷の合図",
    location: "Kanaya (Rive du fleuve Ōi)",
    wordCount: 3800,
    teaser: "Bloqué par la crue du fleuve Ōi. Au lieu de pester contre le retard comme au temps des plannings de La Défense, le marcheur accueille le contretemps comme une grâce.",
    keyThemes: ["Fleuve Ōi", "Lenteur féconde", "Arrêt"]
  },
  {
    number: 24,
    title: "La lumière du Kansai",
    japaneseSubtitle: "関西の光",
    location: "Vers Nagoya et Kyoto",
    wordCount: 3100,
    teaser: "La traversée des plaines maraîchères et des ateliers de poterie. La lumière devient plus dorée, les voix des passants plus douces.",
    keyThemes: ["Changement de lumière", "Artisanat", "Simplicité"]
  },
  {
    number: 25,
    title: "L'armature d'Himeji",
    japaneseSubtitle: "姫路城の骨組み",
    location: "Himeji",
    wordCount: 3900,
    teaser: "Visite contemplative de l'ossature de cèdre du donjon. L'admiration pour la charpente invisible qui soutient la blancheur éclatante de l'édifice.",
    keyThemes: ["Charpente invisible", "Héron Blanc", "Assemblage"]
  },
  {
    number: 26,
    title: "La mesure d'Okayama",
    japaneseSubtitle: "岡山の調律",
    location: "Okayama (Kōraku-en)",
    wordCount: 4200,
    teaser: "Au cœur du jardin de la félicité partagée, le narrateur écrit les dernières lignes de son carnet. Le fardeau n'est pas tombé : il est devenu le sol même sous ses pas.",
    keyThemes: ["Épilogue", "Réconciliation", "Alignement"]
  }
];

export const PHILOSOPHICAL_PILLARS: PhilosophicalPillar[] = [
  {
    id: 'la-rupture-du-cadre',
    number: '01',
    kanji: '脱',
    title: 'L’Échappée du Cadre',
    subtitle: 'De la Défense à la Route d’Edo',
    summary: 'Quitter l’illusion du contrôle permanent, la tyrannie des indicateurs trimestriels et la fiction d’une conformité qui étouffe le vivant.',
    detailedReflection: 'Dans les tours de verre de La Défense, chaque instant est mesuré à l’aune de sa rentabilité prévisionnelle. Le roman explore ce moment précis où le corps refuse d’obtempérer, où le chiffre cesse de faire écran devant l’évidence du vide. Partir au Japon n’est pas une fuite touristique, mais une déconstruction méthodique de l’armure corporative.',
    quote: '« On ne quitte pas une entreprise pour chercher une autre case, on la quitte quand on comprend que la case n\'a jamais existé que dans notre propre consentement. »',
    associatedConcept: 'Datsuzoku (脱俗) — L’affranchissement des conventions'
  },
  {
    id: 'la-patience-shogunale',
    number: '02',
    kanji: '忍',
    title: 'La Patience de Tokugawa',
    subtitle: 'L’art du Tanuki et du Temps Long',
    summary: 'Opposé à la fougue d’Oda Nobunaga et à la démesure de Hideyoshi, Ieyasu a bâti deux siècles et demi de paix en attendant que le coucou chante.',
    detailedReflection: 'La modernité occidentale valorise la vitesse d’exécution, la rupture immédiate et l’impatience agressive. Le narrateur découvre dans les écrits et sanctuaires de Tokugawa Ieyasu une stratégie diamétralement opposée : la retenue, la sédimentation du temps, la capacité à encaisser sans riposter immédiatement pour mieux s’ancrer dans la durée.',
    quote: '« La vie de l\'homme ressemble à un long voyage avec un lourd fardeau. N\'aie point hâte. » — Précepte d’Ieyasu Tokugawa (1604)',
    associatedConcept: 'Nin (忍) — L’endurance persévérante'
  },
  {
    id: 'le-wabi-sabi-du-marcheur',
    number: '03',
    kanji: '侘',
    title: 'L’Éloge de l’Imperfection',
    subtitle: 'Wabi-Sabi & Usure de la Route',
    summary: 'Accepter la patine des semelles usées, les ampoules, les averses imprévues et le pilier inversé du Tōshō-gū comme conditions mêmes de la grâce.',
    detailedReflection: 'Le roman prend le contre-pied de l’obsession de perfection industrielle. À Nikkō, le bâtisseur laissa un pilier gravé à l’envers car l’achèvement parfait invite les dieux à la destruction. Sur le Tōkaidō, c’est dans la fatigue musculaire, la pluie battante du col de Hakone et les vêtements froissés que le narrateur renoue avec sa propre humanité.',
    quote: '« Ce n\'est pas la perfection qui nous préserve de l\'effondrement, c\'est la flexibilité que nous laissons à nos failles. »',
    associatedConcept: 'Wabi-Sabi (侘寂) — La beauté de l’incomplet et de l’éphémère'
  },
  {
    id: 'la-reconciliation-filiale',
    number: '04',
    kanji: '和',
    title: 'La Dette et la Verticalité',
    subtitle: 'La Mémoire du Père d’Évreux',
    summary: 'Démêler la rigueur d’un père autoritaire, ingénieur hanté par la norme, pour transformer l’amertume du fils en une charpente bienveillante.',
    detailedReflection: 'Le voyage géographique double un voyage mémoriel. En feuilletant les vieux carnets d’Évreux au milieu des collines de Shizuoka, le fils comprend que la sévérité paternelle n’était pas du mépris, mais une peur panique du désordre. Le fardeau hérité cesse alors d’être un boulet pour devenir le lest qui permet au navire de traverser la houle.',
    quote: '« On ne pardonne pas à son père en oubliant qui il était, mais en comprenant ce dont il avait si cruellement peur. »',
    associatedConcept: 'Wa (和) — L’harmonie réconciliée'
  }
];

export const EXCERPT_CONTENT = {
  chapterNumber: 1,
  chapterTitle: "La chambre d'Ueno",
  japaneseTitle: "第一章　上野の部屋",
  openingQuote: "« Comment tient-on debout, quand on a enfin fini de subir ? »",
  paragraphs: [
    "La pluie de Tokyo ne fait pas le même bruit que celle qui s'écrase sur les baies vitrées du trente-troisième étage de la Tour Franklin.",
    "À La Défense, c'était un crépitement sec contre le double vitrage teinté, un bruit feutré par la climatisation centrale qui rappelait aux occupants que le monde extérieur existait encore, quelque part sous la dalle de béton. Ici, au fond de cette ruelle d'Ueno que nulle carte touristique ne daignait nommer, l'eau ruisselait sur des tuiles de terre cuite avant de tomber goutte à goutte sur le zinc d'un auvent rouillé.",
    "J'avais posé mon sac à dos sur le tatami. Un sac de vingt-cinq litres, contenant trois chemises, deux pantalons de marche, une paire de rechange et le carnet noir dont mon père n'avait jamais rempli que les six premières pages.",
    "Tout le reste — les tableaux de bord prévisionnels, les validations budgétaires, les badges magnétiques et l'appartement loué rue Caulaincourt — était resté de l'autre côté du globe, dissous en une seule signature au bas d'un protocole de rupture conventionnelle que la directrice des ressources humaines avait qualifié de « téméraire ».",
    "— Vous avez un projet précis, Adrien ? m'avait-elle demandé en ajustant ses lunettes.",
    "— Oui, avais-je répondu sans ciller. Marcher.",
    "Elle avait souri avec cette politesse glacée réservée aux collaborateurs que l'on soupçonne d'un début de dépression nerveuse. Elle attendait un nom de cabinet de conseil, une clause de non-concurrence à négocier, ou au moins l'aveu d'un congé sabbatique pour faire le tour des vignobles chiliens. L'idée qu'un responsable d'administration des ventes puisse simplement vouloir poser un pied devant l'autre jusqu'à ce que le silence revienne dépassait l'entendement de la tour.",
    "Ce soir-là, devant la fenêtre d'Ueno, les cèdres du temple Kan'ei-ji oscillaient sous les bourrasques. Quelque part sous ces ramures reposaient six des quinze shoguns de la dynastie Tokugawa. Des hommes qui avaient verrouillé un pays entier pendant deux siècles et demi pour lui épargner la fureur du monde.",
    "Je ne cherchais pas à verrouiller quoi que ce soit. Je cherchais simplement à savoir comment un homme tient debout quand il a enfin fini d'obéir."
  ]
};
