import React, { useState, useEffect } from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';


const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const createHeart = () => {
      const heart = {
        id: Math.random(),
        left: Math.random() * 100,
        animationDuration: Math.random() * 3 + 4,
        size: Math.random() * 20 + 15,
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
      
      {/* Sparkle effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-200 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${Math.random() * 10 + 10}px`,
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
    const handleMouseMove = (e) => {
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        </div>

        {/* Countdown */}
        <div className="transform hover:scale-105 transition-transform duration-300">
      <h1>JAC's Marriage</h1>
        <FlipClockCountdown to={new Date().getTime() + 44 * 3600 * 1000 + 5000}>Finished</FlipClockCountdown>
      </div>

        {/* Decorative elements */}
        <div className="mt-8 sm:mt-12 flex gap-4 text-2xl sm:text-4xl animate-bounce">
          <span>💕</span>
          <span>🤵</span>
          <span>💍</span>
          <span>👰</span>
          <span>💕</span>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
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

        @media (min-width: 1024px) {
          .flip-digit {
            width: 120px;
            height: 150px;
            font-size: 80px;
          }
          .flip-label {
            font-size: 16px;
          }
          .flip-separator {
            font-size: 80px;
            margin: 0 16px;
            margin-bottom: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default App;

