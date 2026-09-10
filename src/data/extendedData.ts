import { GlossaryTerm, HanafudaCard, ChapterReview } from '../types';

export const JAPANESE_GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Bakufu',
    kanji: '幕府',
    romaji: 'Bakufu',
    translation: 'Gouvernement sous la tente / Shogunat',
    explanation: 'Régime militaire féodal dirigé par le Shogun, concentrant le pouvoir politique, diplomatique et militaire effectif du Japon en laissant l’Empereur à Kyoto comme figure religieuse et symbolique.',
    historicalContext: 'Fondé à Edo (Tokyo) par Tokugawa Ieyasu en 1603 après la bataille de Sekigahara, il inaugura deux siècles et demi de paix ininterrompue (Ère Edo / Pax Tokugawa).',
    category: 'institutions'
  },
  {
    term: 'Sankin-kōtai',
    kanji: '参勤交代',
    romaji: 'Sankin-kōtai',
    translation: 'Résidence alternée des seigneurs',
    explanation: 'Devoir politique strict obligeant chaque seigneur féodal (Daimyo) à résider un an sur deux à Edo auprès du Shogun, et à y laisser sa femme et son héritier comme otages d’honneur.',
    historicalContext: 'Ce système ruinait financièrement les seigneurs en frais de cortège somptueux sur le Tōkaidō, empêchant ainsi tout soulèvement armé contre le shogunat.',
    category: 'institutions'
  },
  {
    term: 'Daimyo',
    kanji: '大名',
    romaji: 'Daimyō',
    translation: 'Grand nom / Seigneur féodal',
    explanation: 'Gouverneur territorial et chef militaire héréditaire à la tête d’un fief (Han), disposant d’un revenu calculé en mesures de riz (koku) et d’une armée de samouraïs vassaux.',
    historicalContext: 'Sous les Tokugawa, les daimyos étaient divisés entre « Fudai » (alliés historiques d’Ieyasu) et « Tozama » (alliés tardifs sous étroite surveillance policière).',
    category: 'institutions'
  },
  {
    term: 'Tōkaidō',
    kanji: '東海道',
    romaji: 'Tōkaidō',
    translation: 'Route de la Mer de l’Est',
    explanation: 'La plus célèbre et stratégique des Cinq Routes (Gokaidō), reliant la capitale shogunale Edo (Tokyo) à la capitale impériale Kyoto le long du littoral pacifique.',
    historicalContext: 'Jalonnée de 53 stations officielles (shukuba) offrant auberges, relais de chevaux, douanes armées et salons de thé, elle fut immortalisée par les estampes d’Utagawa Hiroshige.',
    category: 'geography'
  },
  {
    term: 'Sekisho',
    kanji: '関所',
    romaji: 'Sekisho',
    translation: 'Barrière de contrôle / Poste frontière',
    explanation: 'Poste de douane et de police militaire fortifié surveillant étroitement les voyageurs, passeports intérieurs et armes circulant sur les grands axes.',
    historicalContext: 'Le col de Hakone (Hakone-Sekisho) appliquait la règle d’or : « Iri-deppo to de-onna » (intercepter les armes qui entrent et les femmes d’otages qui tentent de fuir Edo).',
    category: 'institutions'
  },
  {
    term: 'Wabi-Sabi',
    kanji: '侘寂',
    romaji: 'Wabi-Sabi',
    translation: 'Beauté de l’imperfection et patine du temps',
    explanation: 'Esthétique et philosophie spirituelle célébrant la beauté des choses simples, éphémères, asymétriques et patinées par l’usure de la vie.',
    historicalContext: 'Inspiré du bouddhisme zen et de la cérémonie du thé de Sen no Rikyū, il s’oppose au luxe clinquant pour privilégier l’authenticité dépouillée.',
    category: 'philosophy'
  },
  {
    term: 'Datsuzoku',
    kanji: '脱俗',
    romaji: 'Datsuzoku',
    translation: 'Affranchissement des conventions',
    explanation: 'Principe zen désignant l’émancipation hors des schémas habituels, la rupture avec la routine aliénante et l’éveil à une liberté de regard inattendue.',
    historicalContext: 'Au cœur du roman : Adrien quitte la Tour Franklin pour retrouver le réel en posant un pied devant l’autre.',
    category: 'philosophy'
  },
  {
    term: 'Nin',
    kanji: '忍',
    romaji: 'Nin',
    translation: 'Patience persévérante / Endurance discrète',
    explanation: 'Capacité à endurer les épreuves et la lenteur sans précipitation, en dissimulant sa force jusqu’au moment opportun.',
    historicalContext: 'Devise suprême d’Ieyasu Tokugawa, surnommé le vieux blaireau (Tanuki) pour sa patience légendaire face à ses rivaux impétueux.',
    category: 'philosophy'
  },
  {
    term: 'Hanko',
    kanji: '判子',
    romaji: 'Hanko',
    translation: 'Sceau d’identité gravé',
    explanation: 'Tampon personnel ou officiel en bois noble, ivoire ou pierre, gravé en écriture sigillaire (tenshotai) et encré de cinabre vermillon pour authentifier les actes officiels.',
    historicalContext: 'Chaque voyageur, commerçant et samouraï portait son sceau pour signer les registres d’étapes et les sauf-conduits sur le Tōkaidō.',
    category: 'everyday_life'
  },
  {
    term: 'Ryokan',
    kanji: '旅館',
    romaji: 'Ryokan',
    translation: 'Auberge traditionnelle japonaise',
    explanation: 'Établissement d’hospitalité traditionnelle doté de sols en nattes de paille de riz (tatami), de parois de papier coulissantes (shōji), de bains chauds (onsen) et de repas soignés.',
    historicalContext: 'Les relais d’Odawara et de Hakone comptaient parmi les plus prisés pour panser les pieds meurtris des pèlerins.',
    category: 'everyday_life'
  },
  {
    term: 'Shukuba',
    kanji: '宿場',
    romaji: 'Shukuba',
    translation: 'Station d’étape / Ville-relais',
    explanation: 'Bourgade étape officielle organisée autour de la grand-route pour ravitailler les convois, fournir des porteurs de palanquins (kago) et héberger les marcheurs.',
    historicalContext: 'Il y avait 53 stations le long du Tōkaidō, de Shinagawa près d’Edo jusqu’à Ōtsu aux portes de Kyoto.',
    category: 'geography'
  },
  {
    term: 'Kōan',
    kanji: '公案',
    romaji: 'Kōan',
    translation: 'Énigme paradoxale méditative',
    explanation: 'Brève anecdote, dialogue ou énigme insoluble par la logique rationnelle pure, utilisée dans le bouddhisme Rinzai pour faire basculer l’esprit vers l’illumination directe (satori).',
    historicalContext: 'Utilisé par le libraire de Nezu pour aiguiller la marche d’Adrien vers l’acceptation de la gravité.',
    category: 'philosophy'
  },
  {
    term: 'Hanafuda',
    kanji: '花札',
    romaji: 'Hanafuda',
    translation: 'Cartes des fleurs',
    explanation: 'Jeu de 48 cartes traditionnelles japonaises réparties en 12 suites florales correspondant aux mois de l’année, riche en symbolisme poétique et allégories saisonnières.',
    historicalContext: 'Né au début du XVIIe siècle sous le shogunat Tokugawa pour contourner les interdictions de jeux de cartes occidentaux imposées par le Bakufu.',
    category: 'everyday_life'
  }
];

