export type Anime = {
  slug: string;
  title: string;
  tagline: string;
  accentColor: string;
  synopsis: string;
  protagonist: {
    name: string;
    description: string;
    finalGoal: string;
  };
  antagonist: {
    name: string;
    description: string;
    finalGoal: string;
  };
  /** [letter]1 — hero image (homepage carousel) */
  heroImage: string;
  /** [letter]2 — storyline section image (detail page) */
  storylineImage: string;
  /** [letter]3 — protagonist portrait */
  protagonistImage: string;
  /** [letter]4 — antagonist portrait */
  antagonistImage: string;
};

export const ANIME: Anime[] = [
  {
    slug: "naruto",
    title: "Naruto",
    tagline: "The loudest voice in the village was the one they tried to silence.",
    accentColor: "#FF6B00",
    synopsis:
      "In a world where power is inheritance and legacy is everything, a boy with no parents and no past dares to dream of the highest seat in the land. Naruto Uzumaki carries within him a force so dangerous it nearly destroyed his village at birth — a nine-tailed demon sealed behind his ribs by a dying man's love. Rejected, mocked, and rendered invisible by a society built on bloodlines, he turns every wound into fuel and every enemy into a lesson. What begins as a child's reckless ambition slowly reveals itself to be the most precise and devastating form of willpower the shinobi world has ever witnessed.",
    protagonist: {
      name: "Naruto Uzumaki",
      description:
        "Loud, reckless, and allergic to giving up, Naruto is a paradox — the village outcast who refuses to stop loving the village. His strength does not come from talent or technique but from an almost irrational refusal to let anyone die unloved, including his enemies. Every scar he wears is a lesson he chose not to pass on to someone else.",
      finalGoal:
        "To become Hokage — not for the title, but to be seen by every person who ever looked through him.",
    },
    antagonist: {
      name: "Madara Uchiha",
      description:
        "Madara is what happens when a genius witnesses too much loss and concludes that the world itself is the wound. Once the most powerful shinobi of his era and co-founder of the Hidden Leaf, his grief curdled over decades into a god complex dressed as philosophy. He does not seek revenge — he seeks to replace reality with something he can control.",
      finalGoal:
        "To trap all of humanity inside an infinite dream where pain, choice, and consequence no longer exist.",
    },
    heroImage: "/images/n1.jpg",
    storylineImage: "/images/n2.png",
    protagonistImage: "/images/n3.jpg",
    antagonistImage: "/images/n4.jpg",
  },
  {
    slug: "bleach",
    title: "Bleach",
    tagline: "Between the living and the dead, he was the only one standing.",
    accentColor: "#00C9C8",
    synopsis:
      "The boundary between the living world and the afterlife has always been maintained in silence — until a fifteen-year-old boy with absurd spiritual pressure stumbles into a Soul Reaper's mission and absorbs her powers in a single desperate night. Ichigo Kurosaki never asked to see the dead, but once he could, he couldn't stop fighting for them. What starts as a borrowed responsibility expands into a war that stretches across dimensions, unraveling a conspiracy so deep it implicates the very gods who were supposed to keep order. The soul of every world — living, dead, and hollow — hangs in the balance.",
    protagonist: {
      name: "Ichigo Kurosaki",
      description:
        "Ichigo is fury with a moral code — a substitute Soul Reaper who fights not out of duty or destiny but because someone in front of him needs protecting. His raw power defies classification, and every time a ceiling is placed above him, he breaks through it by accident. Beneath the scowl is a boy who watched his mother die and decided, somewhere deep and wordless, that it would never happen to anyone near him again.",
      finalGoal:
        "To protect every person within arm's reach — even if arm's reach stretches across the boundaries of life and death.",
    },
    antagonist: {
      name: "Sōsuke Aizen",
      description:
        "Aizen is the most dangerous kind of villain: one who was never afraid. Calm, meticulous, and possessed of an intellect that has been running centuries ahead of everyone else, he manipulated the entire Soul Society from inside its own command structure. His power — the ability to completely dominate any mind that sees his blade — is almost secondary to the simple, devastating fact that he is almost always right.",
      finalGoal:
        "To ascend beyond the Soul King and reshape the cosmos according to his own incomprehensible design.",
    },
    heroImage: "/images/b1.png",
    storylineImage: "/images/b2.jpg",
    protagonistImage: "/images/b3.jpg",
    antagonistImage: "/images/b4.avif",
  },
  {
    slug: "one-piece",
    title: "One Piece",
    tagline: "He burned his boat. The ocean was the only way forward.",
    accentColor: "#E8372C",
    synopsis:
      "Somewhere at the end of the world's most treacherous ocean, the entirety of a dead pirate king's treasure waits for whoever is brave — or reckless — enough to reach it. Monkey D. Luffy set sail on a dinghy with no map and no crew, armed only with rubber limbs and a grin that disarms gods. What follows is not a heist or a conquest but something stranger: the gradual, violent, and frequently hilarious construction of a family from the wreckage of people the world threw away. Every island holds a new injustice, every sea a new monster, and every monster a test of whether Luffy's definition of freedom can survive contact with a world determined to crush it.",
    protagonist: {
      name: "Monkey D. Luffy",
      description:
        "Luffy is stupid like a fox — he cannot be reasoned with, manipulated, or frightened into abandoning someone he claims as his. His devil fruit turned his body to rubber, but his real power is a gravity of personality so intense that pirates, kings, and gods find themselves unable to stay neutral in his presence. He doesn't want to rule the world; he wants to be free in it, which turns out to be far more threatening to the people who do.",
      finalGoal:
        "To find the One Piece and become King of the Pirates — not for power, but for the freedom that title represents.",
    },
    antagonist: {
      name: "Im",
      description:
        "Im is the silence at the top of the World Government — a figure so thoroughly erased from history that even the Celestial Dragons who worship the system don't know what they're truly serving. Patient, ancient, and utterly without mercy, Im views the world as a garden to be pruned and has been doing so for centuries. The thing they fear most is not Luffy's strength — it's the question he keeps asking out loud: why does any of this have to be this way?",
      finalGoal:
        "To preserve the Void Century's secret and maintain total dominion over a world that has forgotten it is enslaved.",
    },
    heroImage: "/images/o1.jpg",
    storylineImage: "/images/o2.jpg",
    protagonistImage: "/images/o3.jpg",
    antagonistImage: "/images/o4.jpg",
  },
  {
    slug: "dragon-ball-z",
    title: "Dragon Ball Z",
    tagline: "Every limit was a ceiling. He turned them all into floors.",
    accentColor: "#F59E0B",
    synopsis:
      "An alien warrior raised as a human child now stands as Earth's last line of defense against a parade of conquerors, gods, and cosmic threats who arrive with the casual certainty that nothing can stop them. Goku is the paradox at the heart of Dragon Ball Z — a Saiyan bred for destruction who fights only for the joy of the contest and the love of the people around him. Each arc raises the stakes past comprehension: planets are destroyed like broken dishes, power levels incinerate stars, and gods are revealed to be as fallible and petty as the mortals who worship them. Yet at the center of every apocalypse is a man who would rather shake hands with his enemy than finish him — and somehow, that is the most dangerous thing about him.",
    protagonist: {
      name: "Son Goku",
      description:
        "Goku is not the hero Earth deserves — he is constitutionally incapable of cruelty, indifferent to wealth, and happiest when someone is hitting him hard enough that he has to think. His Saiyan bloodline means that every near-death experience literally makes him stronger, a biological mercy that turns his recklessness into a long-term survival strategy. He loves his family quietly and fighting loudly, and has never once fully understood that these two things are in tension.",
      finalGoal:
        "To face the strongest opponent in existence — and in doing so, pull himself past every boundary any being has ever reached.",
    },
    antagonist: {
      name: "Frieza",
      description:
        "Frieza is the architecture of empire made flesh — elegant, refined, and so accustomed to absolute power that cruelty has become an aesthetic preference rather than a tool. He destroyed the Saiyan home planet on a whim and spent decades ruling the universe from the comfort of a hover chair, finding the very concept of resistance mildly entertaining. His obsession with Goku is the one crack in the porcelain: the first person who ever made him feel something adjacent to fear.",
      finalGoal:
        "To reclaim his dominance over the universe and erase the humiliation of every defeat from the cosmic record.",
    },
    heroImage: "/images/d1.jpg",
    storylineImage: "/images/d2.jpg",
    protagonistImage: "/images/d3.jpg",
    antagonistImage: "/images/d4.jpg",
  },
  {
    slug: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    tagline: "He swallowed a finger. Now death follows him like a debt.",
    accentColor: "#7C3AED",
    synopsis:
      "In a world where negative human emotion condenses into monstrous creatures called Curses, a secret society of sorcerers wages an invisible war to keep the living from being consumed. Yuji Itadori was a normal boy with abnormal strength until the night he swallowed a rotted finger to save his classmates — and woke up as the host body of Ryomen Sukuna, the most catastrophic cursed spirit in history. Now branded for execution the moment his usefulness ends, Yuji fights inside a system that sees him as both weapon and condemned, determined to give every person he meets a proper death before he faces his own. The world of jujutsu is merciless, its rules are cruel, and Yuji is the only one smiling.",
    protagonist: {
      name: "Yuji Itadori",
      description:
        "Yuji hits with the force of a natural disaster and grieves with the depth of someone twice his age — a contradiction that defines him. He chose to eat Sukuna's finger not out of heroism but out of a refusal to let someone else pay the price for his hesitation, and he has been making that same choice in every subsequent battle. His grandfather's dying words — that he should die surrounded by people — have become both his mission statement and his tragedy.",
      finalGoal:
        "To consume all of Sukuna's fingers, ensuring the King of Curses dies with him rather than being unleashed on the world.",
    },
    antagonist: {
      name: "Ryomen Sukuna",
      description:
        "Sukuna is not evil in any comprehensible sense — he simply operates from a plane of power so absolute that concepts like mercy or morality read to him as aesthetic choices made by the weak. The King of Curses predates the jujutsu system itself, and his return is less a threat than a reckoning: proof that the order built to contain darkness never understood darkness at all. He finds Yuji faintly amusing, which is the most terrifying thing anyone has ever said about someone.",
      finalGoal:
        "To be fully resurrected and remake the world according to a vision of pure, ungoverned power — a paradise of carnage.",
    },
    heroImage: "/images/j1.jpg",
    storylineImage: "/images/j2.jpg",
    protagonistImage: "/images/j3.jpg",
    antagonistImage: "/images/j4.jpg",
  },
  {
    slug: "demon-slayer",
    title: "Demon Slayer",
    tagline: "He couldn't save his sister from becoming a demon. So he became her sword.",
    accentColor: "#E11D48",
    synopsis:
      "On a frozen morning, Tanjiro Kamado returns home to find his family massacred and his sister Nezuko transformed into the very creature that destroyed them. In a world where demons are hunted to extinction and their human victims are simply collateral, this is supposed to be the end of the story. Instead, Tanjiro does the unreasonable thing: he straps his sister to his back, joins the organization that would kill her, and walks into darkness to find the one demon responsible. What unfolds is a story of impossible beauty set against bottomless brutality — a boy whose kindness is so genuine it confuses his enemies into hesitation.",
    protagonist: {
      name: "Tanjiro Kamado",
      description:
        "Tanjiro is the rarest thing in a world hardened by grief — someone who can weep for the monsters trying to kill him because he sees the human they used to be. His Water Breathing and later Hinokami Kagura are powerful, but his true weapon is an emotional intelligence that disarms demons who have not been treated as people in centuries. He carries his sister and his dead family with equal steadiness, and his back has never once bent under either weight.",
      finalGoal:
        "To cure Nezuko's demonhood and destroy Muzan Kibutsuji — the first and last demon, and the origin of every family's ruin.",
    },
    antagonist: {
      name: "Muzan Kibutsuji",
      description:
        "Muzan is a thousand years old and still afraid of dying, which has made him extraordinarily creative about who else has to die instead. The progenitor of all demons, he moves through the modern world in disguise — a family man on a Tuesday, an extinction event on the weekend. His power is absolute and his patience geological; he has spent a millennium eliminating every threat to his immortality with the calm efficiency of someone pulling weeds.",
      finalGoal:
        "To achieve complete immortality by conquering his one remaining weakness: sunlight.",
    },
    heroImage: "/images/ds1.jpg",
    storylineImage: "/images/ds2.jpg",
    protagonistImage: "/images/ds3.jpg",
    antagonistImage: "/images/ds4.png",
  },
  {
    slug: "blue-lock",
    title: "Blue Lock",
    tagline: "There is no team. There is only the striker who survives.",
    accentColor: "#2563EB",
    synopsis:
      "After Japan's latest World Cup humiliation, the Japan Football Union makes a decision so radical it borders on villainy: gather the top three hundred strikers in the country, lock them in a facility, and eliminate them one by one until only the single most selfish, most lethal forward remains. Yoichi Isagi enters Blue Lock as a boy who played for his team — he will leave as something different, or not at all. Inside the facility, football becomes philosophy: a brutal interrogation of ego, talent, and the terrifying question of whether being the best requires destroying every instinct toward compassion. The beautiful game has never looked this ugly or felt this true.",
    protagonist: {
      name: "Yoichi Isagi",
      description:
        "Isagi's gift is not speed or strength but spatial intelligence — the ability to read a game like a circuit board and find the current no one else sees. He entered Blue Lock believing in teammates and exits each round believing in something harder and more honest: that the player who waits for permission to be great will never be. His evolution is the coldest kind of coming-of-age, and every match peels another layer of sentiment away to reveal something ruthless underneath.",
      finalGoal:
        "To become the world's greatest striker — not the kind the system produces, but the kind that makes the system obsolete.",
    },
    antagonist: {
      name: "Jinpachi Ego",
      description:
        "Ego is the most dangerous kind of visionary: one who is completely, clinically right. The architect of Blue Lock, he designed a program so brutal it borders on psychological warfare — not out of cruelty, but out of a cold certainty that the world's greatest striker can only be forged by destroying everything soft inside a player first. He watches three hundred boys tear each other apart with the detached satisfaction of a man who already knows how the experiment ends. His contempt for mediocrity is not personal — it's philosophical.",
      finalGoal:
        "To manufacture a striker so ruthlessly individual that he shatters the Japanese football psyche and wins the World Cup through pure, weaponized ego.",
    },
    heroImage: "/images/bl1.jpg",
    storylineImage: "/images/bl2.webp",
    protagonistImage: "/images/bs3.png",
    antagonistImage: "/images/bs4.jpg",
  },
  {
    slug: "one-punch-man",
    title: "One Punch Man",
    tagline: "He trained until he lost his hair. Then he lost the ability to feel anything at all.",
    accentColor: "#FBBF24",
    synopsis:
      "Saitama wanted to be a hero, so he trained for three years until every monster fell in one punch — and in doing so, accidentally destroyed the one thing that made him feel alive. In a world drowning in catastrophe, where S-Class heroes battle city-leveling threats and monster associations plot human extinction, the most powerful being alive is a bald man in a discount cape who can't find a worthy opponent. One Punch Man is the world's most elaborate joke about the cost of achieving what you wanted: the apocalypse arrives weekly, the hero defeats it instantly, and he goes home to read manga alone. Beneath the comedy is something genuinely melancholic — the portrait of a man who became a god and forgot how to be a person.",
    protagonist: {
      name: "Saitama",
      description:
        "Saitama is power stripped of all drama — every fight ends in one punch, every villain's final monologue dies on impact, and he stands there afterward looking slightly disappointed. He wanted to be a hero for fun, achieved it absolutely, and now finds himself in the absurd position of being the strongest entity in existence while shopping for groceries on a budget. His real struggle is invisible: the quiet, persistent despair of a man who cannot find a challenge in a world full of things trying to kill him.",
      finalGoal:
        "To feel something again — to find a single opponent who makes his heart race the way it did before the strength arrived.",
    },
    antagonist: {
      name: "Garou",
      description:
        "Garou is a hero-hunter who fell in love with the idea of monsters: those rejected, feared, and destroyed by the society that claims to protect everyone. His technique is perfect — a martial art that evolves in real time by analyzing and countering every style that attempts to stop him — and his ideology is a wound dressed as a philosophy. He doesn't want to destroy humanity; he wants to become the threat so terrible that humanity is forced to unite, which is, in its own catastrophic way, almost compassionate.",
      finalGoal:
        "To become the absolute evil that frightens humanity into peace — the monster that inadvertently saves the world.",
    },
    heroImage: "/images/op1.jpg",
    storylineImage: "/images/op2.jpg",
    protagonistImage: "/images/op3.png",
    antagonistImage: "/images/op4.jpg",
  },
  {
    slug: "death-note",
    title: "Death Note",
    tagline: "A god needs only a name. He had a notebook full of them.",
    accentColor: "#DC2626",
    synopsis:
      "A bored, brilliant high school student finds a notebook that kills anyone whose name is written inside it, and within a week has decided to use it to build a new world with himself as its god. Light Yagami's campaign begins as justice — or at least as a convincing impression of it — and accelerates through moral compromise, calculated murder, and the systematic elimination of anyone who gets close to the truth. The pursuit that follows is the greatest detective story ever told: a war between two geniuses who cannot meet face to face, where every move is played three steps ahead and the board is made of human lives. The question Death Note never stops asking is the one Light never thinks to ask himself: what is left of a person when they've burned through every boundary that made them one?",
    protagonist: {
      name: "Light Yagami",
      description:
        "Light is the most dangerous thing a death wish can produce when given to a prodigy: absolute conviction dressed as righteousness. He begins with a genuine disgust for the world's capacity for cruelty and the notebook's impossible promise of accountability, and somewhere between the first name written and the thousandth, the idealism becomes indistinguishable from narcissism. He is charming, meticulous, and fully aware that he is the most intelligent person in any room — which makes him almost impossible to stop and entirely blind to himself.",
      finalGoal:
        "To kill every criminal on earth, crown himself the god of the new world, and rule a humanity cleansed by his judgment.",
    },
    antagonist: {
      name: "L",
      description:
        "L is a ghost who eats cake — a detective of such legendary capability that he has no name, no face, and no country, only a succession of cases that no one else could solve and a sweet tooth that never quits. He identifies Light as Kira within days of the investigation opening and spends the remainder of the series maneuvering a trap around someone who can kill with a name, armed with nothing but logic and an unusual sitting posture. What makes L terrifying is that he is Light's only true equal, and what makes him tragic is that he knows it.",
      finalGoal:
        "To expose Kira, prove that justice cannot be wielded by a single human judgment, and close the case — even if it kills him.",
    },
    heroImage: "/images/dn1.jpg",
    storylineImage: "/images/dn2.jpg",
    protagonistImage: "/images/dn3.jpg",
    antagonistImage: "/images/dn4.jpg",
  },
  {
    slug: "tokyo-revengers",
    title: "Tokyo Revengers",
    tagline: "He traveled through time to save her. He didn't know saving her would cost everything else.",
    accentColor: "#F97316",
    synopsis:
      "Takemichi Hanagaki is twenty-six years old, unemployed, and so thoroughly beaten down by life that the news of his first girlfriend's murder barely surprises him — then he falls onto a train track and wakes up twelve years in the past. Time travel in Tokyo Revengers is not a gift; it's a sentence. Each leap back reveals that the violent gang world of his adolescence is more intricately connected to the present's grief than any single intervention can fix, and every time Takemichi saves one person, he discovers three more he didn't know were already lost. This is a story about powerlessness and persistence — about a boy who cries more than any protagonist has a right to and keeps walking forward anyway, because the alternative is letting the people he loves stay dead.",
    protagonist: {
      name: "Takemichi Hanagaki",
      description:
        "Takemichi is not strong, not clever, and not particularly lucky — what he has is an absolute, almost pathological refusal to accept that the people he cares about are gone. He leaps back to the Tokyo of his teenage years with nothing but knowledge of the future and a face that absorbs punishment like a philosophy. His tears are not weakness; in a world of posturing delinquents, the boy who cries and gets back up is the most confounding thing any of them have ever faced.",
      finalGoal:
        "To rewrite the future and pull Hinata Tachibana — and everyone else he loves — out of a timeline soaked in grief.",
    },
    antagonist: {
      name: "Tetta Kisaki",
      description:
        "Kisaki is the series' most chilling answer to the question of what drives a man: not power or survival, but a single obsession, pursued with the patience and lethality of a professional. Brilliant, unremarkable in appearance, and carrying a specific grievance he has weaponized into a decades-long strategy, he moves through the gang world like a programmer rewriting code — inserting himself into every power structure until the outcome he wants becomes structurally inevitable. He is dangerous not because he is strong but because he is the only person in the room who is always thinking further ahead.",
      finalGoal:
        "To possess Hinata by destroying every future in which Takemichi can save her — making the tragedy permanent and himself indispensable to it.",
    },
    heroImage: "/images/t1.jpg",
    storylineImage: "/images/t2.jpg",
    protagonistImage: "/images/t3.jpg",
    antagonistImage: "/images/t4.avif",
  },
  {
    slug: "spy-x-family",
    title: "Spy × Family",
    tagline: "None of them chose this family. All of them would die for it.",
    accentColor: "#EC4899",
    synopsis:
      "A cold war spy who has spent a career being no one in particular receives his most impossible assignment: acquire a wife, enroll a child in an elite school, and infiltrate a target's social circle — all within a week. What follows is the world's most dysfunctional domestic arrangement: Loid Forger adopts a girl who can secretly read minds, enters a sham marriage with a woman who is secretly an assassin, and presents the whole arrangement to the world as a perfectly normal family. The cosmic joke is that Anya, who knows everything they're hiding, is the only one who sees what the three of them are actually becoming. Spy × Family is an action-comedy that keeps sneaking genuine warmth past your defenses, which is either irony or the point.",
    protagonist: {
      name: "Loid Forger (Codename: Twilight)",
      description:
        "Twilight is the spy's spy — a man who has erased himself so thoroughly in service of his country that he no longer has a preference, a memory, or a home to return to. He approaches Operation Strix with the same clinical efficiency he applies to everything, only to discover that a six-year-old telepath with a peanut obsession cannot be optimized away. He tells himself the warmth he feels is cover; the reader, and eventually Loid himself, suspects otherwise.",
      finalGoal:
        "To complete Operation Strix, prevent a war between nations — and quietly, accidentally, become the father he is pretending to be.",
    },
    antagonist: {
      name: "Donovan Desmond",
      description:
        "Desmond is the still center of everything the series is building toward: a political leader of extraordinary influence whose ideology, if unchecked, will drag two nations into a war that will swallow generations. He is cold, controlled, and so armored by status that the spy infrastructure of an entire nation cannot reach him through conventional means — only through the laughter of a child at a school social. He is not a monster who knows he is a monster; he is a man who has confused his power for righteousness, which is always the more durable kind of evil.",
      finalGoal:
        "To consolidate political power and pursue a nationalistic agenda that will reignite war between Westalis and Ostania.",
    },
    heroImage: "/images/s1.webp",
    storylineImage: "/images/s2.jpg",
    protagonistImage: "/images/s3.jpg",
    antagonistImage: "/images/s4.jpg",
  },
];

// Legacy field aliases for components that use the old shape
export type AnimeWithLegacy = Anime & {
  accent: string;
  accentSoft: string;
  image: string;
};

export const ANIME_EXTENDED = ANIME.map((a) => ({
  ...a,
  accent: a.accentColor,
  accentSoft: a.accentColor + "99",
  image: a.heroImage,
})) satisfies AnimeWithLegacy[];
