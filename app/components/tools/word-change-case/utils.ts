import * as changeCase from "change-case";

export const methods: {
  name: string;
  example: string;
  run: (val: string) => string;
}[] = [
  {
    name: "camelCase",
    example: "twoWords",
    run: (val) => changeCase.camelCase(val),
  },
  {
    name: "capitalCase",
    example: "Two Words",
    run: (val) => changeCase.capitalCase(val),
  },
  {
    name: "constantCase",
    example: "TWO_WORDS",
    run: (val) => changeCase.constantCase(val),
  },
  {
    name: "dotCase",
    example: "two.words",
    run: (val) => changeCase.dotCase(val),
  },
  {
    name: "kebabCase",
    example: "two-words",
    run: (val) => changeCase.kebabCase(val),
  },
  {
    name: "noCase",
    example: "two words",
    run: (val) => changeCase.noCase(val),
  },
  {
    name: "pascalCase",
    example: "TwoWords",
    run: (val) => changeCase.pascalCase(val),
  },
  {
    name: "pascalSnakeCase",
    example: "Two_Words",
    run: (val) => changeCase.pascalSnakeCase(val),
  },
  {
    name: "pathCase",
    example: "two/words",
    run: (val) => changeCase.pathCase(val),
  },
  {
    name: "sentenceCase",
    example: "Two words",
    run: (val) => changeCase.sentenceCase(val),
  },
  {
    name: "snakeCase",
    example: "two_words",
    run: (val) => changeCase.snakeCase(val),
  },
  {
    name: "trainCase",
    example: "Two-Words",
    run: (val) => changeCase.trainCase(val),
  },
];