export const INITIAL_HANAFUDA_CARDS: HanafudaCard[] = [
  {
    id: 'h-card-01',
    chapter_number: 1,
    card_title: 'Le Pin sous la pluie de Kan’ei-ji',
    kanji: '松',
    symbol: 'Matsu (Pin de Janvier) & Grue Céleste',
    description: 'Le pin séculaire de Kan’ei-ji qui protège le repos des six shoguns. Symbole d’enracinement immuable et de longévité face aux bourrasques de l’hiver tokyoïte.',
    image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    status: 'approved',
    author_name: 'Adrien V. (Auteur)',
    isOfficial: true,
    created_at: '2026-03-01T10:00:00Z'
  },
  {
    id: 'h-card-03',
    chapter_number: 3,
    card_title: 'Le Prunier en fleur de Yanaka',
    kanji: '梅',
    symbol: 'Ume (Prunier de Février) & Rossignol d’Edo',
    description: 'Le premier bourgeon qui brave le gel dans les ruelles du quartier des artisans. La promesse de l’éveil intérieur quand le corps se libère de l’armure de bureau.',
    image_url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=800&auto=format&fit=crop',
    status: 'approved',
    author_name: 'Adrien V. (Auteur)',
    isOfficial: true,
    created_at: '2026-03-02T11:30:00Z'
  },
  {
    id: 'h-card-07',
    chapter_number: 7,
    card_title: 'Le Cerisier & Le Pilier Inversé de Nikkō',
    kanji: '桜',
    symbol: 'Sakura (Cerisier de Mars) & Rideau du Sanctuaire',
    description: 'La splendeur éphémère de la porte Yōmeimon et le pilier sculpté à l’envers. La perfection absolue est une mort ; l’imperfection sauvegarde la structure vivante.',
    image_url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=800&auto=format&fit=crop',
    status: 'approved',
    author_name: 'Adrien V. (Auteur)',
    isOfficial: true,
    created_at: '2026-03-03T09:15:00Z'
  },
  {
    id: 'h-card-10',
    chapter_number: 10,
    card_title: 'La Glycine & Le Sceau des Tokugawa',
    kanji: '藤',
    symbol: 'Fuji (Glycine d’Avril) & Coucou du Soir',
    description: 'La floraison violette tombant comme des larmes sur le col de Hakone. Le moment où l’on attend que l’oiseau chante selon la sagesse d’Ieyasu.',
    image_url: 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?q=80&w=800&auto=format&fit=crop',
    status: 'approved',
    author_name: 'Maître Matsubara',
    isOfficial: true,
    created_at: '2026-03-04T14:00:00Z'
  },
  {
    id: 'h-card-19',
    chapter_number: 19,
    card_title: 'L’Iris d’Eau d’Odawara',
    kanji: '菖',
    symbol: 'Ayame (Iris de Mai) & Pont aux Huit Lames',
    description: 'La troisième voie dans la pénombre du château d’Odawara. Ni révolte stérile, ni soumission aux tableurs : la présence sereine.',
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
    status: 'approved',
    author_name: 'Claire D. (Comité de Lecture)',
    isOfficial: true,
    created_at: '2026-03-05T16:45:00Z'
  },
  {
    id: 'h-card-23',
    chapter_number: 23,
    card_title: 'La Pivoine & Le Papillon d’Ōi-gawa',
    kanji: '牡',
    symbol: 'Botan (Pivoine de Juin) & Papillon Bleu',
    description: 'La décrue bénie sur la rive de Kanaya. La retenue féconde qui enseigne que le retard n’est pas une faute mais une respiration.',
    image_url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop',
    status: 'approved',
    author_name: 'Julien M. (Éditions de l’Archipel)',
    isOfficial: true,
    created_at: '2026-03-06T18:20:00Z'
  },
  {
    id: 'h-card-25',
    chapter_number: 25,
    card_title: 'Le Trèfle & Le Héron Blanc d’Himeji',
    kanji: '萩',
    symbol: 'Hagi (Lespedeza de Juillet) & Sanglier de Montagne',
    description: 'L’armature de cèdre invisible du château du Héron Blanc. Ce qui tient debout ne doit rien au hasard mais à l’assemblage souterrain.',
    image_url: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=800&auto=format&fit=crop',
    status: 'approved',
    author_name: 'Adrien V. (Auteur)',
    isOfficial: true,
    created_at: '2026-03-07T10:00:00Z'
  },
  {
    id: 'h-card-26',
    chapter_number: 26,
    card_title: 'L’Érable Rouge & La Lune d’Okayama',
    kanji: '楓',
    symbol: 'Momiji (Érable d’Octobre) & Cerf des Brumes',
    description: 'Les reflets dorés dans le jardin Kōraku-en. Le fardeau devenu sol sous les pas du voyageur pacifié.',
    image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    status: 'approved',
    author_name: 'Maître Matsubara',
    isOfficial: true,
    created_at: '2026-03-08T08:30:00Z'
  }
];

