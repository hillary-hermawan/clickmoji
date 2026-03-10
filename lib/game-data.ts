import { Headline, Ad, Stock, Weather, GameOverHeadline } from "@/types/game";

export const CL: Headline[][] = [
  [
    { h: "I Quit My Job To Become A Dog Influencer And Now I Have No Friends", e: ["🐕", "📸", "👔", "💔", "😞"] },
    { h: "I Let My Cat Make All My Financial Decisions For A Year And We Lost Everything", e: ["🐱", "💰", "📉", "😰", "💀"] },
    { h: "I Only Communicated In Emojis For A Week And My Therapist Quit", e: ["💬", "😶", "📅", "👩‍⚕️", "🚪"] },
    { h: "I Spent A Year Saying Yes To Everything And Now I Own Three Timeshares", e: ["✅", "📅", "😬", "🏖️", "💸"] },
    { h: "I Tried Living Like A Victorian For A Month And I Have Rickets Now", e: ["🎩", "📅", "🕯️", "🦴", "😩"] },
    { h: "I Wore The Same Outfit For A Month And No One Noticed Including My Wife", e: ["👕", "📅", "👁️", "❌", "😶"] },
    { h: "I Deleted All Social Media And Now I Just Stare At Walls Competitively", e: ["📱", "🗑️", "🧱", "👀", "🏆"] },
    { h: "I Adopted A Minimalist Lifestyle And Now I Sleep On The Floor By Choice", e: ["🛏️", "❌", "🧘", "😌", "🪵"] },
    { h: "I Started A Gratitude Journal And Now I Resent Everything I Write Down", e: ["📓", "🙏", "😤", "✍️", "💢"] },
    { h: "I Took A Pottery Class To Find Myself And Lost $3000 Instead", e: ["🏺", "🔍", "💸", "😩", "🤷"] },
    { h: "I Moved To The Countryside For Peace And The Roosters Wake Up At 4am", e: ["🏡", "🌾", "🐓", "⏰", "😫"] },
    { h: "I Did A Digital Detox And Missed My Own Surprise Birthday Party", e: ["📵", "🎂", "😲", "🎉", "😢"] },
    { h: "I Let An AI Plan My Entire Wedding And It Booked A Clown Instead Of A DJ", e: ["🤖", "💒", "🤡", "🎵", "😱"] },
  ],
  [
    { h: "27 Signs You're Definitely A Millennial And You're Probably Crying About It", e: ["📱", "☕", "💀", "💸", "😭"] },
    { h: "Gen Z Is Killing The Napkin Industry And Honestly Boomers Have A Point", e: ["🧻", "📉", "👴", "😤", "✅"] },
    { h: "Millennials Are Finally Buying Houses And Somehow This Is Also Bad News", e: ["🏠", "😬", "💸", "📰", "😭"] },
    { h: "Gen Z Refuses To Use Email And Now The Entire Economy Is Collapsing", e: ["📧", "❌", "📉", "💀", "🤷"] },
    { h: "Gen Alpha Has Invented A New Language And Linguists Are Openly Weeping", e: ["👶", "🗣️", "❓", "📖", "😭"] },
    { h: "Millennials Now Spending More On Oat Milk Than Rent According To Study Nobody Asked For", e: ["🥛", "💸", "🏠", "📊", "🤷"] },
    { h: "Gen Z Worker Asks For Feedback And Manager Needs Three Days To Recover", e: ["💼", "📝", "😰", "🛏️", "📅"] },
    { h: "Boomers Discover Group Chat And Now Nobody Can Silence Their Phone", e: ["👴", "💬", "📱", "🔔", "😫"] },
    { h: "Millennial Explains What A Meme Is To Their Parents For The 400th Time", e: ["🧑", "📱", "👨‍👩‍👦", "❓", "😮‍💨"] },
    { h: "Gen Z Invents New Slang Word That Becomes Obsolete Before Article Is Published", e: ["🗣️", "✨", "📰", "⏰", "💀"] },
    { h: "Study Finds Every Generation Thinks They Had The Hardest Childhood And All Are Wrong", e: ["👶", "📊", "😤", "❌", "🤝"] },
    { h: "Gen Alpha Refuses To Learn Cursive Because Quote Keyboards Exist", e: ["👶", "✍️", "❌", "⌨️", "🤷"] },
    { h: "Millennials Blame Avocado Toast While Eating Avocado Toast And Crying", e: ["🥑", "🍞", "😭", "💸", "🤦"] },
  ],
  [
    { h: "The Government Has Been Lying About How Many Holes Are In A Cracker", e: ["🫙", "🏛️", "🕵️", "🤯", "🔍"] },
    { h: "Scientists Confirm Your Coworker Who Microwaves Fish Is Actually A Sociopath", e: ["🐟", "🔬", "🏢", "😈", "⚗️"] },
    { h: "Apparently You've Been Breathing Wrong Your Entire Life And We're Sorry", e: ["💨", "😲", "😔", "📋", "❌"] },
    { h: "Doctors Reveal The One Food That Is Somehow Both Killing You And Saving You", e: ["🍎", "👨‍⚕️", "💀", "✅", "😵"] },
    { h: "Researchers Discover Your Phone Screen Has More Bacteria Than A Hospital Floor", e: ["📱", "🦠", "🏥", "🔬", "🤢"] },
    { h: "New Report Confirms That One Guy In Your Office Who Never Gets Sick Is Actually A Robot", e: ["🏢", "🤖", "🔬", "💪", "😮"] },
    { h: "Study Reveals Houseplants Can Hear You Talking And They Are Judging You", e: ["🌿", "👂", "🗣️", "😒", "📊"] },
    { h: "NASA Confirms The Moon Has Been Slowly Ghosting Earth For Millions Of Years", e: ["🌙", "🚀", "💔", "📏", "😔"] },
    { h: "Scientists Accidentally Create New Color And It Is Deeply Unsettling", e: ["🔬", "🎨", "😱", "👁️", "❓"] },
    { h: "Psychologists Confirm That Saying Fine When Asked How You Are Is Never True", e: ["🧠", "😐", "🗣️", "❌", "📋"] },
    { h: "Study Finds Dogs Can Smell Disappointment And Yours Smells Terrible", e: ["🐕", "👃", "😞", "📊", "💀"] },
    { h: "Researchers Prove Yawning Is Contagious Even Through Text And We're Sorry", e: ["🥱", "📱", "🔬", "😴", "🤷"] },
    { h: "New Study Says Sitting Is The New Smoking And Standing Is The New Sitting", e: ["🪑", "🚬", "🧍", "🔄", "📊"] },
  ],
  [
    { h: "10 Airbnbs So Remote You Will Almost Certainly Be Murdered There", e: ["🏡", "🌲", "🗺️", "🔪", "😬"] },
    { h: "This Couple Quit Everything To Live In A Van And Now They Both Miss Toilets", e: ["🚐", "💑", "🌅", "🚽", "😩"] },
    { h: "We Ranked Every Country By How Quickly You Would Die There Without Wi-Fi", e: ["🌍", "📶", "❌", "⏳", "💀"] },
    { h: "Tourist Follows Google Maps Into A Lake And Gives It One Star", e: ["🗺️", "🚗", "🌊", "⭐", "😤"] },
    { h: "Airline Introduces Standing Room Flights And Calls It Premium Vertical Seating", e: ["✈️", "🧍", "💺", "💎", "😐"] },
    { h: "Hotel Charges $50 For Breakfast Buffet That Is Just Bread And Audacity", e: ["🏨", "🍞", "💸", "😤", "🫠"] },
    { h: "Travel Influencer Describes Airport Lounge As Life Changing And We Have Questions", e: ["✈️", "📸", "🛋️", "🤔", "❓"] },
    { h: "Cruise Ship Passenger Gets Lost For Three Days And No One Notices", e: ["🚢", "🗺️", "❌", "📅", "😶"] },
    { h: "Budget Airline Now Charging Extra For Oxygen On Flights Over Four Hours", e: ["✈️", "💸", "💨", "⏰", "😤"] },
    { h: "Man Plans Entire Vacation Around Restaurant Reservations And Nothing Else", e: ["🍽️", "📅", "✈️", "📋", "🤤"] },
    { h: "Resort Advertises Unplugged Experience Then Charges For Wi-Fi Separately", e: ["🏖️", "📵", "📶", "💸", "😑"] },
    { h: "Woman Returns From Vacation More Exhausted Than Before She Left", e: ["✈️", "🏖️", "😫", "🛏️", "📉"] },
    { h: "Guidebook Recommends Hidden Gem Restaurant That Now Has A Four Hour Wait", e: ["📖", "🍽️", "💎", "⏰", "😩"] },
  ],
  [
    { h: "My Husband Left Me For Someone He Met At A Bread-Making Class And I'm Not Even Mad", e: ["🍞", "💑", "💔", "😐", "🤷"] },
    { h: "This Dating App Matched Me With My Own Father And Other Horror Stories", e: ["📱", "❤️", "👨", "😱", "🤖"] },
    { h: "Man Proposes At His Ex's Wedding And Claims It Was A Coincidence", e: ["💍", "💒", "😤", "🤥", "👀"] },
    { h: "Couple Survives 30 Days In The Wilderness And Breaks Up In The Parking Lot After", e: ["🌲", "💑", "✅", "🚗", "💔"] },
    { h: "Man Says I Love You For The First Time During An Argument About Dishes", e: ["❤️", "🗣️", "😤", "🍽️", "😬"] },
    { h: "Dating Expert Says You Should Be Yourself Then Lists 47 Things To Change", e: ["❤️", "📝", "🪞", "😬", "📋"] },
    { h: "Woman Goes On 100 First Dates In A Year And Writes A Book Nobody Buys", e: ["💑", "💯", "📅", "📖", "😶"] },
    { h: "Couple Celebrates Anniversary By Having The Same Argument They Had Last Year", e: ["🎂", "💑", "🗣️", "🔄", "😤"] },
    { h: "Man Creates Spreadsheet To Track Dating Life And Gets Dumped For It", e: ["📊", "❤️", "💻", "💔", "😬"] },
    { h: "Therapist Suggests Couple Try Active Listening And Both Immediately Fall Asleep", e: ["👩‍⚕️", "💑", "👂", "😴", "🛋️"] },
    { h: "Best Friend Gives Brutally Honest Wedding Toast And Reception Goes Silent", e: ["🥂", "💒", "😬", "🤐", "😱"] },
    { h: "Online Dating Profile Says Loves Hiking But Has Never Seen A Mountain In Person", e: ["📱", "🥾", "⛰️", "❌", "🤥"] },
  ],
  [
    { h: "Apparently You've Been Eating Spaghetti Wrong Your Entire Life And We're Sorry", e: ["🍝", "❌", "😲", "😔", "🤌"] },
    { h: "This Restaurant Charges $400 For A Sandwich And Has A Three Year Wait List", e: ["🥪", "💸", "⏳", "📋", "😤"] },
    { h: "The Internet Cannot Decide Whether This Meal Is Breakfast Or A Cry For Help", e: ["🍳", "❓", "🌐", "😬", "🆘"] },
    { h: "Food Blogger Spends 4000 Words Describing Their Childhood Before Getting To The Recipe", e: ["📝", "👶", "📜", "😤", "🍰"] },
    { h: "Man Brings His Own Hot Sauce To Five Star Restaurant And Chef Quits On The Spot", e: ["🌶️", "🍽️", "⭐", "👨‍🍳", "🚪"] },
    { h: "New Trendy Diet Requires You To Only Eat Foods That Start With The Letter Q", e: ["🍽️", "❓", "📋", "🤔", "😩"] },
    { h: "Sourdough Starter Now Has More Followers On Instagram Than Its Owner", e: ["🍞", "📱", "📈", "😐", "🤳"] },
    { h: "Local Cafe Charges $18 For Toast And Describes It As A Bread Experience", e: ["☕", "🍞", "💸", "✨", "😤"] },
    { h: "Meal Kit Service Sends 47 Packets Of Sauce For A Recipe That Needs Two", e: ["📦", "🥫", "📋", "🤯", "🗑️"] },
    { h: "Restaurant Puts Edible Flowers On Everything Including The Bill", e: ["🍽️", "🌸", "💸", "📋", "🤨"] },
    { h: "Man Orders Coffee Black And Barista Stares At Him Like He Committed A Crime", e: ["☕", "😐", "👁️", "😤", "🚨"] },
    { h: "Farmers Market Sells Single Heirloom Tomato For The Price Of A Used Car", e: ["🍅", "🧑‍🌾", "💸", "🚗", "😱"] },
  ],
  [
    { h: "We Ranked Every Taylor Swift Album And Yes We Will Be Accepting Lawsuits", e: ["🎵", "📊", "👑", "⚖️", "😤"] },
    { h: "Someone Calculated How Much Money Squid Game Contestants Made Per Hour", e: ["🦑", "💰", "🧮", "😬", "⏱️"] },
    { h: "We Watched All 847 Episodes Of Grey's Anatomy In One Week For Your Benefit", e: ["📺", "🏥", "📅", "💀", "🫡"] },
    { h: "Celebrity Spotted Looking Completely Normal And The Nation Is Unsettled", e: ["⭐", "😐", "📸", "😱", "🏙️"] },
    { h: "New Netflix Show Has 97 Percent Rating But Everyone Who Watched It Is Fine", e: ["📺", "🌟", "😐", "✅", "🤷"] },
    { h: "Award Show Nobody Asked For Announces Categories Nobody Understands", e: ["🏆", "❓", "📋", "🤔", "😐"] },
    { h: "Movie Sequel Nobody Wanted Breaks Box Office Record And Critics Are Furious", e: ["🎬", "2️⃣", "💰", "📊", "😤"] },
    { h: "Podcast Host Discovers Microphone Was Off For First 200 Episodes", e: ["🎙️", "🔇", "📅", "😱", "💀"] },
    { h: "Book Club Hasn't Read A Book In Three Years But Snacks Have Improved Dramatically", e: ["📖", "❌", "🍿", "📈", "😋"] },
    { h: "Reality TV Show Accidentally Films Something Real And Everyone Panics", e: ["📺", "😱", "🎥", "😰", "🚨"] },
    { h: "Streaming Service Cancels Show With 100 Percent Audience Score Out Of Spite", e: ["📺", "❌", "💯", "😤", "💀"] },
    { h: "Influencer With Zero Talent Wins Major Award And Nobody Is Surprised Anymore", e: ["📱", "🏆", "🤷", "😐", "📸"] },
  ],
  [
    { h: "I Quit My Corporate Job To Sell Candles And Now I Work 90 Hours A Week", e: ["🕯️", "💼", "😮‍💨", "⏰", "💀"] },
    { h: "This CEO Wakes Up At 3am Every Day And Is Deeply Unpleasant To Be Around", e: ["⏰", "👔", "😤", "☕", "💀"] },
    { h: "Man Turns Passion Into Career And Reports That Passion Is Now Destroyed", e: ["❤️", "💼", "💔", "📉", "😶"] },
    { h: "New Study Finds Open Plan Offices Cause The Same Stress As Active Combat", e: ["🏢", "😤", "🪖", "📊", "💥"] },
    { h: "Tech Startup Offers Unlimited Vacation And Zero Employees Have Taken Any", e: ["🏖️", "✅", "💼", "📊", "0️⃣"] },
    { h: "Manager Schedules Meeting To Discuss Why There Are Too Many Meetings", e: ["📅", "🗣️", "🔄", "😩", "💼"] },
    { h: "Company Rebrand Takes 18 Months And The Logo Is Just Slightly More Blue", e: ["🏢", "🎨", "📅", "🔵", "🤦"] },
    { h: "Intern Accidentally Replies All To Entire Company With Just The Word No", e: ["📧", "👤", "🏢", "❌", "😱"] },
    { h: "Employee Of The Month Hasn't Been Seen In The Office Since March", e: ["🏆", "👻", "🏢", "📅", "🤔"] },
    { h: "LinkedIn Post About Failure Gets More Likes Than Actual Accomplishment", e: ["💼", "📉", "👍", "📈", "🤷"] },
    { h: "Team Building Exercise Destroys Last Remaining Shred Of Team Spirit", e: ["🤝", "💔", "🏢", "😐", "💀"] },
    { h: "New Hire Finishes Onboarding Paperwork Just In Time For Layoffs", e: ["📋", "✅", "👤", "📉", "😱"] },
  ],
];

