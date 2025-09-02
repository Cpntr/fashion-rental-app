// src\utils\idGenerator.ts

import { DRESS_CATALOGUE } from "../mocks/dresses";

let nextId = Math.max(...DRESS_CATALOGUE.map(d => d.id)) + 1;

export function getNextDressId(): number {
  return nextId++;
}
