import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const fabricatedEvents = [
  {
    title: "Matador Esports Kickoff Mixer",
    description: "Meet the teams, play some friendlies, and grab some free food! Open to all majors.",
    date: "Oct 25, 2026",
    time: "6:00 PM",
    location: "USU Game Console Room",
    game: "General",
    attendeesCount: 45,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop"
  },
  {
    title: "Valorant Varsity Tryouts",
    description: "Are you Radiant material? Come show off your skills for a spot on the official Matador Varsity squad.",
    date: "Oct 26, 2026",
    time: "2:00 PM",
    location: "Matador Discord / Online",
    game: "Valorant",
    attendeesCount: 12,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Super Smash Bros Monthly",
    description: "Our signature monthly tournament. $5 entry, pot goes to top 3. Double elimination.",
    date: "Nov 01, 2026",
    time: "5:00 PM",
    location: "Northridge Center",
    game: "Super Smash Bros.",
    attendeesCount: 32,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Retro Gaming Night: Matador Throwback",
    description: "CRT TVs, N64s, and GameCubes. Come experience the classics with the club.",
    date: "Nov 05, 2026",
    time: "7:00 PM",
    location: "Matador Square",
    game: "Retro",
    attendeesCount: 20,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
  }
];

async function seed() {
  console.log("Seeding events...");
  const eventsCol = collection(db, "events");
  
  // Clear existing (optional)
  // const snapshot = await getDocs(eventsCol);
  // for (const d of snapshot.docs) await deleteDoc(d.ref);

  for (const event of fabricatedEvents) {
    await addDoc(eventsCol, event);
    console.log(`Added: ${event.title}`);
  }
  console.log("Done!");
  process.exit(0);
}

seed();
