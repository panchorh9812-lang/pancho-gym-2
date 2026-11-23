/* PANCHO GYM 2.0 - IndexedDB local persistence */
(() => {
  'use strict';

  const DB_NAME = 'pancho-gym-2';
  const DB_VERSION = 1;
  const STORES = ['profiles', 'routines', 'sessions', 'measurements', 'photos'];
  let connection;

  function open() {
    if (connection) return Promise.resolve(connection);
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('Este navegador no admite IndexedDB. Actualiza Chrome para continuar.'));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('profiles')) db.createObjectStore('profiles', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('routines')) {
          const store = db.createObjectStore('routines', { keyPath: 'id' });
          store.createIndex('profileId', 'profileId', { unique: false });
        }
        if (!db.objectStoreNames.contains('sessions')) {
          const store = db.createObjectStore('sessions', { keyPath: 'id' });
          store.createIndex('profileId', 'profileId', { unique: false });
        }
        if (!db.objectStoreNames.contains('measurements')) {
          const store = db.createObjectStore('measurements', { keyPath: 'id' });
          store.createIndex('profileId', 'profileId', { unique: false });
        }
        if (!db.objectStoreNames.contains('photos')) {
          const store = db.createObjectStore('photos', { keyPath: 'id' });
          store.createIndex('profileId', 'profileId', { unique: false });
        }
      };
      request.onsuccess = () => {
        connection = request.result;
        connection.onversionchange = () => {
          connection.close();
          connection = null;
        };
        resolve(connection);
      };
      request.onerror = () => reject(request.error || new Error('No se pudo abrir la base de datos.'));
      request.onblocked = () => reject(new Error('La base de datos está bloqueada por otra pestaña abierta. Cierra otras pestañas de PANCHO GYM.'));
    });
  }

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Error de almacenamiento.'));
    });
  }

  async function getAll(storeName) {
    const db = await open();
    const tx = db.transaction(storeName, 'readonly');
    return requestResult(tx.objectStore(storeName).getAll());
  }

  async function get(storeName, id) {
    const db = await open();
    const tx = db.transaction(storeName, 'readonly');
    return requestResult(tx.objectStore(storeName).get(id));
  }

  async function put(storeName, value) {
    const db = await open();
    const tx = db.transaction(storeName, 'readwrite');
    const result = await requestResult(tx.objectStore(storeName).put(value));
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error('No se pudieron guardar los cambios.'));
      tx.onabort = () => reject(tx.error || new Error('Se canceló el guardado.'));
    });
    return result;
  }

  async function remove(storeName, id) {
    const db = await open();
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error('No se pudo eliminar el registro.'));
      tx.onabort = () => reject(tx.error || new Error('Se canceló la eliminación.'));
    });
  }

  async function byProfile(storeName, profileId) {
    const db = await open();
    const tx = db.transaction(storeName, 'readonly');
    const index = tx.objectStore(storeName).index('profileId');
    return requestResult(index.getAll(profileId));
  }

  async function seed() {
    const profiles = await getAll('profiles');
    if (profiles.length) {
      // Completa las rutinas existentes: mínimo seis ejercicios por día, sin duplicar movimientos.
      const allRoutines = await getAll('routines');
      const exercisePool = [
        ['shoulder-press', 'row', 'biceps-curl', 'glute-bridge'],
        ['squat', 'lat-pulldown', 'push-up', 'plank'],
        ['jumping-jacks', 'treadmill', 'mountain-climber', 'child-pose']
      ];
      for (const routine of allRoutines) {
        let routineChanged = false;
        (routine.days || []).forEach((day, dayIndex) => {
          if (!Array.isArray(day.exercises)) day.exercises = [];
          const candidates = exercisePool[dayIndex % exercisePool.length];
          for (const exerciseId of candidates) {
            if (day.exercises.length >= 6) break;
            if (!day.exercises.some(ex => ex.exerciseId === exerciseId)) {
              day.exercises.push({ exerciseId, sets: 3, reps: 10, rest: 60, weight: 0 });
              routineChanged = true;
            }
          }
          // Si el día ya tiene seis o más ejercicios, se conserva tal cual.
        });
        if (routineChanged) {
          routine.updatedAt = new Date().toISOString();
          await put('routines', routine);
        }
      }

      // Actualiza la rutina inicial ya guardada en dispositivos existentes sin borrar su historial.
      const starter = await get('routines', 'routine-me-starter');
      if (starter?.days?.length) {
        const additions = [
          ['shoulder-press', 'treadmill'],
          ['squat', 'lat-pulldown'],
          ['push-up', 'plank']
        ];
        let changed = false;
        starter.days.forEach((day, index) => {
          const extras = additions[index] || additions[0];
          for (const exerciseId of extras) {
            if (day.exercises.length >= 6) break;
            if (!day.exercises.some(ex => ex.exerciseId === exerciseId)) {
              day.exercises.push({ exerciseId, sets: 3, reps: 10, rest: 60, weight: 0 });
              changed = true;
            }
          }
        });
        if (changed) {
          starter.updatedAt = new Date().toISOString();
          await put('routines', starter);
        }
      }
      return profiles;
    }
    const now = new Date().toISOString();
    const mine = {
      id: 'profile-me', name: 'Mi perfil', age: '', weight: '', height: '',
      goal: 'Perder grasa y conservar músculo', experience: 'Principiante',
      availability: ['Lunes', 'Miércoles', 'Viernes'], createdAt: now, updatedAt: now
    };
    const sister = {
      id: 'profile-sister', name: 'Perfil de mi hermana', age: '', weight: '', height: '',
      goal: 'Mejorar condición física', experience: 'Principiante',
      availability: ['Martes', 'Jueves', 'Sábado'], createdAt: now, updatedAt: now
    };
    const routine = {
      id: 'routine-me-starter', profileId: mine.id, name: 'Fuerza + acondicionamiento',
      goal: 'Perder grasa y conservar músculo', location: 'Gimnasio', createdAt: now, updatedAt: now,
      days: [
        { id: 'day-a', name: 'Día A · Cuerpo completo', exercises: [
          { exerciseId: 'squat', sets: 3, reps: 10, rest: 90, weight: 0 },
          { exerciseId: 'push-up', sets: 3, reps: 10, rest: 60, weight: 0 },
          { exerciseId: 'lat-pulldown', sets: 3, reps: 12, rest: 75, weight: 0 },
          { exerciseId: 'plank', sets: 3, reps: 30, rest: 45, weight: 0 },
          { exerciseId: 'shoulder-press', sets: 3, reps: 10, rest: 60, weight: 0 },
          { exerciseId: 'treadmill', sets: 2, reps: 10, rest: 45, weight: 0 }
        ]},
        { id: 'day-b', name: 'Día B · Pierna y core', exercises: [
          { exerciseId: 'deadlift', sets: 3, reps: 8, rest: 120, weight: 0 },
          { exerciseId: 'lunge', sets: 3, reps: 10, rest: 60, weight: 0 },
          { exerciseId: 'glute-bridge', sets: 3, reps: 12, rest: 60, weight: 0 },
          { exerciseId: 'mountain-climber', sets: 3, reps: 20, rest: 45, weight: 0 },
          { exerciseId: 'squat', sets: 3, reps: 10, rest: 75, weight: 0 },
          { exerciseId: 'jumping-jacks', sets: 2, reps: 30, rest: 45, weight: 0 }
        ]},
        { id: 'day-c', name: 'Día C · Tren superior + cardio', exercises: [
          { exerciseId: 'shoulder-press', sets: 3, reps: 10, rest: 75, weight: 0 },
          { exerciseId: 'row', sets: 3, reps: 12, rest: 75, weight: 0 },
          { exerciseId: 'biceps-curl', sets: 2, reps: 12, rest: 60, weight: 0 },
          { exerciseId: 'jumping-jacks', sets: 3, reps: 30, rest: 45, weight: 0 },
          { exerciseId: 'lat-pulldown', sets: 3, reps: 10, rest: 75, weight: 0 },
          { exerciseId: 'push-up', sets: 2, reps: 10, rest: 60, weight: 0 }
        ]}
      ]
    };
    const db = await open();
    const tx = db.transaction(['profiles', 'routines'], 'readwrite');
    tx.objectStore('profiles').put(mine);
    tx.objectStore('profiles').put(sister);
    tx.objectStore('routines').put(routine);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error('No se pudieron crear los perfiles iniciales.'));
      tx.onabort = () => reject(tx.error || new Error('Se canceló la inicialización.'));
    });
    return [mine, sister];
  }

  async function profileBundle(profileId) {
    const [profile, routines, sessions, measurements, photos] = await Promise.all([
      get('profiles', profileId), byProfile('routines', profileId), byProfile('sessions', profileId),
      byProfile('measurements', profileId), byProfile('photos', profileId)
    ]);
    return { profile, routines, sessions, measurements, photos };
  }

  async function allData() {
    const entries = await Promise.all(STORES.map(getAll));
    return Object.fromEntries(STORES.map((store, i) => [store, entries[i]]));
  }

  async function replaceAll(data) {
    const db = await open();
    const tx = db.transaction(STORES, 'readwrite');
    for (const storeName of STORES) {
      const store = tx.objectStore(storeName);
      store.clear();
      for (const row of data[storeName]) store.put(row);
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error('No se pudo restaurar el respaldo.'));
      tx.onabort = () => reject(tx.error || new Error('La restauración se canceló.'));
    });
  }

  window.GymDB = { open, getAll, get, put, remove, byProfile, seed, profileBundle, allData, replaceAll, STORES };
})();
