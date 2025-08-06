import { Firestore } from '@google-cloud/firestore';

let db;
export async function initFirestore() {
  db = new Firestore({
    projectId: process.env.FIRESTORE_PROJECT_ID,
  });
  console.log('Firestore initialized');
}

export function getFirestore() {
  if (!db) throw new Error('Firestore not initialized');
  return db;
}