export const ALL: Headline[] = CL.flat();

export const ADS: Ad[] = [
  { cat: "ADVERTISEMENT", t: "Artisanal Silence — Now Available in Jars", sub: "Hand-harvested from a monastery in Provence. $340/oz. Free shipping over $2,000.", em: "🤫🏺", cta: "Shop silence" },
  { cat: "ADVERTISEMENT", t: "Bespoke Anxiety, Tailored to You", sub: "Why settle for generic dread? Our master craftsmen create worry unique to your circumstances. Est. 1847.", em: "🧵😰", cta: "Browse dread" },
  { cat: "ADVERTISEMENT", t: "The Helvetica Wristwatch", sub: "It doesn't tell time. It implies it. Starting at $12,400.", em: "⌚✨", cta: "Imply now" },
  { cat: "ADVERTISEMENT", t: "Premium Hand-Sorted Oxygen", sub: "Each molecule individually inspected. \"Breathing has never felt so intentional.\" — subscriber", em: "💨🔬", cta: "Breathe better" },
  { cat: "CLASSIFIEDS", t: "SEEKING: One (1) Sense of Purpose", sub: "Condition: new or gently used. Previous owner pivoted to crypto. Will pay up to $12.99.", em: "🧠💸", cta: "Inquire within" },
  { cat: "CLASSIFIEDS", t: "FOR SALE: Antique Attention Span (c. 2005)", sub: "Capable of reading an entire article without checking phone. Collector's item. $8,400 OBO.", em: "🧠⏱️", cta: "Place a bid" },
  { cat: "ADVERTISEMENT", t: "Estate-Bottled Disappointment", sub: "Notes of overtime, cold coffee, and unreturned calls. 94 points — Wine Spectator.", em: "🍷😩", cta: "Order a case" },
  { cat: "REAL ESTATE", t: "LUXURY 1BR — $4,200/mo", sub: "Charming 340 sq ft. Exposed everything. \"Character.\" Doorman judges you silently. No pets, no cooking, no joy.", em: "🏢🔑", cta: "Schedule tour" },
  { cat: "ADVERTISEMENT", t: "The Ottolenghi Doorstop", sub: "A cookbook so beautiful you will never open it. Display edition. Gilt edges. $85.", em: "📖✨", cta: "Add to shelf" },
  { cat: "CLASSIFIEDS", t: "LOST: All Momentum (vicinity of Tuesday)", sub: "Last seen during a 3pm meeting. No distinguishing features. Reward: the rest of the week off.", em: "📋😶", cta: "Report sighting" },
  { cat: "ADVERTISEMENT", t: "Noise-Canceling Headphones for Your Thoughts", sub: "Finally. ANC technology that blocks your own internal monologue. FDA pending.", em: "🎧🧠", cta: "Silence yourself" },
  { cat: "ADVERTISEMENT", t: "Subscribe to Our Newsletter", sub: "We will email you every single day until one of us perishes. Unsubscribe link rendered in 4pt font.", em: "📧♾️", cta: "Subscribe forever" },
  { cat: "REAL ESTATE", t: "COUNTRY ESTATE — $2.1M", sub: "12 acres. Built 1803. Ghosts included at no additional charge. \"They're mostly in the east wing.\"", em: "🏚️👻", cta: "View listing" },
  { cat: "CLASSIFIEDS", t: "FREE: Partially Used New Year's Resolutions", sub: "Includes gym membership (unused since Jan 4), meditation app, and a journal with one entry.", em: "📓🏋️", cta: "Claim yours" },
  { cat: "ADVERTISEMENT", t: "Grandma's Recipe for Success", sub: "Ingredients: guilt, passive aggression, casserole. Serves: the entire extended family whether they like it or not.", em: "👵🍲", cta: "Get the recipe" },
];

