import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";

export type LFGIntent = "Casual" | "Competitive";
export type LFGStatus = "Looking" | "In-Game & Looking" | "End Party";

export interface LFGPost {
  id: string;
  authorId: string;
  authorName: string;
  game: string;
  role: string;
  intent: LFGIntent;
  description: string;
  playersNeeded: number;
  playersCurrent: number;
  status: LFGStatus;
  createdAt: string;
}

export function useLFG() {
  const [posts, setPosts] = useState<LFGPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "lfg_posts"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
        } as LFGPost;
      });
      setPosts(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching LFG posts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createLFG = async (post: Omit<LFGPost, "id" | "authorId" | "authorName" | "createdAt">, authorId: string, authorName: string) => {
    try {
      await addDoc(collection(db, "lfg_posts"), {
        ...post,
        authorId,
        authorName,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error creating LFG post:", error);
    }
  };

  const updateLFG = async (id: string, updates: Partial<LFGPost>) => {
    try {
      const docRef = doc(db, "lfg_posts", id);
      if (updates.status === "End Party") {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, updates);
      }
    } catch (error) {
      console.error("Error updating LFG post:", error);
    }
  };

  const deleteLFG = async (id: string) => {
    try {
      await deleteDoc(doc(db, "lfg_posts", id));
    } catch (error) {
      console.error("Error deleting LFG post:", error);
    }
  };

  return { posts, createLFG, updateLFG, deleteLFG, loading };
}

