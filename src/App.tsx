import { useState, useEffect } from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

// 💖 Heart interface for TypeScript
interface Heart {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
}

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const createHeart = () => {
      const heart: Heart = {
        id: Math.random(),
        left: Math.random() * 100,
        animationDuration: Math.random() * 3 + 4,
        // 💖 HEART SIZE CONTROL: Increase these numbers to make hearts larger
        // Current: 15-35px, try 25-45px for bigger hearts
        size: Math.random() * 30 + 25, // Made hearts bigger (was 20 + 15)
      };
      
      setHearts(prev => [...prev, heart]);
      
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== heart.id));
      }, heart.animationDuration * 1000);
    };

    const interval = setInterval(createHeart, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute animate-bounce"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animation: `float ${heart.animationDuration}s ease-out forwards`,
          }}
        >
          💖
        </div>
      ))}
    </div>
  );
};

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 animate-pulse"></div>
      
      {/* Animated circles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          ></div>
        ))}
      </div>
      
      {/* ✨ SPARKLE SIZE CONTROL: Change fontSize range to make sparkles bigger/smaller */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-200 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              // SPARKLE SIZE: Current 10-20px, try 15-25px for bigger sparkles
              fontSize: `${Math.random() * 15 + 15}px`, // Made sparkles bigger (was 10 + 10)
            }}
          >
            ✨
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    //window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
       <AnimatedBackground />

      
      {/* Floating Hearts */}
      {/* MOARRR 💖s */}
      <FloatingHearts />
      <FloatingHearts />
      <FloatingHearts />
      
      {/* Mouse follower */}
      <div
        className="fixed pointer-events-none z-20 transition-transform duration-100 ease-out"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      >
        <div className="w-5 h-5 bg-white/30 rounded-full animate-pulse"></div>
      </div>

      {/* 🎯 MAIN CONTENT - CENTERING & SIZING CONTROL */}
      {/* 
        CENTERING CLASSES EXPLAINED:
        - flex: Makes container a flexbox
        - flex-col: Stacks items vertically  
        - items-center: Centers horizontally
        - justify-center: Centers vertically
        - min-h-screen: Takes full viewport height
        - text-center: Centers text alignment
      */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 text-center">
        
        {/* 📝 TITLE SECTION */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          {/* 
            H1 TEXT SIZE CONTROL:
            - Current: text-4xl (36px) on mobile, text-8xl (128px) on desktop
            - For bigger: try text-6xl sm:text-9xl lg:text-[10rem]
            - For smaller: try text-3xl sm:text-6xl lg:text-8xl
          */}
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold text-white mb-4 drop-shadow-2xl animate-pulse">
            JAC's Marriage
          </h1>
        </div>

        {/* ⏰ COUNTDOWN SECTION - SIZING CONTROLLED BY CSS BELOW */}
        <div className="transform hover:scale-110 transition-transform duration-300 mb-8">
          {/* 
            FLIP CLOCK SIZE: Controlled by CSS media queries below
            - Mobile: 60x80px digits, 48px font
            - Tablet: 80x100px digits, 60px font  
            - Desktop: 150x200px digits, 100px font (MADE BIGGER!)
          */}
          
          {/* 📅 DATE SETTING OPTIONS - Choose one method below: */}
          
          {/* METHOD 1: Simple date string (RECOMMENDED) */}
          <FlipClockCountdown to={new Date('2025-09-01T00:00:00').getTime()}>
            Finished
          </FlipClockCountdown>
          
          {/* METHOD 2: With specific time (e.g., 6 PM on Sept 1st) */}
          {/* <FlipClockCountdown to={new Date('2025-09-01T18:00:00').getTime()}>
            Finished
          </FlipClockCountdown> */}
          
          {/* METHOD 3: Using Date constructor with year, month-1, day */}
          {/* <FlipClockCountdown to={new Date(2025, 8, 1).getTime()}>
            Finished
          </FlipClockCountdown> */}
          
          {/* METHOD 4: More readable format */}
          {/* <FlipClockCountdown to={new Date('September 1, 2025').getTime()}>
            Finished
          </FlipClockCountdown> */}
        </div>

        {/* 🎊 DECORATIVE EMOJIS */}
        <div className="flex gap-4 sm:gap-6 lg:gap-8">
          {/* 
            EMOJI SIZE CONTROL:
            - Current: text-3xl (30px) mobile, text-6xl (60px) tablet, text-8xl (96px) desktop
            - For bigger: try text-4xl sm:text-8xl lg:text-9xl
            - For smaller: try text-2xl sm:text-4xl lg:text-6xl
          */}
          <span className="text-4xl sm:text-7xl lg:text-9xl animate-bounce">💕</span>
          <span className="text-4xl sm:text-7xl lg:text-9xl animate-bounce" style={{animationDelay: '0.1s'}}>🤵</span>
          <span className="text-4xl sm:text-7xl lg:text-9xl animate-bounce" style={{animationDelay: '0.2s'}}>💍</span>
          <span className="text-4xl sm:text-7xl lg:text-9xl animate-bounce" style={{animationDelay: '0.3s'}}>👰</span>
          <span className="text-4xl sm:text-7xl lg:text-9xl animate-bounce" style={{animationDelay: '0.4s'}}>💕</span>
        </div>
      </div>

      {/* 🎨 CUSTOM STYLES - FLIP CLOCK SIZING */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .flip-clock {
          font-family: 'Courier New', monospace;
        }

        /* 📱 MOBILE FLIP CLOCK SIZE */
        .flip-digit-container {
          position: relative;
          background: linear-gradient(180deg, #2d3748 0%, #1a202c 50%, #000000 100%);
          border-radius: 12px;
          box-shadow: 
            0 10px 30px rgba(0,0,0,0.5),
            inset 0 2px 4px rgba(255,255,255,0.1),
            inset 0 -2px 4px rgba(0,0,0,0.3);
          margin-bottom: 8px;
          overflow: hidden;
        }

        .flip-digit-container::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(0,0,0,0.4);
          z-index: 10;
        }

        /* MOBILE: 60x80px digits, 48px font */
        .flip-digit {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 80px;
          font-size: 48px;
          font-weight: bold;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .flip-label {
          font-size: 12px;
          font-weight: 600;
          color: white;
          text-align: center;
          letter-spacing: 2px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .flip-separator {
          font-size: 48px;
          color: white;
          margin: 0 8px;
          margin-bottom: 20px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          animation: blink 1s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }

        /* 📱 TABLET SIZE: 80x100px digits, 60px font */
        @media (min-width: 640px) {
          .flip-digit {
            width: 80px;
            height: 100px;
            font-size: 60px;
          }
          .flip-label {
            font-size: 14px;
          }
          .flip-separator {
            font-size: 60px;
            margin: 0 12px;
            margin-bottom: 24px;
          }
        }

        /* 🖥️ DESKTOP SIZE: 150x200px digits, 100px font (MADE MUCH BIGGER!) */
        @media (min-width: 1024px) {
          .flip-digit {
            width: 150px;  /* Was 120px, now bigger */
            height: 200px; /* Was 150px, now bigger */
            font-size: 100px; /* Was 80px, now bigger */
          }
          .flip-label {
            font-size: 18px; /* Was 16px, now bigger */
          }
          .flip-separator {
            font-size: 100px; /* Was 80px, now bigger */
            margin: 0 20px; /* Was 16px, now bigger */
            margin-bottom: 40px; /* Was 32px, now bigger */
          }
        }

        /* 🖥️ EXTRA LARGE DESKTOP: Even bigger for ultrawide screens */
        @media (min-width: 1536px) {
          .flip-digit {
            width: 180px;
            height: 240px;
            font-size: 120px;
          }
          .flip-label {
            font-size: 20px;
          }
          .flip-separator {
            font-size: 120px;
            margin: 0 24px;
            margin-bottom: 48px;
          }
        }
      `}</style>
    </div>
  );
};

export default App;

