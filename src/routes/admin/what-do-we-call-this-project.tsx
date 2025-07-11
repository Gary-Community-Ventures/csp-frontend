import { useState, useEffect, useRef } from 'react';

const PHRASES = [
  "Diaper Dollars", "The Stork Market", "CribCoin", "The Nanny Bank", "Play-Per-View",
  "The Baby Bonus Fund", "Moola for Munchkins", "The Parent Pre-Pay", "Tot-al Support",
  "The Sitter Stipend", "Buck-a-Roo Bucks", "The Giggle Grant", "Naptime Capital",
  "The Potty Training Payout", "The Juice Box Jackpot", "Goldfish & Grants",
  "The Crayon Cache", "Sticky Fingers Fund", "Playdate Payday", "The Sandbox Stipend",
  "The Chaos Cushion", "Tantrum Tamer Trust", "The Sanity Saver", "The Rugrat Race Relief",
  "Sprout Support", "The Kiddy Pool", "Little Rascal Relief", "The Naptime Network",
  "Tiny Tycoon Fund", "The Offspring Offering", "The Toddler Ticket", "The Play-Dough Program",
  "The Blanket Fort Fund", "Sippy Cup Support", "The ABC-Easy Fund", "Go-Go Gaga Grant",
  "The Little Dipper", "The Stroller Stake", "The Swing Set Stipend", "My Little Subsidy",
  "The \"I Need a Break\" Benefit", "The \"Please Watch My Kid\" Fund", "Here's Money For Your Kid",
  "Your Kid, Our Tab", "The Child Care Cash Cannon", "The Procreation Payout",
  "The Parental Parole Program", "The \"Are They Napping Yet?\" Fund", "The \"It Takes a Village\" Voucher",
  "The Grown-Up Gapper", "KidKash", "FamFund", "NestEgg Now", "SproutPay", "Kith & Kin Kash",
  "The Digital Diaper Dosh", "The Parent Portal Payout", "CareCoin (not a real crypto!)",
  "The Village Wallet", "NextGen Nanny Pay", "Uncle Ben's Bucks", "My Friend Benny", "SparkPlug",
  "The Baby Ben Bonus", "The Big Ben-efit", "My Family Spark", "The Friendship Fund",
  "The Neighborhood Network", "Benji's Billfold", "Spark Support",
  "Honey, I Shrunk the Childcare Bill", "The Fast & The Curious Fund", "Baby Shark's Bucks",
  "The Frozen Fund (Let it Dough!)", "Mo' Money, Mo' Playtime", "The Guardian of the Galaxy Grant",
  "Are You There, Gov? It's Me, Parent.", "The Babysitter's Club Card", "The Parent Trap Fund",
  "The Sound of Moolah", "The Uplift", "The Boost", "The Springboard", "The Launchpad",
  "The Anchor", "The Lighthouse", "The Helper Hub", "The Family Fleet", "The Kinship Key",
  "The Nest Builder", "The Care Collective", "The Family Fabric", "The Hearthstone",
  "The Cornerstone", "The Ally Assist", "The Fenway Fund (Because Boston Cares More)",
  "The '27 Rings Was a Long Time Ago' Grant", "The \"Anyone But the Yankees\" Childcare Alliance (ABYCA)",
  "The Sox Subsidy", "The Green Monster Money Match"
];

interface LeaderboardEntry {
  phrase: string;
  count: number;
}

interface BouncingSquareProps {
  onCornerBounce: (phrase: string) => void;
}

