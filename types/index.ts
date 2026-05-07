export type VolumeUnit = 'tsp' | 'tbsp' | 'fl. oz' | 'cup' | 'pt' | 'qt' | 'gallon' | 'ml' | 'liter'
export type WeightUnit = 'oz' | 'lbs' | 'gram' | 'kg'
export type CountUnit = 'each' | 'piece' | 'clove' | 'slice' | 'square' | 'can' | 'unit'
export type OtherUnit = 'other'
export type MeasureUnit = VolumeUnit | WeightUnit | CountUnit | OtherUnit

export type Ingredient = {
  key: number;
  name: string;
  amount: number;       // stored as decimal: "1/2" → 0.5
  measure: MeasureUnit;
  freeform: boolean;    // true for "to taste", "as needed", etc.
  tag: string | null;
};

export type Direction = {
  description: string;
};

export type Group = {
  id: number;
  name: string;
};

export type Recipe = {
  id: string;
  name: string;
  author: string;
  uploader: string;
  uploaderAvatar: string;
  category: string | null;
  servings: number | null;
  groups: Group[];
  ingredientsList: Ingredient[];
  directionsList: Direction[];
  keywordsArray: string[];
  imgSrc: string | null;
  created: any; // Firestore Timestamp
};

export type UserFavorites = {
  favoriteList: string[];
};

export type FavoritesContextType = {
  favorites: string[];
  loadFavorites: () => Promise<void>;
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  showError: boolean;
  closeError: () => void;
};
