// categoriesData.js

// Default categories (replace these with your actual values)
const defaultCategories = [
  { id: 1, name: "Academic", visible: true },
  { id: 2, name: "Work", visible: true },
  { id: 3, name: "Fitness", visible: true  },
  { id: 4, name: "Social", visible: true  },
  { id: 5, name: "Personal", visible: true  },
];

const STORAGE_KEY = "categoriesData";

/**
 * Initialize categories in localStorage.
 * - If data exists → load it
 * - If not → save defaultCategories
 */
export function initializeCategories() {
  const storedData = localStorage.getItem(STORAGE_KEY);

  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error("Error parsing stored categories. Resetting to default.");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
      return defaultCategories;
    }
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  }
}

/**
 * Get categories from localStorage
 */
export function getCategories() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Save categories to localStorage
 */
export function saveCategories(categories) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}