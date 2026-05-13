import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  setDoc, 
  getDoc,
  arrayUnion
} from "firebase/firestore";

export interface GameSkillSnapshot {
  timestamp: string;
  metrics: Record<string, number>;
}

export interface PlayerStats {
  userId: string;
  games: Record<string, {
    current: Record<string, number>;
    history: GameSkillSnapshot[];
  }>;
  // Aggregated/Legacy overview
  current: {
    aim: number;
    sense: number;
    mental: number;
  };
  history: {
    timestamp: string;
    aim: number;
    sense: number;
    mental: number;
  }[];
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

  const updatePlayerStats = async (
    targetUserId: string, 
    gameName: string, 
    newMetrics: Record<string, number>
  ) => {
    try {
      const docRef = doc(db, "player_stats", targetUserId);
      const timestamp = new Date().toISOString();
      
      const gameSnapshot: GameSkillSnapshot = {
        timestamp,
        metrics: newMetrics
      };

      // Calculate simple aggregates for the global overview
      // We'll map some known keys to aim/sense/mental
      const scores = Object.values(newMetrics);
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      
      // Simple heuristic for aggregation:
      // If the metric name contains certain keywords, add to that category
      const legacyStats = {
        aim: newMetrics["aim"] || newMetrics["mechanics"] || avg * 20, // converting 5-star to percentage
        sense: newMetrics["sense"] || newMetrics["strategy"] || avg * 20,
        mental: newMetrics["mental"] || newMetrics["comms"] || avg * 20
      };

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          userId: targetUserId,
          current: legacyStats,
          history: [{ timestamp, ...legacyStats }],
          games: {
            [gameName]: {
              current: newMetrics,
              history: [gameSnapshot]
            }
          }
        });
      } else {
        const currentData = docSnap.data() as PlayerStats;
        const games = currentData.games || {};
        const gameData = games[gameName] || { current: {}, history: [] };
        
        await updateDoc(docRef, {
          current: legacyStats,
          history: arrayUnion({ timestamp, ...legacyStats }),
          [`games.${gameName}`]: {
            current: newMetrics,
            history: [...(gameData.history || []), gameSnapshot]
          }
        });
      }
    } catch (error) {
      console.error("Error updating player stats:", error);
      throw error;
    }
  };

  return { stats, updatePlayerStats, loading };
}
