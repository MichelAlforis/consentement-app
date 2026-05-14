export interface ScenarioChoice {
  isIdeal: boolean;
}

export interface ScenarioItem {
  id: string;
  choices: [ScenarioChoice, ScenarioChoice, ScenarioChoice, ScenarioChoice];
}

export const scenariosQuotidiensItems: ScenarioItem[] = [
  {
    id: 'sq-s1',
    choices: [
      { isIdeal: false },
      { isIdeal: true  },
      { isIdeal: false },
      { isIdeal: false },
    ],
  },
  {
    id: 'sq-s2',
    choices: [
      { isIdeal: false },
      { isIdeal: true  },
      { isIdeal: false },
      { isIdeal: false },
    ],
  },
  {
    id: 'sq-s3',
    choices: [
      { isIdeal: false },
      { isIdeal: true  },
      { isIdeal: false },
      { isIdeal: false },
    ],
  },
  {
    id: 'sq-s4',
    choices: [
      { isIdeal: false },
      { isIdeal: true  },
      { isIdeal: false },
      { isIdeal: false },
    ],
  },
];
