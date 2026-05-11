import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";

export type LFGIntent = "Casual" | "Competitive";

export interface LFGPost {
  id: string;
  authorId: string;
  authorName: string;
  game: string;
  rank: string;
  intent: LFGIntent;
  description: string;
  playersNeeded: number;
  playersCurrent: number;
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

  const createLFG = async (post: Omit<LFGPost, "id" | "authorId" | "authorName" | "playersCurrent" | "createdAt">, authorId: string, authorName: string) => {
    try {
      await addDoc(collection(db, "lfg_posts"), {
        ...post,
        authorId,
        authorName,
        playersCurrent: 1,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error creating LFG post:", error);
    }
  };

  const deleteLFG = async (id: string) => {
    try {
      await deleteDoc(doc(db, "lfg_posts", id));
    } catch (error) {
      console.error("Error deleting LFG post:", error);
    }
  };

  return { posts, createLFG, deleteLFG, loading };
}

