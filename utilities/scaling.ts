import Fraction from 'fraction.js'
import { Ingredient, MeasureUnit } from '../types'

/**
 * Parse a fraction string from user input into a decimal number.
 * Handles: "1/2" → 0.5, "1 1/4" → 1.25, "2" → 2
 * Returns null if the string cannot be parsed.
 */
export const parseFraction = (input: string): number | null => {
  const trimmed = input.trim()
  if (!trimmed) return null
  try {
    return new Fraction(trimmed).valueOf()
  } catch {
    return null
  }
}

/**
 * Format a decimal number as a readable fraction string for display.
 * 0.5 → "1/2", 0.75 → "3/4", 1.5 → "1 1/2", 2.0 → "2"
 */
export const formatAmount = (value: number): string => {
  return new Fraction(value).toFraction(true)
}

/**
 * Return the display string for a scaled ingredient.
 * Freeform ingredients (e.g. "to taste") are returned unchanged.
 */
export const scaleIngredient = (ingredient: Ingredient, factor: number): string => {
  if (ingredient.freeform) return 'to taste'
  if (ingredient.amount === 0) return ''
  return `${formatAmount(ingredient.amount * factor)} ${ingredient.measure}`
}

export const MEASURE_UNITS: MeasureUnit[] = [
  // Volume
  'tsp', 'tbsp', 'fl. oz', 'cup', 'pt', 'qt', 'gallon', 'ml', 'liter',
  // Weight
  'oz', 'lbs', 'gram', 'kg',
  // Count
  'each', 'piece', 'clove', 'slice', 'square', 'can', 'unit',
  // Other
  'other',
]