export const INITIAL_CHAPTER_REVIEWS: ChapterReview[] = [
  {
    id: 'rev-01',
    chapter_number: 1,
    user_id: 'user-demo-01',
    rating: 5,
    comment: 'L’analogie entre le bruit de la pluie sur le double vitrage de la Tour Franklin et les tuiles d’Ueno est saisissante de justesse. On ressent physiquement la décompression.',
    author_name: 'Éléonore (Critique Littéraire)',
    author_role: 'reader',
    created_at: '2026-03-04T12:00:00Z'
  },
  {
    id: 'rev-02',
    chapter_number: 1,
    user_id: 'user-demo-02',
    rating: 5,
    comment: '« Comment tient-on debout quand on a fini de subir ? » Une formule qui résonne comme un haïku philosophique. La plume est sobre et dense.',
    author_name: 'Marc V. (Lecteur)',
    author_role: 'reader',
    created_at: '2026-03-05T15:30:00Z'
  },
  {
    id: 'rev-03',
    chapter_number: 7,
    user_id: 'user-demo-03',
    rating: 5,
    comment: 'L’analyse du pilier inversé du Tōshō-gū à Nikkō offre une clé de lecture magistrale sur l’imperfection salvatrice. Bravo pour cette érudition jamais pédante.',
    author_name: 'Sophie B. (Comité de Lecture)',
    author_role: 'reader',
    created_at: '2026-03-06T19:10:00Z'
  }
];
