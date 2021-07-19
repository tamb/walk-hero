const npcChallenges = [
  {
    // NPCChallenge
    npc_type: "Wizard",
    character_image: "🧙",
    character_intro: "A wizard appeared!",
    challenges: {
      hangman: {
        // ChallengeFraming
        intro:
          "I will reward thee for thy intellect! I shall punish thee for thy ignorance!",
        outro: {
          success: "Thou art brilliant! Huzzah!",
          failure: "Thou hast the mind of a goat! Barooom!",
        },
      },
      raid: {
        intro:
          "Zounds! These hooligans have broken my staff!  Stop them before they kill us all!",
        outro: {
          success: "Huzzah! Thank you! Now I must mend my staff...",
          failure: "We have suffered a great loss.",
        },
      },
      slider_precision: {
        intro: "Help me catch this Hooligan!  He has stolen my potions!",
        outro: {
          success: "Excelsior! I shall turn this Hooligan into a newt!",
          failure: "Dashitall!  Now I must concoct up some more potion...",
        },
      },
      prime_number: {
        intro:
          "To concoct this potion I need the help of a skilled mathematician...",
        outro: {
          success: "Excellent! Here is your reward!",
          failure: "My formula is ruined!",
        },
      },
    },
  },
  {
    // NPCChallenge
    npc_type: "Raider",
    character_image: "😈",
    character_intro: "A raider appeared!",
    challenges: {
      hangman: {
        // ChallengeFraming
        intro: "Prove you're a wordsmith or face my wrath!",
        outro: {
          success: "Darn! I wanted a fight",
          failure: "I'll be taking this!",
        },
      },
      raid: {
        intro: "You'll never stop us!  We'll take over this whole village!",
        outro: {
          success: "Blasted! You have won this round...",
          failure: "Hehehe!  Leave with your tail between your legs!",
        },
      },
      slider_precision: {
        intro: "You'll never catch me alive!",
        outro: {
          success: "Darn! I have been captured",
          failure: "Goodbye for now, fool!",
        },
      },
      prime_number: {
        intro: "Answer me this or perish!",
        outro: {
          success: "Oh goodness! You are smarter than I thought!",
          failure: "Fool!",
        },
      },
    },
  },
  {
    // NPCChallenge
    npc_type: "Fairy",
    character_image: "🧚",
    character_intro: "A fairy appeared!",
    challenges: {
      hangman: {
        // ChallengeFraming
        intro: "You don't look so smart!",
        outro: {
          success: "I was wrong!",
          failure: "I knew it!",
        },
      },
      raid: {
        intro: "Help! They're all wired up on fairy dust!",
        outro: {
          success: "Splendid! Here is your reward...",
          failure: "There's no stopping them!",
        },
      },
      slider_precision: {
        intro: "They've taken my fairy dust! Stop them!",
        outro: {
          success: "Yes! My stash!",
          failure: "Oh no! My dust...",
        },
      },
      prime_number: {
        intro: "Is this the right amount of fairy dust?",
        outro: {
          success: "Perfect! Thank you!",
          failure: "What a waste of dust!",
        },
      },
    },
  },
];