export const TREND_ITEMS: string[] = [
  "Area Man Achieves Inbox Zero by Deleting Everything, Declares Victory",
  "Study: People Who Wake at 5 A.M. Just as Miserable, but More Vocal About It",
  "Person Who Said 'Let's Circle Back' Has Never Circled Back to Anything",
  "'I'll Start Monday' Exposed as Longest-Running Lie in Human History",
  "Couple Agrees to 'Just One Episode' for 947th Consecutive Night",
  "Report: 98% of 'Quick Questions' Are Neither Quick Nor Singular",
  "Local Man's '5-Minute' Recipe Enters Hour Three Without Apparent Irony",
  "Nation's Therapists Report Surge in Clients Who 'Just Want to Vent'",
  "Woman Discovers She's Been Using Dishwasher Wrong for 30 Years, Still Doesn't Care",
  "\"I'm Not a Regular Boss, I'm a Cool Boss,\" Reports Universally Disliked Boss",
];

export const STOCKS: Stock[] = [
  { sym: "EMOJI", pct: "+2.4", up: true },
  { sym: "ATTN", pct: "-8.1", up: false },
  { sym: "CLKBT", pct: "+14.7", up: true },
  { sym: "NUANC", pct: "-99.2", up: false },
  { sym: "FOMO", pct: "+22.1", up: true },
  { sym: "FACTS", pct: "-4.3", up: false },
  { sym: "VIBES", pct: "+11.9", up: true },
  { sym: "OUTRG", pct: "+31.0", up: true },
  { sym: "CNTXT", pct: "-67.5", up: false },
  { sym: "IRONY", pct: "-12.3", up: false },
  { sym: "TAKES", pct: "+8.4", up: true },
];

