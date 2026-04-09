//categoriesPage.jsx

import React from 'react';
import {initializeCategories, getCategories, saveCategories} from './categoriesData.js';

function CategoriesPage() {
	console.log("hello");

  const categories = initializeCategories();
  console.log(categories)
	
  
  return <h1>Welcome to the Home Page</h1>;
}

export default CategoriesPage;