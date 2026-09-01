import type {
  StoryChapter,
  StoryContent,
  StoryCharacter
} from "./story.types";

const t = (text: string): StoryContent => ({ type: "text", text });
const i = (text: string): StoryContent => ({ type: "important", text });
const d = (
  character: StoryCharacter,
  name: string,
  ...lines: string[]
): StoryContent => ({
  type: "dialogue",
  character,
  name,
  lines
});

export const storyImages = {
  couaxia: "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/couaxia.png",
  avadora: "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/avadora.png",
  hylda: "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/hylda.png",
  cita: "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/Cita.png",
  natsu: "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/natsu.gif",
  myo: "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/myo.png"
};

export const chapters: StoryChapter[] = [
  {
    id: "departure",
    number: 0,
    title: "Le départ",
    subtitle: "Tout commence sur Saphira",
    icon: "🚀",
    pages: [
      {
        id: "departure-1",
        title: "Saphira",
        subtitle: "Le monde des Kraduks",
        image: storyImages.couaxia,
        imageAlt: "Couaxia",
        content: [
          t("Couaxia vivait sur une planète lointaine nommée Saphira."),
          t("Un monde fascinant où coexistaient de nombreuses espèces venues des profondeurs cosmiques."),
          t("Elle appartenait aux Kraduks, une espèce rare et intelligente semblable à des poulpes, capable de survivre aussi bien dans les océans luminescents que dans les cités suspendues de Saphira."),
          t("Aimée par sa famille et entourée d’amis fidèles, Couaxia avait pourtant une différence : elle rêvait d’ailleurs."),
          t("Depuis toute petite, elle observait les étoiles avec émerveillement.")
        ],
        messages: [
          "Saphira… c’est ici que tout commence. 🌌",
          "J’ai toujours voulu savoir ce qu’il y avait au-delà des étoiles.",
          "Je crois que mon envie de voyager était déjà impossible à arrêter. 👀"
        ]
      },
      {
        id: "departure-2",
        title: "Avadora",
        subtitle: "Le vaisseau de Couaxia",
        image: storyImages.avadora,
        imageAlt: "Avadora",
        content: [
          t("Sur Saphira, chaque jeune devait suivre une formation stricte de pilote spatial."),
          t("À la fin de cet apprentissage, chacun recevait son propre vaisseau."),
          i("Le sien, elle l’avait nommé Avadora."),
          t("Un vaisseau rapide, élégant et équipé d’un système de camouflage capable de disparaître dans l’obscurité interstellaire."),
          t("Couaxia adorait lire les récits d’anciens explorateurs revenus de leurs voyages."),
          t("Ces livres racontaient des mondes inconnus, des créatures extraordinaires et des mystères encore irrésolus."),
          t("Ils nourrirent en elle une envie irrépressible de découvrir l’univers.")
        ],
        messages: [
          "Avadora ! 🛸",
          "Il allait devenir bien plus qu’un simple vaisseau.",
          "Les récits des anciens explorateurs n’ont clairement pas calmé ma curiosité."
        ]
      },
      {
        id: "departure-3",
        title: "Une galaxie lointaine",
        subtitle: "Des signes de vie",
        content: [
          t("Dès l’âge de dix ans, Couaxia commença à étudier les galaxies répertoriées."),
          t("Après des années de recherches acharnées, elle identifia une galaxie très éloignée de la sienne."),
          i("Une galaxie où des signes de vie semblaient exister."),
          t("À cent vingt ans — l’âge adulte chez les Kraduks — elle prit sa décision."),
          i("Elle quitta Saphira."),
          t("À bord d’Avadora, Couaxia commença enfin le voyage dont elle avait rêvé pendant toute sa jeunesse.")
        ],
        messages: [
          "À dix ans, j’étais déjà en train d’étudier les galaxies. 👀",
          "Des signes de vie aussi loin de Saphira… impossible de ne pas aller voir.",
          "À cent vingt ans, j’étais enfin prête à partir."
        ]
      },
      {
        id: "departure-4",
        title: "Dix jours plus tard",
        subtitle: "Des passagères clandestines",
        image: storyImages.hylda,
        imageAlt: "Hylda",
        content: [
          t("Cela faisait déjà dix jours que Couaxia voyageait à bord d’Avadora lorsqu’elle entendit du bruit dans le vaisseau."),
          t("Le bruit venait de la cuisine. Elle y découvrit Hylda et Cita en train de se battre pour un petit bout de nourriture."),
          t("Les deux s’étaient cachées dans la réserve depuis le départ. Elles avaient faim et leurs petites sacoches étaient désormais vides."),
          d("couaxia", "Couaxia", "— STOP vous deux !!! Que se passe-t-il ? Et que faites-vous ici ? Surtout toi, ma sœur !"),
          d("hylda", "Hylda", "— Alors je peux tout expliquer… On voulait juste manger quelque chose."),
          d("cita", "Cita", "— Capitaine, nous avons faim !"),
          d("couaxia", "Couaxia", "— Non, ce n’est pas possible ! Vous ne devriez pas être ici ! Votre place est sur Saphira, vous n’avez pas atteint l’âge adulte."),
          d("hylda", "Hylda", "— Oui, mais on voulait voir le monde aussi, partir à l’aventure à tes côtés.")
        ],
        messages: [
          "Et c’est là que j’ai découvert mes deux passagères clandestines. 😭",
          "Dix jours. Elles avaient réussi à rester cachées dix jours.",
          "Évidemment, c’est la nourriture qui les a trahies."
        ]
      },
      {
        id: "departure-5",
        title: "Une nouvelle équipe",
        subtitle: "Le voyage continue",
        content: [
          t("Couaxia soupira. Elle savait que Hylda et Cita étaient têtues et qu’elles ne changeraient pas d’avis."),
          t("Elle décida donc de les laisser rester à bord du vaisseau, mais à une condition : elles devraient suivre les règles et ne pas se mettre en danger."),
          t("Elle appela Saphira pour prévenir leurs proches de la situation. Les deux amies étaient ravies et promirent de se comporter correctement."),
          d("couaxia", "Couaxia", "— Vous me faites voir de toutes les couleurs… Bon allez, continuons notre route !"),
          t("Et c’est ainsi que Couaxia, Hylda et Cita continuèrent leur voyage à travers les étoiles, prêtes à découvrir de nouveaux mondes et à vivre des aventures extraordinaires."),
          t("Couaxia apprit les bases de la navigation spatiale à sa sœur et à son amie, et elles devinrent rapidement des équipières compétentes.")
        ],
        messages: [
          "Oui, j’ai fini par céder. 😭",
          "Je savais très bien qu’elles ne changeraient pas d’avis.",
          "Et voilà comment mon voyage solo est devenu un voyage à trois. 💜"
        ]
      }
    ]
  },

  {
    id: "natsu",
    number: 1,
    title: "Rencontre avec Natsu",
    subtitle: "Le Drasquin solitaire",
    icon: "🐉",
    pages: [
      {
        id: "natsu-1",
        title: "Draquin",
        subtitle: "Une planète mystérieuse",
        content: [
          t("Durant son voyage, alors qu’elle venait à peine d’entamer son aventure, Couaxia fit escale sur la planète Draquin."),
          t("Après avoir analysé l’environnement depuis Avadora, la jeune exploratrice fit deux découvertes notables."),
          t("La première : l’atmosphère était parfaitement respirable pour une Kraduk, ce qui lui permettait de sortir sans équipement lourd."),
          t("La seconde : une seule source de vie avait été détectée sur toute la planète."),
          i("Une présence unique."),
          t("Intriguée, Couaxia quitta son vaisseau afin d’enquêter.")
        ],
        messages: [
          "Draquin… notre première véritable escale. 🪐",
          "Une seule forme de vie détectée sur toute une planète. Pas inquiétant du tout. 👀"
        ]
      },
      {
        id: "natsu-2",
        title: "Une présence unique",
        subtitle: "Le Drasquin",
        image: storyImages.natsu,
        imageAlt: "Natsu",
        content: [
          t("Après plusieurs heures de recherche dans ce monde inconnu, Couaxia aperçut enfin la créature."),
          t("Des écailles noires de jais recouvraient son corps massif. Ses griffes ivoire étaient longues et acérées."),
          t("Deux cornes roses encadraient son crâne. En s’approchant prudemment, Couaxia distingua des ailes aux écailles tranchantes ainsi qu’une queue bleutée qui fendait l’air avec lenteur."),
          i("Un être mi-requin, mi-dragon. Un Drasquin."),
          t("Un prédateur légendaire.")
        ],
        messages: [
          "Et voilà Natsu ! 🐉💜",
          "Mi-requin, mi-dragon. Une combinaison parfaitement raisonnable.",
          "Les cornes roses sont importantes. Très importantes."
        ]
      },
      {
        id: "natsu-3",
        title: "La chasse",
        subtitle: "De l’exploratrice à la proie",
        content: [
          t("Les questions affluaient dans l’esprit de Couaxia : pourquoi était-il seul ? Était-il en danger ? Devait-elle essayer de lui parler ?"),
          t("C’est en se posant cette dernière question qu’elle se souvint d’une caractéristique majeure de l’espèce : une faim quasi insatiable."),
          t("Les Drasquins dévoraient tout ce qui se trouvait à portée de crocs."),
          t("Soudain, un craquement sec retentit sous son pied."),
          t("Les yeux du Drasquin s’ouvrirent brutalement."),
          t("En une fraction de seconde, Couaxia activa les petits propulseurs de ses bottes pour s’éloigner."),
          i("La chasse venait de commencer. Et, pour l’instant, elle était la proie.")
        ],
        messages: [
          "Oui. J’ai marché sur quelque chose. 😭",
          "À cet instant précis, Natsu ne voulait clairement pas devenir mon ami."
        ]
      },
      {
        id: "natsu-4",
        title: "L’ultime prédateur",
        subtitle: "Des jours à survivre",
        content: [
          t("Pendant des heures… puis des jours, Couaxia dut user de toute son ingéniosité et de ses capacités athlétiques pour survivre."),
          t("Elle exploitait le terrain, se dissimulait dans les reliefs rocheux et utilisait sa souplesse naturelle pour se faufiler."),
          t("Mais face à elle se dressait ce qui s’apparentait à l’ultime prédateur."),
          t("Finalement, épuisés, les deux protagonistes se retrouvèrent face à face une nouvelle fois, au sommet d’un promontoire rocheux balayé par le vent."),
          t("Le silence était lourd."),
          d("couaxia", "Couaxia", "— Viens avec moi. Je mettrai fin à la souffrance qui te pousse à tout dévorer.")
        ],
        messages: [
          "La chasse a duré beaucoup trop longtemps. 😭",
          "À un moment, il fallait bien arrêter de courir."
        ]
      },
      {
        id: "natsu-5",
        title: "Un sacrifice",
        subtitle: "Gagner sa confiance",
        image: storyImages.couaxia,
        imageAlt: "Couaxia",
        content: [
          t("Ses mots résonnèrent dans l’air froid."),
          t("Pour accompagner son geste à sa promesse, Couaxia fit un sacrifice."),
          i("Elle sectionna l’un de ses tentacules et le déposa devant la créature."),
          t("Le Drasquin observa. Puis dévora."),
          t("Lentement, l’instinct sauvage qui brûlait dans son regard sembla vaciller."),
          i("Quelque chose d’autre émergeait. Une émotion nouvelle, inconnue : la confiance."),
          d("natsu", "Natsu", "— Natsu… tel est mon nom.")
        ],
        messages: [
          "Oui… c’est LE fameux tentacule. 🐙",
          "Et c’est là que j’ai découvert son nom. 💜"
        ]
      },
      {
        id: "natsu-6",
        title: "Changer de forme",
        subtitle: "Compression organique adaptative",
        image: storyImages.natsu,
        imageAlt: "Natsu sous sa forme réduite",
        content: [
          t("Couaxia observa le Drasquin en silence. Même épuisé, il restait immense. Bien trop imposant pour entrer dans Avadora."),
          d("couaxia", "Couaxia", "— Si tu viens avec moi… il faudra que tu puisses quitter cette planète."),
          d("natsu", "Natsu", "— Je ne suis pas prisonnier de cette forme."),
          t("Soudain, les écailles noires de jais commencèrent à vibrer légèrement, comme traversées par une énergie invisible."),
          t("Ses ailes se replièrent plus étroitement, sa queue se contracta et son corps massif sembla se comprimer sur lui-même."),
          t("En quelques secondes, la gigantesque créature de plusieurs mètres ne mesurait plus que la taille d’un grand félin."),
          i("Toujours aussi impressionnant. Toujours aussi dangereux. Mais transportable.")
        ],
        messages: [
          "Et hop : Natsu format transportable. 🐉",
          "La compression organique adaptative est quand même très pratique."
        ]
      },
      {
        id: "natsu-7",
        title: "Un nouveau compagnon",
        subtitle: "L’aventure continue",
        content: [
          t("Les bases de données d’Avadora mentionnaient cette capacité rare chez certains Drasquins : la compression organique adaptative, un pouvoir ancestral leur permettant d’ajuster leur taille selon l’environnement ou la quantité d’énergie disponible."),
          d("natsu", "Natsu", "— Je peux réduire ma taille… mais ma faim reste la même."),
          d("couaxia", "Couaxia", "— Alors nous trouverons une solution. Ensemble."),
          t("Natsu sauta avec agilité et atterrit près d’elle. Pour la première fois, il n’avait pas l’air d’un prédateur, mais d’un compagnon."),
          t("Ce moment marqua le début d’une amitié improbable. Une exploratrice venue des étoiles. Un prédateur consumé par la faim."),
          t("Au loin, Avadora attendait, dissimulée dans l’obscurité."),
          i("L’aventure ne faisait que commencer.")
        ],
        messages: [
          "Et voilà comment Natsu a rejoint l’aventure. 💜",
          "L’annexe du chapitre raconte sa première découverte d’Avadora ! 📖"
        ]
      }
    ],
    annexes: [
      {
        id: "annexe-natsu-avadora",
        number: "01",
        title: "Natsu découvre Avadora",
        subtitle: "Une première nuit à bord",
        icon: "🛸",
        messages: [
          "C’est la première fois que Natsu découvre Avadora. 🛸",
          "Je crois que les hologrammes l’ont un peu perturbé au début. 👀",
          "Et pour la première fois, il n’était plus seul. 💜"
        ],
        pages: [
          {
            id: "natsu-avadora-1",
            title: "Natsu découvre Avadora",
            subtitle: "Une étrange maison",
            image: storyImages.avadora,
            imageAlt: "Avadora",
            content: [
              t("La nuit était tombée sur Draquin. Sous le ciel sombre, Avadora se matérialisa lentement, son camouflage se dissipant comme une brume qui se lève."),
              t("Sa coque lisse reflétait les faibles lueurs stellaires, parcourue de fines lignes luminescentes bleutées."),
              t("Natsu, désormais réduit à une taille plus modeste, s’immobilisa. Ses pupilles fendues observaient la structure inconnue."),
              d("natsu", "Natsu", "— Ceci… est ton territoire ? demanda-t-il d’une voix grave."),
              t("Couaxia laissa échapper un léger rire."),
              d("couaxia", "Couaxia", "— Presque. C’est ma maison.")
            ]
          },
          {
            id: "natsu-avadora-2",
            title: "Le premier pas",
            subtitle: "Entrer dans l’inconnu",
            content: [
              t("Une rampe s’ouvrit dans un souffle hydraulique doux. Une lumière intérieure chaude s’étendit sur le sol rocheux."),
              t("Natsu hésita. Il renifla l’air. Aucune odeur de proie. Aucune menace immédiate. Seulement… quelque chose de différent."),
              i("Curieux."),
              t("Il posa une griffe sur la rampe métallique. Un léger clink résonna. Son reflet apparut brièvement dans le métal poli."),
              t("Il entra.")
            ]
          },
          {
            id: "natsu-avadora-3",
            title: "À l’intérieur d’Avadora",
            subtitle: "Un monde totalement différent",
            image: storyImages.natsu,
            imageAlt: "Natsu",
            content: [
              t("L’intérieur d’Avadora contrastait totalement avec la rudesse de Draquin."),
              t("Les parois étaient courbes, organiques, presque vivantes. Des panneaux translucides diffusaient une lumière douce."),
              t("Des sphères holographiques flottaient dans l’air, affichant des cartes stellaires en rotation lente. Au centre, le poste de pilotage dominait l’espace, entouré de consoles tactiles."),
              t("Natsu tourna lentement la tête. Ses ailes frôlèrent le plafond."),
              d("natsu", "Natsu", "— Ce lieu… respire différemment, murmura-t-il.")
            ]
          },
          {
            id: "natsu-avadora-4",
            title: "Une technologie inconnue",
            subtitle: "Avadora analyse et apprend",
            content: [
              t("Couaxia s’approcha d’un panneau. Les écrans s’illuminèrent instantanément."),
              d("couaxia", "Couaxia", "— Avadora est reliée à moi. Elle analyse, apprend, s’adapte."),
              t("Un hologramme de Draquin apparut entre eux. Natsu tendit la griffe vers la projection. Sa patte traversa l’image lumineuse."),
              t("Il recula brusquement, surpris. Couaxia sourit."),
              d("couaxia", "Couaxia", "— Ce n’est qu’une projection.")
            ]
          },
          {
            id: "natsu-avadora-5",
            title: "Les étoiles",
            subtitle: "Un ciel bien plus vaste",
            content: [
              t("Le Drasquin observa ensuite les compartiments latéraux : réserves énergétiques, modules médicaux, capsules de stase et bibliothèque numérique."),
              t("Il s’arrêta devant une paroi transparente donnant sur l’espace, désormais visible à travers le champ de vision panoramique."),
              t("Les étoiles brillaient, infinies. Natsu resta silencieux."),
              i("Pour la première fois, son regard n’était ni affamé ni menaçant. Il était… émerveillé."),
              d("natsu", "Natsu", "— Le ciel… est plus vaste que Draquin."),
              d("couaxia", "Couaxia", "— Bien plus vaste. Et il peut devenir le tien aussi.")
            ]
          },
          {
            id: "natsu-avadora-6",
            title: "Vers l’infini",
            subtitle: "Le début d’un nouveau voyage",
            content: [
              t("Un léger grondement vibra dans la poitrine du Drasquin — pas un rugissement. Quelque chose de plus profond."),
              d("natsu", "Natsu", "— Alors montre-moi ces étoiles."),
              t("Couaxia prit place aux commandes. Les moteurs d’Avadora s’activèrent dans un bourdonnement grave et harmonieux. La rampe se referma."),
              t("À travers la baie panoramique, Draquin s’éloignait déjà. Natsu s’installa près du cockpit, sa queue enroulée autour de lui."),
              t("Il ne savait pas ce que l’univers lui réservait."),
              i("Mais pour la première fois, il n’était plus seul. Et l’infini s’ouvrait devant eux.")
            ]
          }
        ]
      }
    ]
  },

  {
    id: "earth",
    number: 2,
    title: "La Terre",
    subtitle: "Un nouveau monde",
    icon: "🌍",
    pages: [
      {
        id: "earth-1",
        title: "Cinq longues années",
        subtitle: "Une planète apparaît enfin",
        content: [
          i("Le voyage dura cinq longues années."),
          t("Cinq années à travers le vide spatial, les champs d’astéroïdes et les tempêtes d’énergie."),
          t("Puis enfin… une planète apparut."),
          i("Vivante. Habitée."),
          t("Avadora s’en approchait lentement, dissimulée par son camouflage. Dans la nuit de l’espace, le vaisseau passa totalement inaperçu."),
          t("Couaxia observait cette planète inconnue avec fascination. Une nouvelle aventure commençait."),
          t("Et elle ignorait encore que ce monde allait bouleverser son destin à jamais.")
        ],
        messages: [
          "Après cinq années de voyage… enfin une nouvelle planète. 🌍",
          "Et pourtant, on n’avait encore aucune idée de ce qui nous attendait."
        ]
      },
      {
        id: "earth-2",
        title: "Destination confirmée",
        subtitle: "La planète Terre",
        image: storyImages.avadora,
        imageAlt: "Avadora",
        content: [
          t("À bord d’Avadora, l’équipage avait changé. Aux côtés de Couaxia se tenaient Hylda et Cita, fidèles et inséparables. Désormais, Natsu faisait lui aussi partie du voyage."),
          d("avadora", "Avadora", "— Destination confirmée.", "— Planète classifiée : Terre."),
          t("Des océans immenses, des nuages tourbillonnants et des continents verdoyants se dressaient devant eux, formant une sphère bleue à l’horizon."),
          t("Couaxia sentit ses trois cœurs s’accélérer."),
          d("couaxia", "Couaxia", "— C’est ici… murmura-t-elle.")
        ],
        messages: [
          "Destination confirmée : Terre. 🌍",
          "À ce moment-là, tout le monde observait l’écran principal."
        ]
      },
      {
        id: "earth-3",
        title: "Une civilisation avancée",
        subtitle: "Les premières observations",
        content: [
          t("Hylda s’approcha des consoles secondaires pour affiner les relevés atmosphériques."),
          t("Cita analysait les signaux radio captés depuis la surface."),
          d("cita", "Cita", "— Activité technologique détectée.", "— Civilisation avancée."),
          t("Natsu plissa les yeux."),
          d("natsu", "Natsu", "— Ils ne ressemblent pas aux Draquins…"),
          t("Couaxia esquissa un sourire."),
          d("couaxia", "Couaxia", "— Non. Ce sont des humains.")
        ],
        messages: [
          "Une civilisation avancée… ça annonçait beaucoup de choses à découvrir.",
          "Et Natsu venait tout juste d’entendre parler des humains pour la première fois."
        ]
      },
      {
        id: "earth-4",
        title: "Des humains ?",
        subtitle: "La question de Natsu",
        image: storyImages.natsu,
        imageAlt: "Natsu",
        content: [
          d("natsu", "Natsu", "— Des humains ? Ça se mange ? demanda Natsu."),
          d("couaxia", "Couaxia", "— Mais bien sûr que non, Natsu ! s’exclama Couaxia."),
          t("Avadora activa son système de camouflage optique. L’appareil pénétra l’atmosphère terrestre dans une traînée invisible."),
          t("Les frictions embrasèrent brièvement la coque avant que les boucliers thermiques ne stabilisent la descente."),
          t("À travers la baie, les lumières des villes scintillaient dans la nuit. Des millions d’êtres vivaient là-dessous.")
        ],
        messages: [
          "Oui, la première question de Natsu était vraiment de savoir si les humains se mangeaient. 😭",
          "Je préfère préciser : aucun humain n’a été mangé."
        ]
      },
      {
        id: "earth-5",
        title: "Une planète pleine de vie",
        subtitle: "La curiosité remplace la faim",
        content: [
          t("Natsu resta silencieux."),
          d("natsu", "Natsu", "— Cette planète est pleine de vie…"),
          t("Sa voix n’exprimait plus la faim, mais de la curiosité."),
          t("Couaxia posa une main contre la vitre."),
          d("couaxia", "Couaxia", "— C’est pour ça que je suis venue."),
          t("Hylda leva les yeux de ses instruments."),
          d("hylda", "Hylda", "— Zone d’atterrissage recommandée : région isolée, forêt dense."),
          d("couaxia", "Couaxia", "— Parfait.")
        ],
        messages: [
          "Pour une fois, Natsu ne pensait même plus à manger. 👀",
          "La forêt était parfaite pour rester discrets."
        ]
      },
      {
        id: "earth-6",
        title: "Bienvenue sur Terre",
        subtitle: "Un nouveau monde",
        image: storyImages.couaxia,
        imageAlt: "Couaxia",
        content: [
          t("Avadora descendit lentement vers une vaste forêt plongée dans l’obscurité. Les arbres se courbèrent sous le souffle discret des réacteurs."),
          t("La rampe s’ouvrit dans un silence maîtrisé. L’air terrestre pénétra dans le vaisseau."),
          i("Nouveau monde."),
          i("Nouvelle civilisation."),
          i("Nouvelles connaissances."),
          t("Couaxia se tourna vers son équipage."),
          d("couaxia", "Couaxia", "— Bienvenue sur Terre."),
          t("Natsu inspira profondément."),
          d("natsu", "Natsu", "— Alors… c’est ici que commence la vraie aventure."),
          i("Dans l’ombre des arbres, une personne était déjà en train de les observer.")
        ],
        messages: [
          "Bienvenue sur Terre. 💜",
          "On pensait être seuls dans cette forêt…",
          "Quelqu’un nous observait déjà. 👀"
        ]
      }
    ],
    annexes: [
      {
        id: "annexe-forest-shadow",
        number: "02",
        title: "Dans l’ombre de la forêt",
        subtitle: "Une présence observe l’équipage",
        icon: "🌳",
        messages: [
          "Cette annexe raconte la scène du point de vue de Myo.",
          "Myo nous avait repérés bien avant qu’on la rencontre. 👀",
          "Et dire que je ne savais même pas encore qu’elle était là. 💜"
        ],
        pages: [
          {
            id: "forest-shadow-1",
            title: "Dans l’ombre de la forêt",
            subtitle: "Une présence invisible",
            image: storyImages.myo,
            imageAlt: "Myo cachée dans la forêt",
            content: [
              t("La rampe d’Avadora venait à peine de s’ouvrir que la forêt terrestre retomba dans un silence inhabituel."),
              t("Quelque part, dissimulée entre les troncs épais et les feuillages nocturnes, une présence les observait."),
              i("Myo. Une faunette."),
              t("Son corps élancé se fondait parfaitement dans la végétation. Une petite queue rousse vive et souple oscillait lentement derrière elle, trahissant sa curiosité."),
              t("Ses oreilles légèrement effilées captaient le moindre bruit : le souffle des réacteurs, le battement d’ailes discret de Natsu et les pas mesurés de Couaxia.")
            ]
          },
          {
            id: "forest-shadow-2",
            title: "Une énergie inconnue",
            subtitle: "Observer avant d’agir",
            content: [
              t("Elle n’avait jamais vu un tel vaisseau. Jamais senti une énergie aussi différente."),
              t("Ses pieds touchaient à peine le sol forestier lorsqu’elle changea d’appui. Elle se déplaçait avec grâce, presque sans bruit, comme une ombre vivante."),
              d("myo", "Myo", "— Ils ne sont pas d’ici… murmura-t-elle pour elle-même."),
              t("Ses yeux se posèrent sur Natsu. Son instinct lui criait danger."),
              t("Puis sur Couaxia."),
              i("Et là… ce n’était pas de la peur qu’elle ressentait. Mais de la fascination.")
            ]
          },
          {
            id: "forest-shadow-3",
            title: "Le début de quelque chose",
            subtitle: "Une nuit qui allait tout changer",
            content: [
              t("Les feuilles frémirent légèrement lorsque Myo fit un pas en avant, encore cachée. Elle observait, analysait."),
              i("Amis ? Envahisseurs ? Explorateurs ?"),
              t("Le vent porta jusqu’à elle une odeur inconnue, mélange d’étoiles, de métal et d’océan lointain."),
              t("Myo comprit une chose."),
              i("Cette nuit marquait un tournant."),
              t("Et elle venait de devenir témoin du début de quelque chose de bien plus grand que sa forêt et que son bus.")
            ]
          }
        ]
      }
    ]
  },

  {
    id: "hidden-market",
    number: 3,
    title: "La première rencontre",
    subtitle: "Le marché caché",
    icon: "🌙",
    pages: [
      {
        id: "hidden-market-1",
        title: "Une énergie étrange",
        subtitle: "La forêt cache quelque chose",
        content: [
          t("Après l’atterrissage, Avadora avait dissimulé sa présence à la lisière d’une vallée dense et ancienne."),
          t("Mais très vite, les capteurs de Couaxia détectèrent quelque chose d’inattendu : de nombreuses signatures de vie et surtout des énergies anormales."),
          t("Intriguée, elle décida d’explorer la zone. Accompagnée de Hylda, Cita et d’un Natsu maintenu sous sa forme réduite, elle s’enfonça dans la forêt."),
          t("Après plusieurs minutes de marche, les arbres s’écartèrent soudainement."),
          i("Devant eux s’étendait un lieu incroyable. Un marché. Mais rien d’humain.")
        ],
        messages: [
          "Le marché caché... une découverte qu’on n’avait clairement pas prévue. 🌙",
          "C’est ici que la Terre commence vraiment à devenir étrange."
        ]
      },
      {
        id: "hidden-market-2",
        title: "Le marché caché",
        subtitle: "Un monde invisible aux humains",
        content: [
          t("Des lanternes flottantes illuminaient l’air, suspendues sans support."),
          t("Des étals en bois vivant, en pierre lumineuse ou en métal ancien s’alignaient dans toutes les directions."),
          t("L’air était rempli d’odeurs inconnues : herbes magiques, potions, fruits aux couleurs impossibles."),
          t("Des dizaines d’espèces différentes circulaient entre les stands : êtres à la peau de pierre, créatures ailées, silhouettes semi-translucides, humanoïdes aux oreilles longues, aux cornes ou aux écailles."),
          d("couaxia", "Couaxia", "— Cette planète… est bien plus complexe que prévu, murmura-t-elle.")
        ],
        messages: [
          "Oui, ce marché était complètement invisible aux humains.",
          "Je crois que j’aurais pu rester des heures à observer tous les stands."
        ]
      },
      {
        id: "hidden-market-3",
        title: "Capitaine Cita",
        subtitle: "Une découverte très importante",
        content: [
          t("Pendant que Couaxia observait l’ensemble avec prudence, Cita avait déjà disparu entre les étals."),
          d("hylda", "Hylda", "— Cita… ?"),
          t("Quelques secondes plus tard, ils la retrouvèrent devant un stand particulièrement inhabituel."),
          i("« Objets humains — Technologie et divertissement »"),
          t("Sur la table : des manettes, des consoles, des écrans portables… et une pile de costumes récupérés du monde humain."),
          t("Cita tenait entre ses mains un ensemble complet de pirate, chapeau tricorne, crochet et cache-œil. Sans hésiter, elle l’enfila."),
          d("cita", "Cita", "— Capitaine Cita, prête à naviguer sur les mers numériques.")
        ],
        messages: [
          "Le moment où Cita découvre les pirates. 🏴‍☠️",
          "Les mers numériques n’étaient pas prêtes."
        ]
      },
      {
        id: "hidden-market-4",
        title: "Myo",
        subtitle: "Une faunette mystérieuse",
        image: storyImages.myo,
        imageAlt: "Myo",
        content: [
          t("À ce moment-là, un petit rire se fit entendre derrière eux."),
          t("Ils se retournèrent. La faunette rousse s’était approchée. Ses yeux pétillaient d’amusement."),
          d("myo", "Myo", "— Elle a du style, dit-elle en désignant Cita."),
          t("Puis son regard se posa sur le groupe entier. Elle les observa quelques secondes, attentive, presque analytique."),
          d("myo", "Myo", "— Vous n’êtes vraiment pas d’ici."),
          d("couaxia", "Couaxia", "— Nous explorons cette planète. Nous ne savions pas qu’un lieu comme celui-ci existait.")
        ],
        messages: [
          "Et voilà Myo. 💜",
          "Elle nous avait repérés presque immédiatement."
        ]
      },
      {
        id: "hidden-market-5",
        title: "Le Royaume Caché",
        subtitle: "Plusieurs mondes superposés",
        content: [
          d("myo", "Myo", "— C’est normal. Les humains ne peuvent pas voir cet endroit."),
          d("hylda", "Hylda", "— Un système de dissimulation ?"),
          d("myo", "Myo", "— Plutôt… une séparation. Ce marché existe dans un espace décalé. Une poche magique. Seules les créatures non humaines, ou celles possédant une certaine sensibilité, peuvent y accéder."),
          d("couaxia", "Couaxia", "— Donc cette planète abrite plusieurs mondes… superposés."),
          d("myo", "Myo", "— Exactement. Bienvenue dans le Royaume Caché.")
        ],
        messages: [
          "Le Royaume Caché... voilà pourquoi les humains ne voyaient rien.",
          "Un monde magique entier existe juste à côté du vôtre."
        ]
      },
      {
        id: "hidden-market-6",
        title: "Une vérité dissimulée",
        subtitle: "Myo ne dit pas tout",
        content: [
          d("natsu", "Natsu", "— Et toi ? Tu travailles ici ?"),
          t("Un léger éclat passa dans les yeux de Myo."),
          d("myo", "Myo", "— On peut dire ça."),
          t("Elle ne mentait pas. Mais elle ne disait pas toute la vérité non plus."),
          i("Ce royaume, ce marché et cet équilibre fragile entre les mondes lui appartenaient."),
          t("Pendant ce temps, Cita testait une manette."),
          d("cita", "Cita", "— Capitaine prête pour mission : jeu vidéo."),
          t("Myo éclata de rire. Mais quelque part, au cœur du marché, certaines présences venaient de remarquer les nouveaux arrivants."),
          i("Et toutes n’étaient pas aussi accueillantes que Myo.")
        ],
        messages: [
          "Myo disait techniquement la vérité... techniquement. 👀",
          "Certaines personnes avaient déjà commencé à nous observer."
        ]
      }
    ]
  },

  {
    id: "new-base",
    number: 4,
    title: "Une nouvelle base",
    subtitle: "Et des sentiments profonds",
    icon: "💜",
    pages: [
      {
        id: "new-base-1",
        title: "À la recherche d’un refuge",
        subtitle: "Une nouvelle maison sur Terre",
        content: [
          t("Après avoir quitté le marché et surtout Myo, Couaxia et ses compagnons reprirent leur route vers le vaisseau."),
          t("Il fallait trouver un endroit sûr pour se poser et se reposer. Le soleil commençait à se coucher et les ombres s’allongeaient sur le sol."),
          t("Couaxia suggéra de trouver un grand point d’eau."),
          t("Après quelques minutes de recherche, ils aperçurent un lac étincelant au loin, entouré de hautes falaises."),
          t("La surface de l’eau reflétait les couleurs du ciel au coucher du soleil.")
        ],
        messages: [
          "Après toutes ces découvertes, il nous fallait quand même une vraie base.",
          "Un lac entouré de falaises ? Parfait pour cacher Avadora."
        ]
      },
      {
        id: "new-base-2",
        title: "La base",
        subtitle: "Sous le lac",
        image: storyImages.avadora,
        imageAlt: "Avadora",
        content: [
          t("Couaxia fit atterrir Avadora dans l’eau, au plus profond du lac, dans une grotte souterraine afin que personne ne puisse le voir."),
          t("Elle sortit une petite capsule de sa poche et la lança dans l’eau."),
          t("La capsule déploya immédiatement un dôme de protection ainsi qu’une grande structure qui allait devenir leur maison et leur base sur Terre."),
          d("couaxia", "Couaxia", "— Voilà, notre nouvelle maison sur Terre ! On va pouvoir partir explorer demain cette planète et découvrir de nouvelles choses !")
        ],
        messages: [
          "Et voilà notre première vraie base sur Terre !",
          "Avadora caché sous un lac... personne ne devait le trouver."
        ]
      },
      {
        id: "new-base-3",
        title: "Le lever du soleil",
        subtitle: "Un moment inattendu",
        image: storyImages.myo,
        imageAlt: "Myo",
        content: [
          t("Après leur première nuit dans la base, Couaxia fut la première à se réveiller."),
          t("Elle sortit pour observer le lever du soleil et enregistra ce moment dans sa mémoire pour le garder plus tard."),
          t("Plus loin, Myo était assise sur un rocher, perdue dans ses pensées."),
          t("Couaxia s’assit à côté d’elle et lui demanda ce qu’elle faisait."),
          t("Les deux échangèrent devant le lever du soleil. Elles se racontèrent leurs histoires et se rapprochèrent peu à peu.")
        ],
        messages: [
          "Ce lever de soleil... 💜",
          "Je ne pensais vraiment pas retrouver Myo ici.",
          "C’est probablement là que quelque chose a commencé à changer."
        ]
      },
      {
        id: "new-base-4",
        title: "Histoires partagées",
        subtitle: "Deux mondes différents",
        content: [
          t("Myo lui parla de son bus, de son ami Sham, aussi aigri que drôle, et des autres personnes qu’elle avait rencontrées dans sa vie."),
          t("Couaxia lui parla de Saphira, de son peuple et de ses aventures."),
          t("Cela réchauffa le cœur de Couaxia. Elle ne savait pas encore d’où venait cette émotion en elle, mais cela ressemblait à de la joie."),
          d("myo", "Myo", "— Merci Couaxia, pour ces histoires et ce moment passé ensemble. Je ne sais pas pourquoi, mais je me sens bien avec toi.")
        ],
        messages: [
          "Myo m’a parlé de Sham ce jour-là.",
          "Je ne savais pas encore vraiment mettre un mot sur cette émotion."
        ]
      },
      {
        id: "new-base-5",
        title: "Un baiser",
        subtitle: "Une émotion nouvelle",
        image: storyImages.couaxia,
        imageAlt: "Couaxia",
        content: [
          t("Myo embrassa la joue de Couaxia et partit avec un petit sourire."),
          t("Couaxia rougit et se sentit encore plus étrangement heureuse."),
          t("Elle retourna dans la base et réveilla tout le monde."),
          d("hylda", "Hylda", "— Ma sœur, tu es bien rouge aux joues. Que t’arrive-t-il ?"),
          d("couaxia", "Couaxia", "— Ce n’est rien du tout !"),
          t("Couaxia et ses compagnons se préparèrent ensuite à partir explorer la planète et découvrir la technologie humaine.")
        ],
        messages: [
          "Oui... ce moment-là. 💜",
          "Hylda a évidemment remarqué immédiatement que quelque chose n’allait pas.",
          "Non, je n’étais pas rouge. Absolument pas. 👀"
        ]
      }
    ]
  }
];
