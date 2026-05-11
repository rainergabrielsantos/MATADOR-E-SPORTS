import { useState, useEffect } from "react";

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

const initialLFG: LFGPost[] = [
  {
    id: "l1",
    authorId: "u1",
    authorName: "RedMatador",
    game: "Valorant",
    rank: "Diamond 2",
    intent: "Competitive",
    description: "Looking for Support / Sentinel for Premier grind.",
    playersNeeded: 5,
    playersCurrent: 3,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "l2",
    authorId: "u2",
    authorName: "MatadorGG",
    game: "League of Legends",
    rank: "Gold 1",
    intent: "Casual",
    description: "Just for fun normals, need a jungle main.",
    playersNeeded: 5,
    playersCurrent: 4,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  }
];

export function useLFG() {
  const [posts, setPosts] = useState<LFGPost[]>(() => {
    const saved = localStorage.getItem("matador_lfg");
    return saved ? JSON.parse(saved) : initialLFG;
  });

  useEffect(() => {
    localStorage.setItem("matador_lfg", JSON.stringify(posts));
  }, [posts]);

  const createLFG = (post: Omit<LFGPost, "id" | "authorId" | "authorName" | "playersCurrent" | "createdAt">, authorId: string, authorName: string) => {
    const newPost: LFGPost = {
      ...post,
      id: `l${Date.now()}`,
      authorId,
      authorName,
      playersCurrent: 1,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const deleteLFG = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return { posts, createLFG, deleteLFG };
}
