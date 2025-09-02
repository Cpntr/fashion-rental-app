// src\utils\idGenerator.ts

let nextId = 1;

export function getNextDressId(): number {
  return nextId++;
}
