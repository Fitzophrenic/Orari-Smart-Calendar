import React, { useEffect, useRef, useState } from 'react';
import {
  initializeCategories,
  saveCategories,
} from './categoriesData.js';

const DEFAULT_CATEGORY_COLOR = '#94a3b8';

const NEW_CATEGORY_COLORS = [
  '#6366f1',
  '#ec4899',
  '#14b8a6',
  '#f59e0b',
  '#64748b',
  '#0ea5e9',
];

/** Valid #rrggbb for <input type="color" />; old data may omit or use invalid values. */
function colorForPicker(value) {
  if (value && /^#[0-9A-Fa-f]{6}$/i.test(value)) {
    return value.toLowerCase();
  }
  return DEFAULT_CATEGORY_COLOR;
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [openRenameId, setOpenRenameId] = useState(null);
  const [renameDraft, setRenameDraft] = useState('');
  const renameInputRef = useRef(null);

  useEffect(() => {
    const initialized = initializeCategories();
    setCategories(initialized);
  }, []);

  useEffect(() => {
    if (openRenameId === null) return undefined;

    const onDocMouseDown = (e) => {
      const row = e.target.closest('[data-category-row]');
      const rowId = row ? Number(row.getAttribute('data-category-row')) : null;
      if (rowId !== openRenameId) {
        setOpenRenameId(null);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpenRenameId(null);
    };

    document.addEventListener('mousedown', onDocMouseDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [openRenameId]);

  useEffect(() => {
    if (openRenameId !== null && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [openRenameId]);

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

  const toggleRenameMenu = (id, currentName) => {
    if (openRenameId === id) {
      setOpenRenameId(null);
      return;
    }
    setOpenRenameId(id);
    setRenameDraft(currentName);
  };

  const applyRename = () => {
    if (openRenameId === null) return;

    const nextName = renameDraft.trim();
    if (!nextName) return;

    const id = openRenameId;
    const updatedCategories = categories.map((category) =>
      category.id === id ? { ...category, name: nextName } : category
    );
    persistCategories(updatedCategories);
    setOpenRenameId(null);
  };

  const cancelRename = () => {
    setOpenRenameId(null);
  };

  const deleteCategory = (id) => {
    if (openRenameId === id) setOpenRenameId(null);
    const updatedCategories = categories.filter((category) => category.id !== id);
    persistCategories(updatedCategories);
  };

  const setCategoryColor = (id, hex) => {
    const updatedCategories = categories.map((category) =>
      category.id === id ? { ...category, color: hex } : category
    );
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

    const nextColor =
      NEW_CATEGORY_COLORS[(nextId - 1) % NEW_CATEGORY_COLORS.length];

    const updatedCategories = [
      ...categories,
      { id: nextId, name, visible: true, color: nextColor },
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
            data-category-row={category.id}
            className='flex items-center gap-4 border rounded p-3'
            style={{
              borderLeftWidth: 4,
              borderLeftColor: colorForPicker(category.color),
            }}
          >
            <div className='flex items-center gap-2'>
              <label className='sr-only' htmlFor={`category-color-${category.id}`}>
                Color for {category.name}
              </label>
              <input
                id={`category-color-${category.id}`}
                type='color'
                className='h-9 w-12 cursor-pointer border border-gray-300 rounded p-0.5'
                value={colorForPicker(category.color)}
                onChange={(e) => setCategoryColor(category.id, e.target.value)}
                title='Category color'
              />
            </div>
            <div className='flex-1'>{category.name}</div>

            <label className='flex items-center gap-2'>
              <span className='text-sm'>Visible</span>
              <input
                type='checkbox'
                checked={category.visible}
                onChange={() => toggleVisibility(category.id)}
              />
            </label>

            <div className='relative shrink-0'>
              <button
                type='button'
                className='px-3 py-1 border rounded'
                aria-expanded={openRenameId === category.id}
                aria-haspopup='true'
                onClick={() => toggleRenameMenu(category.id, category.name)}
              >
                Edit
              </button>

              {openRenameId === category.id && (
                <div
                  className='absolute right-0 top-full z-20 mt-1 w-64 rounded border border-gray-200 bg-white p-3 shadow-lg'
                  role='dialog'
                  aria-label='Rename category'
                >
                  <label
                    htmlFor={`rename-category-${category.id}`}
                    className='mb-1 block text-sm text-gray-700'
                  >
                    Name
                  </label>
                  <input
                    ref={renameInputRef}
                    id={`rename-category-${category.id}`}
                    type='text'
                    className='w-full rounded border border-gray-300 px-2 py-1.5 text-sm'
                    value={renameDraft}
                    onChange={(e) => setRenameDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        applyRename();
                      }
                    }}
                  />
                  <div className='mt-2 flex justify-end gap-2'>
                    <button
                      type='button'
                      className='rounded border border-gray-300 px-2 py-1 text-sm'
                      onClick={cancelRename}
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      className='rounded border border-gray-900 bg-gray-900 px-2 py-1 text-sm text-white'
                      onClick={applyRename}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

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
