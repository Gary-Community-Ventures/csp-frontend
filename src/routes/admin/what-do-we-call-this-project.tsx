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

interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
}

interface ColorLeaderboardEntry {
  theme: ThemeColors;
  count: number;
}

interface BouncingBoxProps {
  x: number;
  y: number;
  text: string;
  width: number;
  height: number;
  backgroundColor: string;
  isPaused: boolean; // New prop
}

// Function to generate a random OKLCH color
const getRandomOklchColor = (minL = 0.2, maxL = 0.9, minC = 0.05, maxC = 0.2) => {
  const l = Math.random() * (maxL - minL) + minL; // Lightness
  const c = Math.random() * (maxC - minC) + minC; // Chroma
  const h = Math.random() * 360; // Hue between 0 and 360
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)})`;
};

const BouncingBox = ({ x, y, text, width, height, backgroundColor }: BouncingBoxProps) => {
  return (
    <div
      className="absolute w-[225px] h-[75px] bg-black flex items-center justify-center text-white text-center text-[14px] p-[5px] box-border z-10 pointer-events-auto"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: backgroundColor,
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {text}
    </div>
  );
};

export const WhatDoWeCallThisProject = ({ showLeaderboard = true }: { showLeaderboard?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<{
    id: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    text: string;
    width: number;
    height: number;
    backgroundColor: string;
  }[]>([]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const savedLeaderboard = localStorage.getItem('cornerBounceLeaderboard');
      return savedLeaderboard ? JSON.parse(savedLeaderboard) : [];
    } catch (error) {
      console.error("Failed to load leaderboard from localStorage", error);
      return [];
    }
  });

  const [colorLeaderboard, setColorLeaderboard] = useState<ColorLeaderboardEntry[]>(() => {
    try {
      const savedColorLeaderboard = localStorage.getItem('colorCollisionLeaderboard');
      return savedColorLeaderboard ? JSON.parse(savedColorLeaderboard) : [];
    } catch (error) {
      console.error("Failed to load color leaderboard from localStorage", error);
      return [];
    }
  });

  const [isPaused, setIsPaused] = useState(false); // New state for pausing animation
  const [hoveredTheme, setHoveredTheme] = useState<ThemeColors | null>(null); // New state for hovered theme

  useEffect(() => {
    try {
      localStorage.setItem('cornerBounceLeaderboard', JSON.stringify(leaderboard));
    } catch (error) {
      console.error("Failed to save leaderboard to localStorage", error);
    }
  }, [leaderboard]);

  useEffect(() => {
    try {
      localStorage.setItem('colorCollisionLeaderboard', JSON.stringify(colorLeaderboard));
    } catch (error) {
      console.error("Failed to save color leaderboard to localStorage", error);
    }
  }, [colorLeaderboard]);

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

  const applyThemeToRoot = (theme: ThemeColors) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-foreground', theme.primaryForeground);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--secondary-foreground', theme.secondaryForeground);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--foreground', theme.foreground);
  };

  const randomizeCurrentTheme = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary', getRandomOklchColor());
    root.style.setProperty('--primary-foreground', getRandomOklchColor());
    root.style.setProperty('--secondary', getRandomOklchColor());
    root.style.setProperty('--secondary-foreground', getRandomOklchColor());
    root.style.setProperty('--background', getRandomOklchColor(0.95, 0.99, 0.01, 0.05)); // Very light, almost white with a splash of color
    root.style.setProperty('--foreground', 'oklch(0 0 0)'); // Keep foreground black
  };

  const handleColorCollision = (theme: ThemeColors) => {
    setColorLeaderboard(prevLeaderboard => {
      // Check if an identical theme already exists
      const existingEntryIndex = prevLeaderboard.findIndex(entry =>
        entry.theme.primary === theme.primary &&
        entry.theme.primaryForeground === theme.primaryForeground &&
        entry.theme.secondary === theme.secondary &&
        entry.theme.secondaryForeground === theme.secondaryForeground &&
        entry.theme.background === theme.background &&
        entry.theme.foreground === theme.foreground
      );

      if (existingEntryIndex !== -1) {
        // If theme exists, increment its count
        const updatedLeaderboard = [...prevLeaderboard];
        updatedLeaderboard[existingEntryIndex] = {
          ...updatedLeaderboard[existingEntryIndex],
          count: updatedLeaderboard[existingEntryIndex].count + 1,
        };
        return updatedLeaderboard.sort((a, b) => b.count - a.count);
      } else {
        // If theme is new, add it with count 1
        return [...prevLeaderboard, { theme, count: 1 }].sort((a, b) => b.count - a.count);
      }
    });
  };

  const handleMouseEnterColor = (theme: ThemeColors) => {
    setIsPaused(true);
    setHoveredTheme(theme);
    applyThemeToRoot(theme);
  };

  const handleMouseLeaveColor = () => {
    setIsPaused(false);
    setHoveredTheme(null);
    randomizeCurrentTheme(); // Revert to dynamic theme
  };

  // Initial setup of boxes
  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const createRandomBox = (id: number, speedMultiplier = 1) => {
      const width = 225;
      const height = 75;
      const x = Math.random() * (containerWidth - width);
      const y = Math.random() * (containerHeight - height);
      const dx = (Math.random() > 0.5 ? 3 : -3) * speedMultiplier; // Random initial direction
      const dy = (Math.random() > 0.5 ? 3 : -3) * speedMultiplier; // Random initial direction
      const text = PHRASES[Math.floor(Math.random() * PHRASES.length)];
      const backgroundColor = 'oklch(0 0 0)'; // Fixed black color for boxes
      return { id, x, y, dx, dy, text, width, height, backgroundColor };
    };

    setBoxes([
      createRandomBox(1),
      createRandomBox(2, 1.13),
    ]);

    // Set initial background color for the body
    randomizeCurrentTheme();

  }, [containerRef.current]); // Dependency on containerRef.current

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (!containerRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      if (isPaused) {
        animationFrameId = requestAnimationFrame(animate);
        return; // If paused, just request next frame without updating positions
      }

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      setBoxes(prevBoxes => {
        const updatedBoxes = prevBoxes.map(box => {
          let { x, y, dx, dy, text, width, height } = box;
          let bouncedX = false;
          let bouncedY = false;

          // Wall collision detection
          if (x + dx + width > containerWidth) {
            x = containerWidth - width; // Snap to boundary
            dx *= -1;
            bouncedX = true;
          } else if (x + dx < 0) {
            x = 0; // Snap to boundary
            dx *= -1;
            bouncedX = true;
          }

          if (y + dy + height > containerHeight) {
            y = containerHeight - height; // Snap to boundary
            dy *= -1;
            bouncedY = true;
          } else if (y + dy < 0) {
            y = 0; // Snap to boundary
            dy *= -1;
            bouncedY = true;
          }

          // Update text and randomize colors on any wall hit
          if (bouncedX || bouncedY) {
            text = PHRASES[Math.floor(Math.random() * PHRASES.length)];
            randomizeCurrentTheme(); // Randomize colors on any wall hit
          }

          // Detect corner bounce
          if (bouncedX && bouncedY) {
            handleCornerBounce(text);
          }

          return { ...box, x: x + dx, y: y + dy, dx, dy, text };
        });

        // Box-to-box collision detection
        for (let i = 0; i < updatedBoxes.length; i++) {
          for (let j = i + 1; j < updatedBoxes.length; j++) {
            const boxA = updatedBoxes[i];
            const boxB = updatedBoxes[j];

            // Simple AABB collision detection
            if (
              boxA.x < boxB.x + boxB.width &&
              boxA.x + boxA.width > boxB.x &&
              boxA.y < boxB.y + boxB.height &&
              boxA.y + boxA.height > boxB.y
            ) {
              // Collision detected, reverse velocities
              // Calculate overlap
              const overlapX = Math.min(boxA.x + boxA.width - boxB.x, boxB.x + boxB.width - boxA.x);
              const overlapY = Math.min(boxA.y + boxA.height - boxB.y, boxB.y + boxB.height - boxA.y);

              if (overlapX < overlapY) {
                // Resolve collision on X axis
                if (boxA.x < boxB.x) {
                  boxA.x -= overlapX / 2;
                  boxB.x += overlapX / 2;
                } else {
                  boxA.x += overlapX / 2;
                  boxB.x -= overlapX / 2;
                }
                boxA.dx *= -1;
                boxB.dx *= -1;
              } else {
                // Resolve collision on Y axis
                if (boxA.y < boxB.y) {
                  boxA.y -= overlapY / 2;
                  boxB.y += overlapY / 2;
                } else {
                  boxA.y += overlapY / 2;
                  boxB.y -= overlapY / 2;
                }
                boxA.dy *= -1;
                boxB.dy *= -1;
              }
              // Get current theme colors and record them
              const root = document.documentElement;
              const currentTheme: ThemeColors = {
                primary: root.style.getPropertyValue('--primary'),
                primaryForeground: root.style.getPropertyValue('--primary-foreground'),
                secondary: root.style.getPropertyValue('--secondary'),
                secondaryForeground: root.style.getPropertyValue('--secondary-foreground'),
                background: root.style.getPropertyValue('--background'),
                foreground: root.style.getPropertyValue('--foreground'),
              };
              handleColorCollision(currentTheme);
            }
          }
        }

        return updatedBoxes;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]); // isPaused is in dependency array to react to pause/resume

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-screen h-screen overflow-hidden z-[9999] flex items-center justify-center pointer-events-none"
    >
      {boxes.map(box => (
        <BouncingBox
          key={box.id}
          x={box.x}
          y={box.y}
          text={box.text}
          width={box.width}
          height={box.height}
          backgroundColor={box.backgroundColor}
          isPaused={isPaused} // Pass isPaused prop
        />
      ))}
      {showLeaderboard && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 pointer-events-auto">
          <div className="p-4 bg-white bg-opacity-75 rounded shadow-lg text-black relative z-0">
            <h2 className="text-lg font-bold mb-2">Corner Bounce Leaderboard</h2>
            {leaderboard.length === 0 ? (
              <p>No corner bounces yet!</p>
            ) : (
              <ol className="list-inside">
                {leaderboard.map((entry, index) => (
                  <li key={index} className="mb-1">
                    {entry.phrase}: {entry.count}
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="p-4 bg-white bg-opacity-75 rounded shadow-lg text-black relative z-0">
            <h2 className="text-lg font-bold mb-2">Color Collisions</h2>
            {colorLeaderboard.length === 0 ? (
              <p>No color collisions yet!</p>
            ) : (
              <ol className="list-inside">
                {colorLeaderboard.map((entry, index) => (
                  <li
                    key={index}
                    className="mb-1 cursor-pointer"
                    onMouseEnter={() => handleMouseEnterColor(entry.theme)}
                    onMouseLeave={handleMouseLeaveColor}
                  >
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <span style={{ backgroundColor: entry.theme.primary, display: 'inline-block', width: '15px', height: '15px', border: '1px solid #ccc' }}></span>
                      <span style={{ backgroundColor: entry.theme.primaryForeground, display: 'inline-block', width: '15px', height: '15px', border: '1px solid #ccc' }}></span>
                      <span style={{ backgroundColor: entry.theme.secondary, display: 'inline-block', width: '15px', height: '15px', border: '1px solid #ccc' }}></span>
                      <span style={{ backgroundColor: entry.theme.secondaryForeground, display: 'inline-block', width: '15px', height: '15px', border: '1px solid #ccc' }}></span>
                      <span style={{ backgroundColor: entry.theme.background, display: 'inline-block', width: '15px', height: '15px', border: '1px solid #ccc' }}></span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
};