export const FAKE_NAMES: string[] = [
  "Brenda Clicksworth", "Dale Headliner", "Fontaine von Pixel",
  "Gary Bandwidth", "Judith Scrollington", "Mortimer Trendpiece",
  "Sheila Deadline", "Reginald Uppercase", "Tamsin Breakingnews",
  "Chester Pagination", "Eunice Hyperlink", "Barnaby Pushnotify",
  "Dolores Paywall", "Franklin Sidebar", "Mildred Crosspost",
  "Cornelius Dateline", "Agatha Clickbait", "Winston Newsfeed",
  "Beatrice Infographic", "Harold Retraction",
];

export const FAKE_WEATHER: Weather[] = [
  { emoji: "🌤️", text: "72°F, Existential" },
  { emoji: "🌧️", text: "58°F, Passive-Aggressive Drizzle" },
  { emoji: "⛈️", text: "61°F, Ominous" },
  { emoji: "🌫️", text: "54°F, Vibes Unknown" },
  { emoji: "☀️", text: "88°F, Aggressively Sunny" },
  { emoji: "🌪️", text: "??°F, Spiral Energy" },
  { emoji: "❄️", text: "12°F, Emotionally Unavailable" },
  { emoji: "🌈", text: "70°F, Suspiciously Pleasant" },
  { emoji: "🔥", text: "104°F, Alarming" },
  { emoji: "🌊", text: "65°F, Damp With Regret" },
];

