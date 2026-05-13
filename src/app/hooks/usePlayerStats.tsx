import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  setDoc, 
  getDoc,
  Timestamp,
  arrayUnion
} from "firebase/firestore";

export interface SkillSnapshot {
  timestamp: string;
  aim: number;
  sense: number;
  mental: number;
}

export interface PlayerStats {
  userId: string;
  history: SkillSnapshot[];
  current: {
    aim: number;
    sense: number;
    mental: number;
  };
}

export function usePlayerStats(userId?: string) {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, "player_stats", userId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setStats(docSnap.data() as PlayerStats);
      } else {
        setStats(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const updatePlayerStats = async (targetUserId: string, newStats: { aim: number; sense: number; mental: number }) => {
    try {
      const docRef = doc(db, "player_stats", targetUserId);
      const snapshot: SkillSnapshot = {
        timestamp: new Date().toISOString(),
        ...newStats
      };

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          userId: targetUserId,
          current: newStats,
          history: [snapshot]
        });
      } else {
        await updateDoc(docRef, {
          current: newStats,
          history: arrayUnion(snapshot)
        });
      }
    } catch (error) {
      console.error("Error updating player stats:", error);
      throw error;
    }
  };

  return { stats, updatePlayerStats, loading };
}
