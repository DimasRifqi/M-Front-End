import { openDB } from 'idb';

const dbPromise = openDB('user-db', 1, {
  upgrade(db) {
    const store = db.createObjectStore('users', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('name', 'name', { unique: true });
  },
});


export const getUserByName = async (name) => {
  const db = await dbPromise;
  return db.getFromIndex('users', 'name', name);
};


export const getAllUsers = async () => {
  const db = await dbPromise;
  return db.getAll('users');
};

export const addUser = async (user) => {
  return (await dbPromise).add('users', user);
};

export const getUserById = async (id) => {
  return (await dbPromise).get('users', id);
};

export const updateUser = async (user) => {
  return (await dbPromise).put('users', user);
};

export const deleteUserById = async (id) => {
  return (await dbPromise).delete('users', id);
};