export const GAME_OVER_HEADLINES: GameOverHeadline[] = [
  {
    label: "\u2014 CORRECTION \u2014",
    big: "We Regret the Error",
    sub: (name) => `An earlier version of this training session contained an employee (${name}) who knew what they were doing. This has been corrected.`,
  },
  {
    label: "\u2014 INTERNAL MEMO \u2014",
    big: (name) => `${name}: Terminated`,
    sub: (name) => `HR confirms ${name} failed to meet minimum emoji literacy requirements. Personal effects can be collected from the lobby.`,
  },
  {
    label: "\u2014 RETRACTION \u2014",
    big: "Translation Quality Below Standards",
    sub: (name) => `The Editors regret to inform ${name} that their performance review has been updated accordingly.`,
  },
  {
    label: "\u2014 LATE BULLETIN \u2014",
    big: "AI Outperforms Human Trainee",
    sub: (name) => `Officials report the translation AI has formally requested a more competent supervisor than ${name}.`,
  },
  {
    label: "\u2014 SPECIAL REPORT \u2014",
    big: "Training Session Ends Early",
    sub: (name) => `A promising calibration attempt by ${name} ended prematurely today, leaving the Translation Desk short-staffed once again.`,
  },
];

export const EDITIONS: string[] = [
  "Lady Pompom Edition", "Velvet Fog Edition", "Phantom Comma Edition",
  "Unsolicited Morning Edition", "Last Resort Edition", "Quiet Panic Edition",
  "Haunted Serif Edition", "Borrowed Time Edition",
];

export const EMOJI_NAV: Record<string, string> = {
  "News": "📰",
  "Interdimensional Affairs": "🌀👽",
  "Unsolicited Advice": "☝️🙄",
  "Loud Speculation": "📢🔮",
};

export const EMOJI_STOCKS: Record<string, string> = {
  EMOJI: "😀", ATTN: "👀", CLKBT: "👆", NUANC: "🤷", FOMO: "😰",
  FACTS: "📋", VIBES: "✨", OUTRG: "😤", CNTXT: "🧩", IRONY: "🙃", TAKES: "🔥",
};

export const REACT_EMOJIS: string[] = [
  "😂", "🔥", "❤️", "👀", "🤯", "✨", "💀", "🫠", "👏", "😭",
  "🤡", "💅", "🙃", "😎", "🥳", "💥", "🎉", "😍", "🤩", "👑",
];

export const NAV_SECTIONS = [
  "News", "Interdimensional Affairs", "Unsolicited Advice", "Loud Speculation",
];
