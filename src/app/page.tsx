"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

interface FloatingHeart {
  id: number;
  left: string;
  delay: string;
  duration: string;
  scale: number;
}

export default function Home() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const yesButtonSize = noCount * 25 + 16;

  useEffect(() => {
    // Generate floating hearts on client side only
    const hearts: FloatingHeart[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
      scale: 0.5 + Math.random() * 0.8,
    }));
    setFloatingHearts(hearts);
  }, []);

  const handleNoClick = () => {
    setNoCount(noCount + 1);
  };

  const createConfetti = () => {
    const colors = ['#ff6b9d', '#c44569', '#ff9ff3', '#feca57', '#48dbfb', '#1dd1a1'];
    const newParticles: Particle[] = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 15,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
  };

  const handleYesClick = () => {
    setYesPressed(true);
    createConfetti();
  };

  const getSubtitleText = () => {
    const phrases = [
      "Don't you dare say no!",
      "Are you sure? 😢",
      "Really sure? 🥺",
      "Think again! 💭",
      "Last chance! ⚠️",
      "Surely not? 🤔",
      "You might regret this! 😰",
      "Give it another thought! 💝",
      "Are you absolutely certain? 🤨",
      "This could be a mistake! 😱",
      "Have a heart! ❤️",
      "Don't be so cold! 🥶",
      "Change of heart? 💕",
      "Wouldn't you reconsider? 🙏",
      "Is that your final answer? 🎤",
      "You're breaking my heart 💔",
      "Please? 🥺",
      "I promise it'll be fun! 🎉",
      "Pretty please with a cherry on top? 🍒",
      "My heart can't take this! 💔",
    ];

    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  const getNoButtonPosition = () => {
    if (noCount < 2) return {};
    const offset = (noCount - 1) * 15;
    return {
      transform: `translateX(${Math.sin(noCount * 1.5) * offset}px) translateY(${Math.cos(noCount * 2) * offset * 0.5}px)`,
    };
  };

  return (
    <div className="valentine-container">
      {/* Floating Background Hearts */}
      <div className="floating-hearts-container">
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            className="floating-heart"
            style={{
              left: heart.left,
              animationDelay: heart.delay,
              animationDuration: heart.duration,
              transform: `scale(${heart.scale})`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Confetti Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="confetti-particle"
            initial={{ 
              x: particle.x, 
              y: particle.y,
              rotate: 0,
              opacity: 1,
              scale: 1
            }}
            animate={{ 
              y: window.innerHeight + 50,
              rotate: particle.rotation + 720,
              x: particle.x + (Math.random() - 0.5) * 200,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              ease: "easeOut"
            }}
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <div className="content-wrapper">
        {yesPressed ? (
          <motion.div
            className="success-container"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <motion.div
              className="success-emoji"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              🎉
            </motion.div>
            
            <motion.h1
              className="success-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Yay! You said YES! 💕
            </motion.h1>

            <motion.p
              className="success-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              I couldn't be happier! 
            </motion.p>

            <motion.div
              className="success-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <span className="heart-emoji">❤️</span>
              I&apos; knew you loved me Bianca! :3
              <span className="heart-emoji">❤️</span>
            </motion.div>

            <motion.div
              className="floating-hearts-success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="success-heart"
                  animate={{
                    y: [-20, -60, -20],
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  💕
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            className="question-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="heart-decoration"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
              }}
            >
              💝
            </motion.div>

            <motion.h1
              className="question-title"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Will you be my Valentine?
            </motion.h1>

            <motion.p
              className="question-subtitle"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              key={noCount}
            >
              {getSubtitleText()}
            </motion.p>

            <motion.div
              className="buttons-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.button
                className="yes-button"
                style={{ fontSize: `${yesButtonSize}px` }}
                onClick={handleYesClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255, 107, 157, 0.4)",
                    "0 0 40px rgba(255, 107, 157, 0.6)",
                    "0 0 20px rgba(255, 107, 157, 0.4)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 1.5,
                    repeat: Infinity,
                  },
                }}
              >
                <span className="button-text">Yes</span>
                <span className="button-heart">💕</span>
              </motion.button>

              <motion.button
                onClick={handleNoClick}
                className="no-button"
                style={getNoButtonPosition()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>No</span>
                <span className="sad-emoji">😢</span>
              </motion.button>
            </motion.div>


          </motion.div>
        )}
      </div>
    </div>
  );
}
