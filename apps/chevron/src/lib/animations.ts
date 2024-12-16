import { emojiBlast } from "emoji-blast";

// These are currently unused; may replace the rocket emojiBlast animation
// Can increase the number of emojis to scale with the user's performance
const handleEmojiBlast = () => {
  emojiBlast({
    emojis: ["💯"],
    emojiCount: 55,
    position: {
      x: innerWidth / 2,
      y: innerHeight / 2
    }
  });
};

const handleEmojiBlastTwo = () => {
  emojiBlast({
    emojis: ["💯", "🔥", "👍"],
    emojiCount: 55,
    position: {
      x: innerWidth / 2,
      y: innerHeight / 2
    }
  });
};
// ---------------------------------------------------------------

const rocket = (blastYPos: number) => {
    emojiBlast({
      emojiCount: 1,
      emojis: ["🚀"],
      physics: {
        fontSize: 45,
        gravity: 0,
        initialVelocities: {
          x: 12,
          y: -10
        },
        rotation: 0,
        rotationDeceleration: 0
      },
      position: {
        x: 150,
        y: blastYPos
      }
    });
  };

  const clouds = (blastYPos: number) => {
    emojiBlast({
      emojiCount: 10,
      emojis: ["☁️"],
      physics: {
        fontSize: { max: 50, min: 38 },
        gravity: 0.1,
        initialVelocities: {
          x: { max: 7, min: -7 },
          y: { max: -2, min: -5 }
        },
        rotation: 0,
        rotationDeceleration: 0
      },
      position: {
        x: 150,
        y: blastYPos
      }
    });
  };

  const sparkles = (blastYPos: number) => {
    emojiBlast({
      emojiCount: 10,
      emojis: ["✨"],
      physics: {
        fontSize: { max: 30, min: 10 },
        gravity: 0.2,
        initialVelocities: {
          x: { max: 20, min: -15 },
          y: { max: 20, min: -15 }
        }
      },
      position: {
        x: 200,
        y: blastYPos - 60
      }
    });
  };


  // Rocket blask animation: 
  // currently used when user writes an excellent summary
  export const rocketBlast = (blastYPos: number) => {
    rocket(blastYPos);
    clouds(blastYPos);
    setTimeout(() => sparkles(blastYPos), 400);
  };