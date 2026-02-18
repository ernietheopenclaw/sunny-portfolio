"use client";

import { Concept } from "@/types";
import { mockConcepts } from "@/data/mock";

const STORAGE_KEY = "sunny-concepts";
const HIDDEN_KEY = "hidden-concepts";

function getHiddenIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function setHiddenIds(ids: Set<string>): void {
  localStorage.setItem(HIDDEN_KEY, JSON.stringify([...ids]));
}

export function getUserConcepts(): Concept[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addUserConcept(concept: Concept): void {
  const existing = getUserConcepts();
  existing.push(concept);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function removeUserConcept(id: string): void {
  const existing = getUserConcepts();
  const filtered = existing.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function hideConcept(id: string): void {
  // For mock concepts, add to hidden list; for user concepts, remove from storage
  const isUserConcept = getUserConcepts().some(c => c.id === id);
  if (isUserConcept) {
    removeUserConcept(id);
  } else {
    const hidden = getHiddenIds();
    hidden.add(id);
    setHiddenIds(hidden);
  }
}

export function getAllConcepts(): Concept[] {
  const hidden = getHiddenIds();
  const visibleMock = mockConcepts.filter(c => !hidden.has(c.id));
  return [...visibleMock, ...getUserConcepts()];
}
