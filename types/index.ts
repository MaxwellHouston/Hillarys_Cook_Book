export type Ingredient = {
  key: number;
  name: string;
  amount: string;
  measure: string;
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
