export interface SkillMetric {
  name: string;
  label: string;
  description: string;
}

export interface GameMetrics {
  gameSkills: SkillMetric[];
  roles: {
    [roleName: string]: SkillMetric[];
  };
}

export const GAME_METRICS_MAP: Record<string, GameMetrics> = {
  "Valorant": {
    gameSkills: [
      { name: "aim", label: "Mechanical Aim", description: "Precision, tracking, and flick consistency." },
      { name: "utility", label: "Utility Usage", description: "Efficiency and timing of ability usage." },
      { name: "comms", label: "Communication", description: "Clarity and frequency of callouts." },
      { name: "sense", label: "Game Sense", description: "Decision making and map awareness." },
    ],
    roles: {
      "Duelist": [
        { name: "entry", label: "Entry Success", description: "Creating space for the team on site takes." },
        { name: "first_blood", label: "First Bloods", description: "Winning opening duels." },
        { name: "spacing", label: "Spacing", description: "Trading and being tradable." }
      ],
      "Initiator": [
        { name: "info", label: "Information", description: "Clearing angles and finding enemy positions." },
        { name: "assists", label: "Assist Utility", description: "Setting up teammates for kills." },
        { name: "post_plant", label: "Post-Plant", description: "Holding the objective after plant." }
      ],
      "Controller": [
        { name: "smoke_timing", label: "Smoke Timing", description: "Blocking vision at critical moments." },
        { name: "vision_control", label: "Vision Control", description: "Denying info to the enemy." },
        { name: "anchoring", label: "Anchoring", description: "Holding sites solo effectively." }
      ],
      "Sentinel": [
        { name: "site_hold", label: "Site Hold", description: "Using utility to stall or stop pushes." },
        { name: "flank_watch", label: "Flank Watch", description: "Protecting the team from behind." },
        { name: "durability", label: "Persistence", description: "Staying alive to keep utility active." }
      ]
    }
  },
  "League of Legends": {
    gameSkills: [
      { name: "laning", label: "Laning Phase", description: "CSing, trading, and wave management." },
      { name: "map_awareness", label: "Map Awareness", description: "Tracking jungler and objectives." },
      { name: "teamfighting", label: "Teamfighting", description: "Positioning and focus in 5v5s." },
      { name: "objectives", label: "Objectives", description: "Dragon, Baron, and Turret control." },
    ],
    roles: {
      "Top": [
        { name: "tp_usage", label: "TP Usage", description: "Impactful teleport plays." },
        { name: "splitpush", label: "Splitpushing", description: "Applying side lane pressure." },
        { name: "frontline", label: "Frontlining", description: "Creating space and soaking damage." }
      ],
      "Jungle": [
        { name: "pathing", label: "Pathing", description: "Efficient clearing and counter-jungling." },
        { name: "ganking", label: "Ganking", description: "Successful lane interventions." },
        { name: "smite", label: "Smite Accuracy", description: "Securing objectives under pressure." }
      ],
      "Mid": [
        { name: "roaming", label: "Roaming", description: "Helping other lanes and jungler." },
        { name: "burst_dps", label: "Burst/DPS", description: "Applying damage effectively." },
        { name: "wave_control", label: "Wave Control", description: "Controlling the mid priority." }
      ],
      "ADC": [
        { name: "kiting", label: "Kiting", description: "Moving while attacking to stay safe." },
        { name: "positioning", label: "Positioning", description: "Safety in fights while dealing max DPS." },
        { name: "late_game", label: "Late Game Carry", description: "Closing out games with damage." }
      ],
      "Support": [
        { name: "vision", label: "Vision Score", description: "Ward placement and denial." },
        { name: "peel", label: "Peeling", description: "Protecting the carries." },
        { name: "engage", label: "Engage", description: "Finding pick opportunities." }
      ]
    }
  },
  "Overwatch 2": {
    gameSkills: [
      { name: "aim", label: "Mechanical Aim", description: "Tracking and projectile leading." },
      { name: "positioning", label: "Positioning", description: "Use of cover and high ground." },
      { name: "ult_economy", label: "Ultimate Economy", description: "Efficiency and tracking of ults." },
      { name: "coordination", label: "Team Coordination", description: "Focus fire and ability combos." },
    ],
    roles: {
      "Tank": [
        { name: "space", label: "Space Creation", description: "Pushing forward and holding lines." },
        { name: "mitigation", label: "Damage Mitigation", description: "Protecting the team from burst." },
        { name: "engage", label: "Engage/Disengage", description: "Starting or ending fights cleanly." }
      ],
      "DPS": [
        { name: "assassination", label: "Assassination", description: "Picking off high-priority targets." },
        { name: "pressure", label: "Consistent Pressure", description: "Forcing enemy cooldowns." },
        { name: "dueling", label: "Dueling", description: "Winning 1v1 encounters." }
      ],
      "Support": [
        { name: "healing_priority", label: "Healing Priority", description: "Keeping the right people alive." },
        { name: "survival", label: "Self-Survival", description: "Staying alive while under pressure." },
        { name: "utility_impact", label: "Utility Impact", description: "Game-changing sleep darts/suzus/etc." }
      ]
    }
  },
  "Rocket League": {
    gameSkills: [
      { name: "mechanics", label: "Technical Mechanics", description: "Aerials, dribbling, and wall play." },
      { name: "rotation", label: "Rotation", description: "Proper positioning in the team cycle." },
      { name: "boost_management", label: "Boost Management", description: "Pathing and efficiency." },
      { name: "speed", label: "Recovery Speed", description: "Getting back into the play quickly." },
    ],
    roles: {
      "Player": [
        { name: "striking", label: "Striking", description: "Power and accuracy on shots." },
        { name: "defense", label: "Saves/Defense", description: "Shadow defense and goal-line saves." },
        { name: "playmaking", label: "Playmaking", description: "Passing and setting up teammates." }
      ]
    }
  },
  "Default": {
    gameSkills: [
      { name: "mechanics", label: "Mechanics", description: "Raw physical execution." },
      { name: "strategy", label: "Strategy", description: "Macro play and decision making." },
      { name: "teamwork", label: "Teamwork", description: "Coordination with others." },
      { name: "mental", label: "Mental", description: "Focus, tilt-proof, and attitude." }
    ],
    roles: {
      "Player": [
        { name: "consistency", label: "Consistency", description: "Level of play across matches." },
        { name: "versatility", label: "Versatility", description: "Adapting to different situations." },
        { name: "growth", label: "Growth", description: "Speed of learning and improvement." }
      ]
    }
  }
};