// Function to generate a random OKLCH color
const getRandomOklchColor = (minL = 0.2, maxL = 0.9, minC = 0.05, maxC = 0.2) => {
  const l = Math.random() * (maxL - minL) + minL; // Lightness
  const c = Math.random() * (maxC - minC) + minC; // Chroma
  const h = Math.random() * 360; // Hue between 0 and 360
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)})`;
};

const BouncingSquare = ({ onCornerBounce }: BouncingSquareProps) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const dxRef = useRef(3);
  const dyRef = useRef(3);
  const xRef = useRef(0); // Ref for current x position
  const yRef = useRef(0); // Ref for current y position
  const [currentText, setCurrentText] = useState(PHRASES[0]);
  const squareRef = useRef<HTMLDivElement>(null);

  // Effect for initial random position
  useEffect(() => {
    const container = squareRef.current?.parentElement;
    if (container) {
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const squareWidth = 225; // Assuming 225px width
      const squareHeight = 75; // Assuming 75px height

      xRef.current = Math.random() * (containerWidth - squareWidth);
      yRef.current = Math.random() * (containerHeight - squareHeight);
      setX(xRef.current); // Trigger initial render
      setY(yRef.current); // Trigger initial render
      setCurrentText(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
    }
  }, []);

  // Effect for animation loop
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (!squareRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const square = squareRef.current;
      const container = square.parentElement;

      if (!container) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const squareWidth = square.offsetWidth;
      const squareHeight = square.offsetHeight;

      let bouncedX = false;
      let bouncedY = false;

      // Calculate next potential position
      let nextX = xRef.current + dxRef.current;
      let nextY = yRef.current + dyRef.current;

      // Collision detection and direction reversal for X axis
      if (nextX + squareWidth > containerWidth) {
        nextX = containerWidth - squareWidth; // Snap to boundary
        dxRef.current *= -1;
        bouncedX = true;
      } else if (nextX < 0) {
        nextX = 0; // Snap to boundary
        dxRef.current *= -1;
        bouncedX = true;
      }

      // Collision detection and direction reversal for Y axis
      if (nextY + squareHeight > containerHeight) {
        nextY = containerHeight - squareHeight; // Snap to boundary
        dyRef.current *= -1;
        bouncedY = true;
      } else if (nextY < 0) {
        nextY = 0; // Snap to boundary
        dyRef.current *= -1;
        bouncedY = true;
      }

      // Update refs with new positions
      xRef.current = nextX;
      yRef.current = nextY;

      // Update state to trigger re-render
      setX(xRef.current);
      setY(yRef.current);

      // Detect corner bounce
      if (bouncedX && bouncedY) {
        onCornerBounce(currentText);
      }

      // Change text on any bounce (wall or corner)
      if (bouncedX || bouncedY) {
        setCurrentText(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
        // Randomize colors on any wall hit
        const root = document.documentElement;
        root.style.setProperty('--primary', getRandomOklchColor());
        root.style.setProperty('--primary-foreground', getRandomOklchColor());
        root.style.setProperty('--secondary', getRandomOklchColor());
        root.style.setProperty('--secondary-foreground', getRandomOklchColor());
        root.style.setProperty('--background', getRandomOklchColor(0.95, 0.99, 0.01, 0.05)); // Very light, almost white with a splash of color
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []); // Empty dependency array: runs once on mount

  return (
    <div
      ref={squareRef}
      className="absolute w-[225px] h-[75px] bg-black flex items-center justify-center text-white text-center text-[14px] p-[5px] box-border z-10 pointer-events-auto"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {currentText}
    </div>
  );
};

export const WhatDoWeCallThisProject = ({ showLeaderboard = true }: { showLeaderboard?: boolean }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const savedLeaderboard = localStorage.getItem('cornerBounceLeaderboard');
      return savedLeaderboard ? JSON.parse(savedLeaderboard) : [];
    } catch (error) {
      console.error("Failed to load leaderboard from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cornerBounceLeaderboard', JSON.stringify(leaderboard));
    } catch (error) {
      console.error("Failed to save leaderboard to localStorage", error);
    }
  }, [leaderboard]);

  const handleCornerBounce = (phrase: string) => {
    setLeaderboard(prevLeaderboard => {
      const existingEntry = prevLeaderboard.find(entry => entry.phrase === phrase);
      if (existingEntry) {
        return prevLeaderboard.map(entry =>
          entry.phrase === phrase ? { ...entry, count: entry.count + 1 } : entry
        ).sort((a, b) => b.count - a.count); // Sort by count descending
      } else {
        return [...prevLeaderboard, { phrase, count: 1 }].sort((a, b) => b.count - a.count);
      }
    });
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen overflow-hidden z-[9999] flex items-center justify-center pointer-events-none"
    >
      <BouncingSquare onCornerBounce={handleCornerBounce} />
      {showLeaderboard && (
        <div className="p-4 bg-white bg-opacity-75 rounded shadow-lg text-black relative z-0 pointer-events-auto">
          <h2 className="text-lg font-bold mb-2">Corner Bounce Leaderboard</h2>
          {leaderboard.length === 0 ? (
            <p>No corner bounces yet!</p>
          ) : (
            <ol className="list-decimal list-inside">
              {leaderboard.map((entry, index) => (
                <li key={index} className="mb-1">
                  {entry.phrase}: {entry.count}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
};

