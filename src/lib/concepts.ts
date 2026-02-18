"use client";

import { Concept } from "@/types";
import { mockConcepts } from "@/data/mock";

const STORAGE_KEY = "user-concepts";

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

export function getAllConcepts(): Concept[] {
  return [...mockConcepts, ...getUserConcepts()];
}
