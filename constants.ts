import type { Item } from "./db/schema/User.js";

export const emoji = {
  EXCLAMATION: "<:kc_exclamation:993256817603924008>",
  DOT: "<:kc_punkt:1440369092283470006>",
  LINE_1: "<:kc_strich1:1055843946342907954>",
  LINE_2: "<:kc_strich2:1055843970753769532>",
  LINE_3: "<:kc_strich3:1055843972267900988>",
  TADA: "<a:tada:913065338583781458>",
  THINK: "<:kiwi_hmm:934449824059768872>",
  KIWI_PRAY: "<:kiwi_beten:934860398304329778>",
};

export const color = {
  PASTELL_GREEN: 0x77dd77,
  PASTELL_RED: 0xff746c,
};

export const channel = {
  FLAG_QUIZ: "1440381520475848845",
  PARTNER_REQUEST: "1447302588440645836",
  MEDIA: "1440380017514385458",
  ANIMALS: "900718923471802428",
  MEMES: "899592205256245268",
  SKULL_BOARD: "1447641422055346268",
  KIWI_CHURCH: "934860620745015296",
};

// temporary
export const ITEMS: Item[] = [
  {
    name: "Kiwipass",
    price: 25000,
    description: "Der Kiwipass ist eine Art VIP Mitgliedschaft des Servers",
    type: "VIP",
  },
  {
    name: "Among us pass",
    price: 676767,
    description: "buy among us",
    type: "VIP",
  },
];
