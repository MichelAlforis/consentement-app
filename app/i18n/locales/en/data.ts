export const data = {
  comfort: {
    tenderness: {
      title: 'Tenderness',
      description: 'Emotional intimacy and gentle contact',
      items: {
        kisses: 'Kisses',
        cuddles: 'Cuddles',
        massage: 'Massages',
        words: 'Sweet words',
        holding: 'Holding hands',
        sleeping: 'Sleeping together',
      },
    },
    intensity: {
      title: 'Intensity',
      description: 'Pace and level of intimacy',
      items: {
        slow: 'Taking it slow',
        spontaneous: 'Spontaneity',
        lights: 'Lights on',
        talking: 'Talking during',
        'eye-contact': 'Eye contact',
        guidance: 'Guiding each other',
      },
    },
    trust: {
      title: 'Trust',
      description: 'Practices requiring enhanced communication',
      items: {
        blindfold: 'Blindfold',
        restraint: 'Gentle restraint',
        roleplay: 'Roleplay',
        power: 'Power dynamic',
        toys: 'Accessories',
        filming: 'Photos/Videos',
      },
    },
  },

  levels: ["No", "Not now", "Curious", "Comfortable", "Love it"] as [string, string, string, string, string],

  principles: [
    { title: 'Ongoing', text: 'It can be withdrawn at any time. A "yes" can become a "no".' },
    { title: 'Explicit', text: 'Silence or the absence of "no" does not mean "yes".' },
    { title: 'Specific', text: 'Agreeing to one thing does not mean agreeing to everything.' },
    { title: 'Free', text: 'Without pressure, blackmail, or manipulation.' },
    { title: 'Informed', text: 'You must understand what you are consenting to.' },
  ] as { title: string; text: string }[],

  helpResources: [
    { name: 'Fil Santé Jeunes', desc: 'Anonymous and free' },
    { name: 'Violences Femmes Info', desc: '24/7' },
    { name: 'Planning Familial', desc: 'Sexuality, contraception' },
    { name: 'Suicide Prevention', desc: 'Available 24/7' },
    { name: 'Child Protection', desc: 'Free, 24/7' },
  ] as { name: string; desc: string }[],

  quiz: [
    {
      question: "Someone says nothing and doesn't resist. Does that mean they agree?",
      options: ["Yes, silence means yes", "No, silence is not consent", "It depends on the situation", "Yes if you know each other well"],
      explanation: "Silence does not mean yes. Consent must be clearly expressed. A person can be paralyzed by fear or surprise without being able to speak.",
    },
    {
      question: "You said yes last night. Can you change your mind this morning?",
      options: ["No, you already said yes", "Yes, you can always change your mind", "No, it's too late", "It depends on what you agreed to"],
      explanation: "Consent is ongoing. You can say no at any time, even if you said yes before. No one can be forced to continue something they no longer want.",
    },
    {
      question: "Agreeing to a kiss means agreeing to what else?",
      options: ["Everything that comes after", "Nothing more than the kiss", "It depends on who it is", "Everything if you're in a relationship"],
      explanation: "Agreeing to something does not mean agreeing to something else. Each act requires its own consent. A kiss = only a kiss.",
    },
    {
      question: "Someone offers you gifts so you'll do something with them. What kind of consent is that?",
      options: ["It's normal, it's like an exchange", "It's consent under pressure, so it's not valid", "It's okay if you want to make the exchange", "It's just kindness"],
      explanation: "Consent given under pressure, manipulation, or exchange is not true consent. It must be free, with no conditions attached.",
    },
    {
      question: "Can a drunk or high person give consent?",
      options: ["Yes, if they say yes", "No, they are not in a state to decide", "Yes if they're used to it", "It depends on how much they drank"],
      explanation: "A person under the influence of alcohol or drugs cannot give valid consent. Taking advantage of this state is considered sexual assault by law.",
    },
    {
      question: "In porn, actors moan with pleasure all the time. Is that what it's like in real life?",
      options: ["Yes, that's what it's like when it's good", "No, it's acting for the cameras", "Yes if you do things right", "It depends on the person"],
      explanation: "Porn is a film with actors playing a role. The sounds, reactions, and bodies are staged. Real intimacy is very different and much more varied.",
    },
    {
      question: "In France, what is the legal age of sexual consent?",
      options: ["13", "14", "15", "18"],
      explanation: "In France, the legal age of consent is 15. Below this age, any sexual act with an adult is a crime, even if the minor says yes — their word cannot constitute legal consent.",
    },
    {
      question: "A boy who was forced can also be a victim of sexual assault?",
      options: ["No, boys cannot be victims", "Yes, anyone can be a victim", "Only if it was an adult", "Yes but it's rare"],
      explanation: "Anyone can be a victim of sexual assault, regardless of gender. Boys and men are also concerned.",
    },
  ] as { question: string; options: string[]; explanation: string }[],

  pornoVsRealite: [
    {
      porno: "Actors do things without ever talking about it first",
      realite: "Real relationships start with communication, questions, and mutual agreement",
      explication: "In real life, talking before, during and after is normal and necessary. It's not weird — it's respect.",
    },
    {
      porno: "Everyone seems to love everything, all the time",
      realite: "Every person has limits, preferences, things they don't like",
      explication: "Actors play a role. In reality, you can like some things and not others. Saying no to something is perfectly normal.",
    },
    {
      porno: "Refusal or hesitation is often ignored",
      realite: "A no or hesitation must always be respected, immediately",
      explication: "Ignoring a refusal is assault. In real life, the slightest hesitation must make everything stop right away.",
    },
    {
      porno: "Some acts seem easy and painless",
      realite: "Some acts require preparation, gentleness and can hurt if done wrong",
      explication: "Pornography does not show preparation, necessary products, or possible pain. Poorly imitating what you see can cause harm.",
    },
    {
      porno: "Some scenes seem normal on screen",
      realite: "Some acts reproduced outside a consented context are crimes",
      explication: "What is filmed with consenting adult actors in a legal context cannot be freely reproduced. Forcing someone is a crime, regardless of what you saw in a film.",
    },
    {
      porno: "No need to talk, everything is understood",
      realite: "Communication is the foundation of every healthy sexual relationship",
      explication: "In reality, checking that the other person is okay, asking questions, asking what they like — that's what makes it good for both.",
    },
  ] as { porno: string; realite: string; explication: string }[],

  loi: [
    {
      titre: "The legal age of consent",
      contenu: "In France, the legal age of sexual consent is 15. Below this age, no sexual act with an adult can be legal, even if the young person says they agree.",
    },
    {
      titre: "What the adult risks",
      contenu: "An adult who has sexual relations with a minor under 15 faces up to 20 years in prison. If the adult is a parent, teacher, or authority figure, the penalties are even heavier.",
    },
    {
      titre: "And between teenagers?",
      contenu: "When both people are under 18 with a reasonable age gap, the law is more lenient. But consent is still required. Forcing someone or ignoring a refusal is an offense, regardless of age.",
    },
    {
      titre: "Photos and videos",
      contenu: "Taking, sharing, or possessing sexual photos or videos of a minor is a serious crime — even if the minor said yes, even if they sent the photo themselves. It's the law.",
    },
    {
      titre: "Silence is not a yes",
      contenu: "French law is clear: the absence of resistance does not constitute consent. A person who says nothing, who is under pressure, intimidated, or under the influence of alcohol cannot consent.",
    },
    {
      titre: "If something happened to you",
      contenu: "If you experienced something that made you uncomfortable or that you think was assault, you can talk about it. It's never your fault. Professionals are there to listen without judging you.",
    },
  ] as { titre: string; contenu: string }[],

  diceCategories: {
    1: 'Dare',
    2: 'Talk',
    3: 'What if…',
    4: 'Challenge',
    5: 'Truth',
    6: 'Softness',
  } as Record<number, string>,
} as const;
