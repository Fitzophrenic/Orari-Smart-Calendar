import React, { useEffect, useState } from 'react';
import {
  initializeCategories,
  saveCategories,
} from './categoriesData.js';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    const initialized = initializeCategories();
    setCategories(initialized);
  }, []);

  const persistCategories = (updatedCategories) => {
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  };

  const toggleVisibility = (id) => {
    const updatedCategories = categories.map((category) =>
      category.id === id
        ? { ...category, visible: !category.visible }
        : category
    );
    persistCategories(updatedCategories);
  };

  const renameCategory = (id) => {
    const current = categories.find((category) => category.id === id);
    if (!current) return;

    const renamed = window.prompt('Enter a new category name:', current.name);
    if (!renamed) return;

    const nextName = renamed.trim();
    if (!nextName) return;

    const updatedCategories = categories.map((category) =>
      category.id === id ? { ...category, name: nextName } : category
    );
    persistCategories(updatedCategories);
  };

  const deleteCategory = (id) => {
    const updatedCategories = categories.filter((category) => category.id !== id);
    persistCategories(updatedCategories);
  };

  const addCategory = (event) => {
    event.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;

    const nextId =
      categories.length > 0
        ? Math.max(...categories.map((category) => category.id)) + 1
        : 1;

    const updatedCategories = [
      ...categories,
      { id: nextId, name, visible: true },
    ];
    persistCategories(updatedCategories);
    setNewCategoryName('');
  };

  return (
    <div className='max-w-3xl'>
      <h2 className='text-xl font-semibold mb-4'>Categories</h2>

      <div className='space-y-2 mb-6'>
        {categories.map((category) => (
          <div
            key={category.id}
            className='flex items-center gap-4 border rounded p-3'
          >
            <div className='flex-1'>{category.name}</div>

            <label className='flex items-center gap-2'>
              <span className='text-sm'>Visible</span>
              <input
                type='checkbox'
                checked={category.visible}
                onChange={() => toggleVisibility(category.id)}
              />
            </label>

            <button
              type='button'
              className='px-3 py-1 border rounded'
              onClick={() => renameCategory(category.id)}
            >
              Edit
            </button>

            <button
              type='button'
              className='px-3 py-1 border rounded text-red-600'
              onClick={() => deleteCategory(category.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <form className='flex gap-2' onSubmit={addCategory}>
        <input
          type='text'
          className='flex-1 border rounded px-3 py-2'
          placeholder='Create a new category'
          value={newCategoryName}
          onChange={(event) => setNewCategoryName(event.target.value)}
        />
        <button type='submit' className='px-4 py-2 border rounded'>
          Add
        </button>
      </form>
    </div>
  );
}
