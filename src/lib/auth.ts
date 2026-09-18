import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User | null> {
  const isMobile = typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    await signInWithRedirect(auth, googleProvider);
    return null;
  } else {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
  // Remove session cookie
  await fetch("/api/auth/session", { method: "DELETE" });
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export { auth };
