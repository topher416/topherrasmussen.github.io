import React, { useState, useEffect, useRef } from 'react';
import { Shuffle, Eye, Star, Calendar, Skull, Moon, Zap, Flame, Ghost, Crown, Sparkles, Music, VolumeX } from 'lucide-react';
import * as Tone from 'tone';

const HorrorMovieTarot = () => {
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Load movie data from external JSON file
  useEffect(() => {
    const loadMovieData = async () => {
      try {
        const response = await fetch('/horrortarot/movies.json');
        if (!response.ok) {
          throw new Error(`Failed to load movie data: ${response.status}`);
        }
        const movieData = await response.json();
        setHorrorMovies(movieData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading movie data:', error);
        setLoadError(error.message);
        setIsLoading(false);
      }
    };

    loadMovieData();
  }, []);

  const allCards = horrorMovies;

  // Fisher-Yates shuffle algorithm for proper randomization
  const fisherYatesShuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledDeck, setShuffledDeck] = useState(() => []);
  const [drawnCard, setDrawnCard] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [deckPosition, setDeckPosition] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [particles, setParticles] = useState([]);
  const synthRef = useRef(null);
  const reverbRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize shuffled deck when movies are loaded
  useEffect(() => {
    if (horrorMovies.length > 0) {
      setShuffledDeck(fisherYatesShuffle(horrorMovies));
    }
  }, [horrorMovies]);

  // Initialize audio
  useEffect(() => {
    const initAudio = async () => {
      if (audioEnabled && !synthRef.current) {
        // Create echo effect chain: Synth -> Delay -> Reverb -> Output
        reverbRef.current = new Tone.Reverb(6).toDestination(); // Longer reverb for echo
        const delayRef = new Tone.FeedbackDelay("8n", 0.4).connect(reverbRef.current); // Echo delay
        
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: "sawtooth" },
          envelope: { attack: 0.8, decay: 0.4, sustain: 0.6, release: 3 }, // Slower attack for organ feel
          filter: { frequency: 150, rolloff: -24 }
        }).connect(delayRef);
        
        // Exclusively minor chord progressions - darker and more haunting
        const chords = [
          ["D3", "F3", "A3"],     // D minor
          ["A2", "C3", "E3"],     // A minor  
          ["G2", "Bb2", "D3"],    // G minor
          ["F2", "Ab2", "C3"],    // F minor
          ["Bb2", "Db3", "F3"],   // Bb minor
          ["C3", "Eb3", "G3"],    // C minor
          ["E2", "G2", "B2"],     // E minor
          ["D2", "F2", "A2"]      // D minor (octave down)
        ];
        
        const playChords = () => {
          if (!isPlaying) return;
          chords.forEach((chord, i) => {
            setTimeout(() => {
              if (synthRef.current && isPlaying) {
                synthRef.current.triggerAttackRelease(chord, "2n");
              }
            }, i * 4000); // Slower progression for more haunting effect
          });
          setTimeout(playChords, chords.length * 4000);
        };
        
        if (isPlaying) {
          playChords();
        }
      }
    };

    if (audioEnabled) {
      Tone.start().then(initAudio);
    }
  }, [audioEnabled, isPlaying]);

  // Particle system - mobile optimized
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev.filter(p => p.life > 0)];
        
        // Reduce particles on mobile
        const particleCount = isMobile ? 1 : 3;
        
        // Add new particles
        for (let i = 0; i < particleCount; i++) {
          // Keep particles away from center content area on mobile
          const leftSide = Math.random() < 0.5;
          const x = isMobile 
            ? (leftSide ? Math.random() * window.innerWidth * 0.15 : window.innerWidth * 0.85 + Math.random() * window.innerWidth * 0.15)
            : Math.random() * window.innerWidth;
            
          newParticles.push({
            id: Math.random(),
            x: x,
            y: window.innerHeight + 10,
            vx: (Math.random() - 0.5) * (isMobile ? 1 : 2),
            vy: -Math.random() * 3 - 1,
            life: isMobile ? 50 : 100,
            maxLife: isMobile ? 50 : 100,
            symbol: ['✦', '✧', '⟢', '◊', '✤'][Math.floor(Math.random() * 5)]
          });
        }
        
        // Update existing particles
        return newParticles.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 1
        }));
      });
    }, isMobile ? 200 : 100);

    return () => clearInterval(interval);
  }, []);

  const toggleAudio = async () => {
    try {
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }
      
      if (!audioEnabled) {
        setAudioEnabled(true);
        setIsPlaying(true);
      } else {
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.log('Audio not supported on this device');
    }
  };

  const shuffleDeck = () => {
    if (horrorMovies.length === 0) return;
    
    setIsShuffling(true);
    setDrawnCard(null);
    
    // Animate shuffle - twice as long
    setTimeout(() => {
      const newDeck = fisherYatesShuffle(allCards);
      setShuffledDeck(newDeck);
      setDeckPosition(0);
      setIsShuffling(false);
    }, 3000);
  };

  const drawCard = () => {
    if (deckPosition < shuffledDeck.length) {
      setDrawnCard(shuffledDeck[deckPosition]);
      setDeckPosition(deckPosition + 1);
    }
  };

  const resetDeck = () => {
    setDrawnCard(null);
    setDeckPosition(0);
  };

  const getRarityStyle = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return {
          border: 'border-yellow-400',
          bg: 'from-yellow-900/30 to-orange-900/30',
          glow: 'shadow-yellow-400/50',
          icon: Crown,
          text: 'text-yellow-300'
        };
      case 'epic':
        return {
          border: 'border-purple-400',
          bg: 'from-purple-900/30 to-pink-900/30',
          glow: 'shadow-purple-400/50',
          icon: Star,
          text: 'text-purple-300'
        };
      case 'rare':
        return {
          border: 'border-blue-400',
          bg: 'from-blue-900/30 to-cyan-900/30',
          glow: 'shadow-blue-400/50',
          icon: Sparkles,
          text: 'text-blue-300'
        };
      case 'uncommon':
        return {
          border: 'border-green-400',
          bg: 'from-green-900/30 to-emerald-900/30',
          glow: 'shadow-green-400/50',
          icon: Flame,
          text: 'text-green-300'
        };
      default:
        return {
          border: 'border-gray-400',
          bg: 'from-gray-800/30 to-gray-900/30',
          glow: 'shadow-gray-400/30',
          icon: Ghost,
          text: 'text-gray-300'
        };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-yellow-400';
    if (score >= 90) return 'text-purple-400';
    if (score >= 85) return 'text-blue-400';
    if (score >= 80) return 'text-cyan-400';
    return 'text-teal-400';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 via-red-900 to-black p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 text-purple-300 animate-spin">⦿</div>
          <div className="text-xl text-purple-300 animate-pulse">Loading the mystical cards...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 via-red-900 to-black p-6 flex items-center justify-center">
        <div className="text-center">
          <Skull className="w-16 h-16 mx-auto mb-4 text-red-400 animate-bounce" />
          <div className="text-xl text-red-300">Failed to load the cursed deck...</div>
          <div className="text-sm text-red-500 mt-2">{loadError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 via-red-900 to-black p-6 overflow-hidden relative">
      {/* Animated background stripes */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent transform skew-y-12 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-red-500 to-transparent transform -skew-y-12 animate-pulse delay-1000"></div>
      </div>

      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none text-purple-400 animate-pulse"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.life / particle.maxLife,
            fontSize: '20px',
            zIndex: 1
          }}
        >
          {particle.symbol}
        </div>
      ))}

      {/* Screen distortion overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-green-500 to-transparent animate-pulse" 
             style={{ animationDuration: '0.1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with holographic effect - mobile optimized */}
        <div className="text-center mb-8 md:mb-12 relative px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 blur-3xl opacity-20 animate-pulse"></div>
          <h1 className="text-3xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 tracking-wide animate-pulse relative">
            ⦿ MYSTICAL HORROR TAROT ⦿
          </h1>
          <div className="flex justify-center items-center gap-3 md:gap-4 mb-4">
            <Skull className="w-6 h-6 md:w-8 md:h-8 text-red-400 animate-bounce" />
            <Moon className="w-5 h-5 md:w-6 md:h-6 text-purple-400 animate-spin" style={{animationDuration: '3s'}} />
            <Zap className="w-6 h-6 md:w-7 md:h-7 text-yellow-400 animate-pulse" />
            <Ghost className="w-5 h-5 md:w-6 md:h-6 text-blue-400 animate-bounce delay-500" />
            <Flame className="w-6 h-6 md:w-7 md:h-7 text-orange-400 animate-pulse delay-1000" />
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 mx-4 md:mx-0">
            <p className="text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2 animate-pulse">
              ⟢ Consult the eldritch cards to reveal your next supernatural viewing experience ⟢
            </p>
            <p className="text-purple-400 font-mono text-base md:text-lg">
              ◊ {allCards.length - deckPosition} cards remain in the ethereal deck ◊
            </p>
          </div>
        </div>

        {/* Audio control */}
        <div className="flex justify-center mb-8">
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 border border-purple-500 rounded-lg text-purple-300 hover:text-purple-200 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            {isPlaying ? <VolumeX className="w-5 h-5" /> : <Music className="w-5 h-5" />}
            {isPlaying ? 'Silence the Organ' : 'Summon Dark Organ'}
          </button>
        </div>

        {/* Controls with enhanced effects - mobile optimized */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12 px-4">
          <button
            onClick={shuffleDeck}
            disabled={isShuffling}
            className={`
              flex items-center justify-center gap-2 px-4 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-500 relative overflow-hidden min-h-[50px]
              ${isShuffling 
                ? 'bg-gradient-to-r from-purple-900 to-red-900 text-purple-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-700 to-red-700 hover:from-purple-600 hover:to-red-600 text-white hover:scale-105 shadow-2xl hover:shadow-purple-500/50 border-2 border-purple-400'
              }
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Shuffle className={`w-5 h-5 md:w-6 md:h-6 ${isShuffling ? 'animate-spin' : 'animate-pulse'}`} />
            <span className="whitespace-nowrap">{isShuffling ? '⟢ SHUFFLING ⟢' : '⦿ SHUFFLE DECK ⦿'}</span>
          </button>

          <button
            onClick={drawCard}
            disabled={deckPosition >= shuffledDeck.length || isShuffling}
            className={`
              flex items-center justify-center gap-2 px-4 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-500 relative overflow-hidden min-h-[50px]
              ${deckPosition >= shuffledDeck.length || isShuffling
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-500 cursor-not-allowed border-2 border-gray-600'
                : 'bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white hover:scale-105 shadow-2xl hover:shadow-indigo-500/50 border-2 border-indigo-400'
              }
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
            <Eye className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
            <span className="whitespace-nowrap">◊ DRAW CARD ◊</span>
          </button>

          <button
            onClick={resetDeck}
            className="flex items-center justify-center gap-2 px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-100 rounded-xl font-bold text-sm md:text-lg transition-all duration-500 hover:scale-105 shadow-2xl border-2 border-gray-500 relative overflow-hidden min-h-[50px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
            <Moon className="w-5 h-5 md:w-6 md:h-6 animate-spin" style={{animationDuration: '2s'}} />
            <span className="whitespace-nowrap">⟢ RESET ⟢</span>
          </button>
        </div>

        {/* Enhanced deck visualization */}
        {!drawnCard && (
          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* Mystical aura around deck */}
              <div className="absolute -inset-16 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              
              {/* Card Back Stack */}
              {[...Array(Math.min(7, allCards.length - deckPosition))].map((_, i) => (
                <div
                  key={i}
                  className={`
                    absolute w-40 h-60 bg-gradient-to-br from-purple-900 via-red-900 to-black 
                    rounded-2xl border-4 border-purple-400 shadow-2xl
                    flex flex-col items-center justify-center
                    transition-all duration-700
                    ${isShuffling ? 'animate-spin' : 'hover:scale-105'}
                  `}
                  style={{
                    transform: `translate(${i * 3}px, ${i * -3}px) rotate(${(i - 3) * 3}deg)`,
                    zIndex: 7 - i,
                    boxShadow: `0 0 ${20 + i * 5}px rgba(147, 51, 234, ${0.3 + i * 0.1})`
                  }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3 text-purple-300 animate-pulse">⦿</div>
                    <div className="text-sm font-serif font-bold text-purple-200 mb-1">HORROR</div>
                    <div className="text-sm font-serif font-bold text-purple-200 mb-2">TAROT</div>
                    <div className="flex gap-1 justify-center text-purple-400">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-ping delay-200"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping delay-400"></div>
                    </div>
                    <div className="text-xs font-mono text-purple-400 mt-2">◊ ⟢ ✦ ⟢ ◊</div>
                  </div>
                </div>
              ))}
              
              {allCards.length - deckPosition === 0 && (
                <div className="w-40 h-60 border-4 border-dashed border-purple-500 rounded-2xl flex items-center justify-center text-purple-400 bg-gradient-to-br from-gray-900/50 to-purple-900/20">
                  <div className="text-center">
                    <Skull className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                    <div className="text-sm font-serif">The Void</div>
                    <div className="text-xs">Awaits</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced drawn card - mobile optimized */}
        {drawnCard && (
          <div className="flex justify-center mb-8 px-4">
            <div className={`
              bg-gradient-to-br ${getRarityStyle(drawnCard.rarity).bg} 
              p-6 md:p-10 rounded-3xl border-4 ${getRarityStyle(drawnCard.rarity).border} 
              shadow-2xl ${getRarityStyle(drawnCard.rarity).glow} 
              max-w-3xl w-full animate-fade-in-scale relative overflow-hidden
            `}>
              {/* Holographic overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
              
              {/* Rarity indicator */}
              <div className="absolute top-4 right-4">
                {React.createElement(getRarityStyle(drawnCard.rarity).icon, {
                  className: `w-6 h-6 md:w-8 md:h-8 ${getRarityStyle(drawnCard.rarity).text} animate-pulse`
                })}
              </div>
              
              <div className="text-center mb-6 md:mb-8 relative">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-4 md:mb-6">
                  {typeof drawnCard.score === 'number' ? (
                    <div className={`flex items-center gap-2 ${getScoreColor(drawnCard.score)} text-xl md:text-2xl font-bold`}>
                      <Star className="w-6 h-6 md:w-8 md:h-8 fill-current animate-pulse" />
                      <span>{drawnCard.score}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400 text-xl md:text-2xl font-bold animate-pulse">
                      <Skull className="w-6 h-6 md:w-8 md:h-8" />
                      <span>{drawnCard.score}</span>
                    </div>
                  )}
                  
                  <div className="text-2xl md:text-4xl text-purple-300 animate-spin" style={{animationDuration: '3s'}}>⦿</div>
                  
                  <div className="flex items-center gap-2 text-purple-300 text-lg md:text-xl">
                    <Calendar className="w-5 h-5 md:w-7 md:h-7" />
                    <span className="font-mono">{drawnCard.year}</span>
                  </div>
                </div>
                
                <h2 className={`
                  text-2xl md:text-4xl font-serif mb-4 tracking-wide animate-pulse px-2
                  ${drawnCard.rarity === 'cursed' 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-black' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300'
                  }
                `}>
                  {drawnCard.title}
                </h2>
                
                <div className={`
                  inline-block px-4 md:px-6 py-2 rounded-full text-base md:text-lg font-bold mb-4 md:mb-6 border-2
                  ${drawnCard.rarity === 'cursed' 
                    ? 'bg-red-900 text-red-200 border-red-500 animate-pulse' 
                    : 'bg-purple-800 text-purple-200 border-purple-400'
                  }
                `}>
                  ◊ {drawnCard.type} ◊
                </div>
              </div>
              
              <div className="relative px-4 md:px-8">
                <div className="absolute -left-2 md:-left-4 top-0 text-4xl md:text-6xl text-purple-400/30 font-serif">"</div>
                <div className="absolute -right-2 md:-right-4 bottom-0 text-4xl md:text-6xl text-purple-400/30 font-serif">"</div>
                <p className={`
                  text-base md:text-xl leading-relaxed text-center font-serif italic
                  ${drawnCard.rarity === 'cursed' 
                    ? 'text-red-200 animate-pulse' 
                    : 'text-purple-100'
                  }
                `}>
                  {drawnCard.blurb}
                </p>
              </div>
              
              <div className="text-center mt-6 md:mt-8">
                <div className="flex justify-center items-center gap-2 text-purple-400 text-base md:text-lg">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                  <span className="font-serif">The cards have spoken</span>
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                </div>
                <div className="mt-2 font-mono text-xs md:text-sm text-purple-500">
                  ⟢ ◊ ✦ ◊ ⟢
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in-scale {
          animation: fade-in-scale 0.8s ease-out;
        }
        
        @keyframes holographic {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .holographic {
          animation: holographic 3s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
};

export default HorrorMovieTarot;