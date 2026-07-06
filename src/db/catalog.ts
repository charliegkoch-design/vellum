export type CatalogBook = {
  slug: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  description: string;
};

export const GENRES = [
  "Romance",
  "Fantasy",
  "Classic",
  "Memoir",
  "Sci-Fi",
  "Thriller",
] as const;

export const CATALOG: CatalogBook[] = [
  // ---- Fantasy ----
  { slug: "the-name-of-the-wind", title: "The Name of the Wind", author: "Patrick Rothfuss", year: 2007, genre: "Fantasy", description: "Kvothe — magician, musician, and legend — recounts his own myth, from a childhood in a troupe of traveling players to a university of dangerous magic." },
  { slug: "a-game-of-thrones", title: "A Game of Thrones", author: "George R.R. Martin", year: 1996, genre: "Fantasy", description: "Summers span decades, winter is coming, and noble houses tear a kingdom apart in the ruthless opening of A Song of Ice and Fire." },
  { slug: "the-hobbit", title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, genre: "Fantasy", description: "Bilbo Baggins is swept out his round green door and into a quest of dwarves, dragons, riddles in the dark, and one very consequential ring." },
  { slug: "mistborn-the-final-empire", title: "Mistborn: The Final Empire", author: "Brandon Sanderson", year: 2006, genre: "Fantasy", description: "In a world where ash falls from the sky, a street thief discovers she can burn metals for power — and joins a crew planning to overthrow an immortal emperor." },
  { slug: "the-way-of-kings", title: "The Way of Kings", author: "Brandon Sanderson", year: 2010, genre: "Fantasy", description: "On storm-blasted Roshar, a broken soldier, a scholarly heiress, and a haunted highprince converge at the start of an epic ten-book saga." },
  { slug: "piranesi", title: "Piranesi", author: "Susanna Clarke", year: 2020, genre: "Fantasy", description: "A gentle man tends an infinite house of statues and tides, keeping a journal that slowly reveals a mystery about who he really is." },
  { slug: "jonathan-strange-and-mr-norrell", title: "Jonathan Strange & Mr Norrell", author: "Susanna Clarke", year: 2004, genre: "Fantasy", description: "Two magicians revive English magic during the Napoleonic Wars — one cautious and bookish, one reckless and brilliant — in a novel disguised as history." },
  { slug: "the-fifth-season", title: "The Fifth Season", author: "N.K. Jemisin", year: 2015, genre: "Fantasy", description: "On a continent wracked by apocalyptic seismic events, a woman with forbidden power hunts for her daughter as the world ends yet again." },
  { slug: "american-gods", title: "American Gods", author: "Neil Gaiman", year: 2001, genre: "Fantasy", description: "Fresh out of prison, Shadow falls in with the enigmatic Mr. Wednesday and into a brewing war between the old gods and the new gods of America." },
  { slug: "the-priory-of-the-orange-tree", title: "The Priory of the Orange Tree", author: "Samantha Shannon", year: 2019, genre: "Fantasy", description: "A queendom without an heir, a secret mage in the court, and dragons east and west — a sweeping standalone epic of divided worlds." },

  // ---- Sci-Fi ----
  { slug: "dune", title: "Dune", author: "Frank Herbert", year: 1965, genre: "Sci-Fi", description: "Paul Atreides inherits a desert planet, its spice, its sandworms, and a destiny that will remake the universe. The best-selling science fiction novel of all time." },
  { slug: "project-hail-mary", title: "Project Hail Mary", author: "Andy Weir", year: 2021, genre: "Sci-Fi", description: "A man wakes alone on a spaceship with no memory of why — and must science his way through saving two worlds with an unforgettable ally." },
  { slug: "the-martian", title: "The Martian", author: "Andy Weir", year: 2011, genre: "Sci-Fi", description: "Stranded on Mars with disco music and a potato farm, astronaut Mark Watney wisecracks and engineers his way toward a nearly impossible rescue." },
  { slug: "enders-game", title: "Ender's Game", author: "Orson Scott Card", year: 1985, genre: "Sci-Fi", description: "Child prodigy Ender Wiggin is drafted into a brutal orbital battle school to be forged into humanity's weapon against an alien fleet." },
  { slug: "hyperion", title: "Hyperion", author: "Dan Simmons", year: 1989, genre: "Sci-Fi", description: "Seven pilgrims travel toward the Time Tombs and the creature called the Shrike, each telling the tale that brought them there — a Canterbury Tales of deep space." },
  { slug: "the-left-hand-of-darkness", title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", year: 1969, genre: "Sci-Fi", description: "An envoy to a planet of ambisexual humans must cross politics, betrayal, and a glacier to bring a world into the fold — a landmark of the genre." },
  { slug: "neuromancer", title: "Neuromancer", author: "William Gibson", year: 1984, genre: "Sci-Fi", description: "A burned-out console cowboy takes one last job in the matrix, alongside a razor-fingered mercenary, in the novel that invented cyberpunk." },
  { slug: "the-three-body-problem", title: "The Three-Body Problem", author: "Liu Cixin", year: 2008, genre: "Sci-Fi", description: "A secret military project makes contact with an alien civilization on a dying world — and factions on Earth begin choosing sides." },
  { slug: "klara-and-the-sun", title: "Klara and the Sun", author: "Kazuo Ishiguro", year: 2021, genre: "Sci-Fi", description: "An Artificial Friend with extraordinary powers of observation narrates a quietly devastating story about love, faith, and what it means to be human." },
  { slug: "a-memory-called-empire", title: "A Memory Called Empire", author: "Arkady Martine", year: 2019, genre: "Sci-Fi", description: "A new ambassador arrives at the heart of a devouring galactic empire carrying an outdated copy of her predecessor's mind — who was almost certainly murdered." },

  // ---- Classic ----
  { slug: "pride-and-prejudice", title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "Classic", description: "Elizabeth Bennet and Mr. Darcy spar, misjudge, and slowly unbend in the sharpest, most beloved comedy of manners in the language." },
  { slug: "the-great-gatsby", title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "Classic", description: "A mysterious millionaire throws glittering parties across the bay from the woman he lost, in the definitive novel of the Jazz Age and its hollow dream." },
  { slug: "to-kill-a-mockingbird", title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Classic", description: "Through Scout Finch's eyes, a small Alabama town confronts prejudice and conscience as her father defends an innocent Black man." },
  { slug: "1984", title: "1984", author: "George Orwell", year: 1949, genre: "Classic", description: "Winston Smith rewrites history for the Ministry of Truth, keeps an illegal diary, and dares to fall in love under the gaze of Big Brother." },
  { slug: "jane-eyre", title: "Jane Eyre", author: "Charlotte Brontë", year: 1847, genre: "Classic", description: "An orphaned governess with a fierce moral core falls for her brooding employer — whose house holds a locked and terrible secret." },
  { slug: "crime-and-punishment", title: "Crime and Punishment", author: "Fyodor Dostoevsky", year: 1866, genre: "Classic", description: "An impoverished student commits a murder he believes is justified, then unravels under guilt, poverty, and a detective's patient pressure." },
  { slug: "east-of-eden", title: "East of Eden", author: "John Steinbeck", year: 1952, genre: "Classic", description: "Two families reenact Cain and Abel across generations in California's Salinas Valley, hinged on one Hebrew word: timshel — thou mayest." },
  { slug: "one-hundred-years-of-solitude", title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", year: 1967, genre: "Classic", description: "Seven generations of the Buendía family rise and fall with the mythical town of Macondo in the masterpiece of magical realism." },
  { slug: "frankenstein", title: "Frankenstein", author: "Mary Shelley", year: 1818, genre: "Classic", description: "A young scientist assembles life from death and abandons his creation — who teaches himself language, philosophy, and revenge." },
  { slug: "moby-dick", title: "Moby-Dick", author: "Herman Melville", year: 1851, genre: "Classic", description: "Call him Ishmael: a whaling voyage becomes Captain Ahab's obsessive hunt for the white whale that took his leg." },

  // ---- Romance ----
  { slug: "the-seven-husbands-of-evelyn-hugo", title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", year: 2017, genre: "Romance", description: "A reclusive Hollywood icon finally tells the truth about her seven marriages — and the one great love she hid for fifty years." },
  { slug: "beach-read", title: "Beach Read", author: "Emily Henry", year: 2020, genre: "Romance", description: "A romance writer who no longer believes in love and a literary novelist stuck in a rut swap genres for a summer in neighboring lake houses." },
  { slug: "people-we-meet-on-vacation", title: "People We Meet on Vacation", author: "Emily Henry", year: 2021, genre: "Romance", description: "Best friends Poppy and Alex took a summer trip every year until one ruined everything — now she has one vacation to fix it all." },
  { slug: "red-white-and-royal-blue", title: "Red, White & Royal Blue", author: "Casey McQuiston", year: 2019, genre: "Romance", description: "The First Son of the United States and the Prince of Wales go from tabloid feud to secret correspondence to history-making romance." },
  { slug: "the-hating-game", title: "The Hating Game", author: "Sally Thorne", year: 2016, genre: "Romance", description: "Two executive assistants at war across a shared desk escalate their games of one-upmanship until hatred becomes something much more dangerous." },
  { slug: "book-lovers", title: "Book Lovers", author: "Emily Henry", year: 2022, genre: "Romance", description: "A cutthroat literary agent keeps running into a grumpy editor in a small town that feels like everyone else's happily-ever-after but hers." },
  { slug: "it-ends-with-us", title: "It Ends with Us", author: "Colleen Hoover", year: 2016, genre: "Romance", description: "Lily builds the life she dreamed of until her marriage begins echoing her parents' — a love story about the hardest choice of all." },
  { slug: "the-love-hypothesis", title: "The Love Hypothesis", author: "Ali Hazelwood", year: 2021, genre: "Romance", description: "A PhD candidate fake-dates a notoriously prickly young professor to convince her best friend she's moved on. Science ensues." },
  { slug: "normal-people", title: "Normal People", author: "Sally Rooney", year: 2018, genre: "Romance", description: "Connell and Marianne orbit each other from a small-town school to Trinity College, magnetically drawn together and painfully misaligned." },
  { slug: "outlander", title: "Outlander", author: "Diana Gabaldon", year: 1991, genre: "Romance", description: "A World War II nurse touches a standing stone and wakes in 1743 Scotland, torn between two centuries and two men." },

  // ---- Memoir ----
  { slug: "educated", title: "Educated", author: "Tara Westover", year: 2018, genre: "Memoir", description: "Raised by survivalists in the Idaho mountains and kept out of school, Westover claws her way to a PhD from Cambridge — at the cost of her family." },
  { slug: "becoming", title: "Becoming", author: "Michelle Obama", year: 2018, genre: "Memoir", description: "From the South Side of Chicago to the White House: a deeply personal account of identity, marriage, motherhood, and public life." },
  { slug: "born-a-crime", title: "Born a Crime", author: "Trevor Noah", year: 2016, genre: "Memoir", description: "Born to a Black mother and white father when that was literally illegal, Noah tells stories of apartheid South Africa that are hilarious and harrowing at once." },
  { slug: "when-breath-becomes-air", title: "When Breath Becomes Air", author: "Paul Kalanithi", year: 2016, genre: "Memoir", description: "A brilliant neurosurgeon is diagnosed with terminal cancer at thirty-six and turns his final months into a luminous meditation on what makes life worth living." },
  { slug: "the-glass-castle", title: "The Glass Castle", author: "Jeannette Walls", year: 2005, genre: "Memoir", description: "Walls recounts a nomadic childhood with a charismatic, alcoholic father and free-spirited mother — squalor, magic, and escape." },
  { slug: "kitchen-confidential", title: "Kitchen Confidential", author: "Anthony Bourdain", year: 2000, genre: "Memoir", description: "The swaggering, profane, deeply loving exposé of restaurant kitchens that made Bourdain famous and changed food writing forever." },
  { slug: "i-know-why-the-caged-bird-sings", title: "I Know Why the Caged Bird Sings", author: "Maya Angelou", year: 1969, genre: "Memoir", description: "Angelou's account of her childhood in the segregated South — trauma, silence, literature, and the voice that emerged." },
  { slug: "wild", title: "Wild", author: "Cheryl Strayed", year: 2012, genre: "Memoir", description: "Reeling from her mother's death and a broken marriage, Strayed hikes eleven hundred miles of the Pacific Crest Trail alone, wildly unprepared." },
  { slug: "crying-in-h-mart", title: "Crying in H Mart", author: "Michelle Zauner", year: 2021, genre: "Memoir", description: "The Japanese Breakfast musician grieves her Korean mother through food, memory, and the aisles of H Mart." },
  { slug: "greenlights", title: "Greenlights", author: "Matthew McConaughey", year: 2020, genre: "Memoir", description: "Fifty years of diaries, prescriptions, poems, and outlaw wisdom from Hollywood's most alright-alright-alright philosopher." },

  // ---- Thriller ----
  { slug: "gone-girl", title: "Gone Girl", author: "Gillian Flynn", year: 2012, genre: "Thriller", description: "On their fifth anniversary, Amy Dunne disappears and her husband becomes the prime suspect — then the diary starts talking." },
  { slug: "the-silent-patient", title: "The Silent Patient", author: "Alex Michaelides", year: 2019, genre: "Thriller", description: "A famous painter shoots her husband and never speaks another word; the psychotherapist obsessed with her case digs toward a staggering twist." },
  { slug: "the-girl-with-the-dragon-tattoo", title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", year: 2005, genre: "Thriller", description: "A disgraced journalist and a brilliant, damaged hacker untangle a forty-year-old disappearance inside a poisonous industrial dynasty." },
  { slug: "big-little-lies", title: "Big Little Lies", author: "Liane Moriarty", year: 2014, genre: "Thriller", description: "Three mothers, one glittering coastal school community, and a trivia night that ends with a body — told backwards from the murder." },
  { slug: "the-thursday-murder-club", title: "The Thursday Murder Club", author: "Richard Osman", year: 2020, genre: "Thriller", description: "Four retirement-village friends meet weekly to solve cold cases — until a live murder lands on their doorstep." },
  { slug: "and-then-there-were-none", title: "And Then There Were None", author: "Agatha Christie", year: 1939, genre: "Thriller", description: "Ten strangers are lured to an island and accused of murder by a gramophone record; then, one by one, they begin to die." },
  { slug: "rebecca", title: "Rebecca", author: "Daphne du Maurier", year: 1938, genre: "Thriller", description: "Last night I dreamt I went to Manderley again: a nameless bride lives in the suffocating shadow of her husband's dead first wife." },
  { slug: "the-da-vinci-code", title: "The Da Vinci Code", author: "Dan Brown", year: 2003, genre: "Thriller", description: "A murder in the Louvre, a trail of ciphers hidden in Leonardo's paintings, and a secret two millennia old — the airport thriller of the century." },
  { slug: "in-the-woods", title: "In the Woods", author: "Tana French", year: 2007, genre: "Thriller", description: "A Dublin detective investigates a child's murder in the same woods where his own childhood friends vanished — a case he cannot remember." },
  { slug: "no-country-for-old-men", title: "No Country for Old Men", author: "Cormac McCarthy", year: 2005, genre: "Thriller", description: "A hunter finds a truckload of drug money in the desert; what follows is a spare, biblical chase led by the implacable Anton Chigurh." },
];
