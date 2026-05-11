import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, db } from "../../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type Role = "Member" | "Player" | "Coach";

export interface User {
  id: string;
  username: string;
  role: Role;
  csunId: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (csunId: string, password: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUser({ id: firebaseUser.uid, ...docSnap.data() } as User);
        } else {
          // Fallback if profile is missing (shouldn't happen with our login flow)
          setUser({
            id: firebaseUser.uid,
            username: firebaseUser.email?.split("@")[0] || "Unknown",
            role: "Member",
            csunId: firebaseUser.email?.split("@")[0] || "",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (csunId: string, password: string, role: Role) => {
    const email = `${csunId}@csun.edu`;
    try {
      // Try to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // If role was explicitly chosen in login, we might want to update it, 
      // but usually role is set at registration. We'll update it here for testing ease.
      const docRef = doc(db, "users", userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await setDoc(docRef, { role }, { merge: true });
        setUser((prev) => prev ? { ...prev, role } : null);
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        // If user not found, create them (this acts as a seamless signup for testing)
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const newUser: Omit<User, "id"> = {
            username: `Matador_${csunId.slice(-4)}`,
            role: role,
            csunId: csunId,
          };
          await setDoc(doc(db, "users", userCredential.user.uid), newUser);
          setUser({ id: userCredential.user.uid, ...newUser });
        } catch (signupError) {
          console.error("Signup failed:", signupError);
          throw signupError;
        }
      } else {
        console.error("Login failed:", error);
        throw error;
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
