"use client";

import { useSyncExternalStore } from "react";

// The "compare" tray: up to three SKUs, kept in localStorage and shared
// between the product cards, the floating bar and the /compare page.

const KEY = "nexabank_compare";
const EVENT = "nexabank:compare";
export const COMPARE_MAX = 3;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((s): s is string => typeof s === "string").slice(0, COMPARE_MAX) : [];
  } catch {
    return [];
  }
}

let cache: string[] = [];
let cacheKey = "";

function snapshot(): string[] {
  const next = read();
  const key = next.join(",");
  if (key !== cacheKey) {
    cache = next;
    cacheKey = key;
  }
  return cache;
}

function write(skus: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(skus.slice(0, COMPARE_MAX)));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function getCompare(): string[] {
  return snapshot();
}

export function toggleCompare(sku: string): string[] {
  const current = read();
  const next = current.includes(sku) ? current.filter((s) => s !== sku) : [...current, sku].slice(-COMPARE_MAX);
  write(next);
  return next;
}

export function clearCompare() {
  write([]);
}

const EMPTY: string[] = [];

export function useCompare(): string[] {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener(EVENT, cb);
      window.addEventListener("storage", cb);
      return () => {
        window.removeEventListener(EVENT, cb);
        window.removeEventListener("storage", cb);
      };
    },
    snapshot,
    () => EMPTY,
  );
}

export function compareHref(skus: string[]): string {
  return `/compare?skus=${encodeURIComponent(skus.join(","))}`;
}
