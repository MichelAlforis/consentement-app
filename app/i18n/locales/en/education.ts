export const education = {
  learn: {
    title: 'Understanding consent',
    subtitle: 'The pillars of a healthy, respectful relationship',
    keyTakeaway: 'Consent is not a contract',
    keyText: "It's an ongoing conversation based on mutual respect.",
    further: {
      title: 'Going further',
      item1: 'Consent applies to every situation',
      item2: 'Your body is always yours',
      item3: 'Setting limits is a sign of strength',
      item4: 'Communication is key',
    },
  },

  help: {
    title: 'Need help?',
    subtitle: "You're not alone. People are here to listen.",
    alsoTalk: {
      title: 'You can also talk to...',
      item1: 'A trusted adult',
      item2: 'A school nurse',
      item3: 'A school counselor',
      item4: 'The family doctor',
    },
    emergency: {
      title: 'In an emergency',
      police: 'Police',
      samu: 'Emergency services',
      sms: 'SMS',
    },
  },

  pornoVsRealite: {
    title: 'Porn vs. Reality',
    subtitle: "What films don't show you",
    intro: "Porn is a <strong>fiction film</strong> made with actors. It doesn't show how real relationships work — nor consent, communication, or boundaries.",
    inPorno: 'In porn',
    inReality: 'In reality',
    closing: "Real intimacy is built with communication, respect and consent. Not by imitating a film.",
  },

  loi: {
    title: 'The law & consent',
    subtitle: 'What you risk. What protects you.',
    alert: {
      title: 'Key point to remember',
      text: "In France, the legal age of consent is <strong>15 years old</strong>. Below this age, no sexual act with an adult can be legal — even if the young person says yes.",
    },
    source1: 'Content validated by our co-founder, a criminal law attorney.',
    source2: 'French Penal Code — Articles 222-22 et seq.',
  },

  quiz: {
    title: 'Quiz',
    question: 'Question {current} of {total}',
    correct: '✅ Correct!',
    incorrect: '❌ Not quite',
    validate: 'Validate',
    next: 'Next question',
    finish: 'See my score',
    restart: 'Restart',
    score: '{score} correct answer{plural} out of {total}',
    adviceReread: 'Re-read the Porn vs. Reality and The Law modules to better understand.',
    scoreLabels: {
      excellent: 'Excellent!',
      good: 'Good!',
      notBad: 'Not bad',
      retry: 'Keep practicing',
    },
  },

  accompagnement: {
    title: 'I want to have sex',
    subtitle: 'Questions to ask yourself. No judgment.',
    intro: {
      text: "It's normal to have questions. This space guides you — not to tell you what to do, but to help you check that you're truly ready.",
      note: "We'll ask you a few simple questions. No answers are recorded.",
      cta: 'Start',
    },
    age: {
      question: 'How old are you?',
      under15: { title: 'Under 15', desc: "I'm 14 or younger" },
      between: { title: '15, 16 or 17', desc: "I'm between 15 and 17" },
    },
    under15Alert: {
      title: '⚠️ Important to know',
      text: "In France, the legal age of consent is <strong>15 years old</strong>. Below this age, any sexual act with an adult is a crime — even if you say yes. This law is here to protect you.",
      sub: "If you have questions about your sexuality, your feelings, or a situation that made you uncomfortable, talking to a professional can really help.",
    },
    talked: {
      question: 'Have you been able to talk about it with a trusted adult?',
      sub: "A parent, doctor, school nurse… someone you trust.",
      yes: "Yes, I've talked about it",
      no: 'Not yet',
      noDec: "I'll give you resources to help",
    },
    notTalkedYet: "It's not always easy to talk about it. These professionals are trained to listen without judging and maintain confidentiality.",
    partnerOk: {
      question: 'Is your partner really okay with it?',
      sub: 'Not just "they didn\'t say no" — but truly okay, freely?',
      yes: "Yes, we talked about it together",
      unsure: "I'm not sure",
      unsureDec: "If it's uncertain, we're not ready",
    },
    resourcesNote: "Talking to a professional doesn't commit you to anything — it's just a conversation.",
    continueAnyway: 'Continue anyway',
    guide: {
      ready: '✅ You seem ready',
      readyDesc: "You've checked the important boxes. Remember that consent is ongoing — both people must stay comfortable throughout.",
      tip1: 'You can stop at any time',
      tip2: 'Saying no or "stop" must be respected immediately',
      tip3: 'If something hurts, say so',
      tip4: 'The first time is rarely like in films',
      backHome: 'Back home',
    },
    backHome: 'Back',
  },
} as const;
