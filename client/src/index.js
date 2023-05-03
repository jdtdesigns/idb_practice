import './css/style.css';

import { openDB } from 'idb';

async function getNames() {
  const nameDb = await openDB('names_db', 1);

  const tx = nameDb.transaction('names_db', 'readonly');

  const store = tx.objectStore('names_db');

  const names = await store.getAll();

  const namesOutput = document.querySelector('.names');

  namesOutput.innerHTML = '';

  names.forEach(person => {
    namesOutput.insertAdjacentHTML('beforeend', `
    <p>${person.name}</p>
    `);
  })
}

async function addName(eventObj) {
  eventObj.preventDefault();
  const nameInput = document.querySelector('#name-input');

  const nameDb = await openDB('names_db', 1);

  const tx = nameDb.transaction('names_db', 'readwrite');

  const store = tx.objectStore('names_db');

  try {
    // Add the name to the IDB store
    await store.add({
      name: nameInput.value
    });

    getNames();
    // Clear the name input to get ready for a new name
    nameInput.value = '';
    console.log('Name added');
  } catch (err) {
    console.log(err);
  }
}

async function allSystemsGo() {
  await openDB('names_db', 1, {
    upgrade(indexedDB) {
      if (indexedDB.objectStoreNames.contains('names_db')) {
        return console.log('Names db already exists.');
      }

      indexedDB.createObjectStore('names_db', {
        keyPath: 'id',
        autoIncrement: true
      });

      console.log('Names db created');
    }
  });

  // Get all names on page load
  getNames();
}

const nameForm = document.querySelector('#name-form');

nameForm.addEventListener('submit', addName);

allSystemsGo();


if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

