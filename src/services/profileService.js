    // src/services/profileService.js
import { getFirestore } from '../utils/firestore.js';

const usersCol = () => getFirestore().collection('users');

export async function getUserProfile(email) {
  const doc = await usersCol().doc(email).get();
  if (!doc.exists) throw Object.assign(new Error('User tidak ditemukan'), { status: 404 });
  const data = doc.data();
  return { email, username: data.username, role: data.role, avatarUrl: data.avatarUrl || null };
}

export async function updateUserAvatar(email, avatarUrl) {
  // Make sure the user document exists before updating:
  const userDoc = usersCol().doc(email);
  const doc = await userDoc.get();
  if (!doc.exists) throw new Error('User tidak ditemukan');
  
  await userDoc.update({ avatarUrl });
}