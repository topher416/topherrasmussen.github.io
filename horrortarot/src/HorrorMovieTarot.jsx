import React, { useEffect, useRef, useState } from 'react';
import ElectricBorder from './ElectricBorder';
import { Shuffle, Eye, Star, Calendar, Skull, Moon, Ghost, Crown, Sparkles, Music, VolumeX } from 'lucide-react';
import * as Tone from 'tone';

const HorrorMovieTarot = () => {
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const loadMovieData = async () => {
      try {
        const response = await fetch('/horrortarot/movies.json');
        if (!response.ok) throw new Error(`Failed to load movie data: ${response.status}`);
        const movieData = await response.json();
        setHorrorMovies(movieData);
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadMovieData();
  }, []);

  const allCards = horrorMovies;

  const fisherYatesShuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledDeck, setShuffledDeck] = useState([]);
  const [drawnCard, setDrawnCard] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | shuffling | ready | revealing | revealed
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [flyAway, setFlyAway] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const containerRef = useRef(null);
  const gridRefs = useRef([]);
  const singleBackRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [deckPosition, setDeckPosition] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const synthRef = useRef(null);
  const reverbRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (horrorMovies.length > 0) setShuffledDeck(fisherYatesShuffle(horrorMovies));
  }, [horrorMovies]);

  useEffect(() => {
    const initAudio = async () => {
      if (audioEnabled && !synthRef.current) {
        reverbRef.current = new Tone.Reverb(6).toDestination();
        const delayRef = new Tone.FeedbackDelay('8n', 0.4).connect(reverbRef.current);
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.8, decay: 0.4, sustain: 0.6, release: 3 },
          filter: { frequency: 150, rolloff: -24 },
        }).connect(delayRef);

        const chords = [
          ['D3', 'F3', 'A3'],
          ['A2', 'C3', 'E3'],
          ['G2', 'Bb2', 'D3'],
          ['F2', 'Ab2', 'C3'],
          ['Bb2', 'Db3', 'F3'],
          ['C3', 'Eb3', 'G3'],
          ['E2', 'G2', 'B2'],
          ['D2', 'F2', 'A2'],
        ];

        const playChords = () => {
          if (!isPlaying) return;
          chords.forEach((chord, i) => {
            setTimeout(() => {
              if (synthRef.current && isPlaying) synthRef.current.triggerAttackRelease(chord, '2n');
            }, i * 4000);
          });
          setTimeout(playChords, chords.length * 4000);
        };

        if (isPlaying) playChords();
      }
    };
    if (audioEnabled) Tone.start().then(initAudio);
  }, [audioEnabled, isPlaying]);

  const toggleAudio = async () => {
    try {
      if (Tone.context.state !== 'running') await Tone.start();
      if (!audioEnabled) {
        setAudioEnabled(true);
        setIsPlaying(true);
      } else {
        setIsPlaying(!isPlaying);
      }
    } catch (_) {}
  };

  const shuffleDeck = () => {
    if (horrorMovies.length === 0) return;
    setDrawnCard(null);
    setSelectedIndex(null);
    setFlyAway(false);
    setFlipping(false);

    // Prepare new deck while animating
    const newDeck = fisherYatesShuffle(allCards);
    setShuffledDeck(newDeck);
    setDeckPosition(0);

    const runGridAnimation = () => {
      setPhase('shuffling');
      setTimeout(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const targetX = rect.x + rect.width / 2;
        const targetY = rect.y + rect.height / 2;

        const duration = 3400;
        const perIndexDelay = 1500 / 9;
        const longestDelay = perIndexDelay * (9 - 1);
        const total = duration + longestDelay;

        (gridRefs.current || []).forEach((el, index) => {
          if (!el) return;
          const { x: cx, y: cy, width: cw, height: ch } = el.getBoundingClientRect();
          const childCenterX = cx + cw / 2;
          const childCenterY = cy + ch / 2;
          const dx = targetX - childCenterX;
          const dy = targetY - childCenterY;

          const keyframes = [
            { transform: 'translate(0px)', offset: 0 },
            { transform: `translate(${dx}px, ${dy}px)`, offset: 0.3 },
            { transform: `translate(${dx}px, ${dy}px)`, offset: 0.7 },
            { transform: 'translate(0px)', offset: 1 },
          ];
          const timing = {
            delay: index * perIndexDelay,
            duration,
            easing: 'cubic-bezier(0.68,-.55,.265,1.55)',
            fill: 'none'
          };
          try { el.animate(keyframes, timing); } catch (_) {}
        });

        // When the sequence completes, enable draw
        setTimeout(() => setPhase('ready'), total + 50);
      }, 50);
    };

    // Zoom out the single back before starting grid animation
    if (singleBackRef.current && phase === 'idle') {
      try {
        const anim = singleBackRef.current.animate(
          [ { transform: 'scale(1)' }, { transform: 'scale(0.4)' } ],
          { duration: 300, easing: 'cubic-bezier(0.2, 0, 0, 1)' }
        );
        anim.onfinish = runGridAnimation;
      } catch (_) {
        runGridAnimation();
      }
    } else {
      runGridAnimation();
    }
  };

  const startRevealWithIndex = (idx) => {
    if (phase !== 'ready') return;
    if (deckPosition >= shuffledDeck.length) return;
    setSelectedIndex(idx);
    setPhase('revealing');
    setFlyAway(true); // others fly away via CSS
    setTimeout(() => setFlipping(true), 150); // flip selected
    // Safety fallback: ensure reveal even if WAAPI onfinish doesn't fire
    const safetyTimer = setTimeout(() => {
      setDrawnCard(shuffledDeck[deckPosition]);
      setDeckPosition(deckPosition + 1);
      setPhase('revealed');
      setFlyAway(false);
      setFlipping(false);
    }, 1300);

    setTimeout(() => {
      const el = gridRefs.current[idx];
      const frame = containerRef.current?.getBoundingClientRect();
      const cell = el?.getBoundingClientRect();
      if (el && frame && cell) {
        const centerX = frame.x + frame.width / 2;
        const centerY = frame.y + frame.height / 2;
        const childCenterX = cell.x + cell.width / 2;
        const childCenterY = cell.y + cell.height / 2;
        const dx = centerX - childCenterX;
        const dy = centerY - childCenterY;
        const scale = Math.min(frame.width / cell.width, frame.height / cell.height) * 0.95;
        try {
          el.animate(
            [
              { transform: 'translate(0px) scale(1)' },
              { transform: `translate(${dx}px, ${dy}px) scale(${scale})` }
            ],
            { duration: 450, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'forwards' }
          ).onfinish = () => {
            clearTimeout(safetyTimer);
            setDrawnCard(shuffledDeck[deckPosition]);
            setDeckPosition(deckPosition + 1);
            setPhase('revealed');
            setFlyAway(false);
            setFlipping(false);
          };
          return;
        } catch (_) {}
      }
      // Fallback if WAAPI fails
      clearTimeout(safetyTimer);
      setDrawnCard(shuffledDeck[deckPosition]);
      setDeckPosition(deckPosition + 1);
      setPhase('revealed');
      setFlyAway(false);
      setFlipping(false);
    }, 900);
  };

  const drawCard = () => {
    if (phase !== 'ready') return;
    const idx = Math.floor(Math.random() * 9);
    startRevealWithIndex(idx);
  };

  const resetDeck = () => {
    setDrawnCard(null);
    setSelectedIndex(null);
    setFlyAway(false);
    setFlipping(false);
    setPhase('idle');
  };

  const getRarityStyle = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return { border: 'border-yellow-400', text: 'text-yellow-300', icon: Crown };
      case 'epic':
        return { border: 'border-purple-400', text: 'text-purple-200', icon: Sparkles };
      case 'rare':
        return { border: 'border-blue-400', text: 'text-blue-300', icon: Star };
      default:
        return { border: 'border-white/20', text: 'text-white/80', icon: Ghost };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-yellow-400';
    if (score >= 90) return 'text-white';
    if (score >= 85) return 'text-blue-400';
    if (score >= 80) return 'text-cyan-400';
    return 'text-teal-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 text-white animate-spin">⦿</div>
          <div className="text-xl text-white">Loading the deck...</div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-center">
          <Skull className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <div className="text-xl text-white">Failed to load the deck</div>
          <div className="text-sm text-white/70 mt-2">{loadError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="main-content-wrapper">
        {/* Top header icons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Moon className="w-5 h-5 text-white/80" />
          <Skull className="w-6 h-6 text-red-400" />
          <Ghost className="w-5 h-5 text-blue-400" />
        </div>

        {/* Status text */}
        <div className="text-center text-sm text-white/70 mb-4">
          {allCards.length - deckPosition} cards remain in the ethereal deck
        </div>

        {/* Isolated sound control */}
        <div className="mb-8">
          <button
            onClick={toggleAudio}
            className="btn-secondary w-full"
          >
            {isPlaying ? <VolumeX className="w-5 h-5" /> : <Music className="w-5 h-5" />}
            {isPlaying ? 'Silence the Organ' : '🎵 Summon Dark Organ'}
          </button>
        </div>

        {/* Core deck controls: 3-button group */}
        <div className="button-row mb-10">
          <button
            onClick={shuffleDeck}
            disabled={phase === 'shuffling' || phase === 'revealing'}
            className="btn-primary" style={{ flex: 1, opacity: (phase === 'shuffling' || phase === 'revealing') ? 0.6 : 1, pointerEvents: (phase === 'shuffling' || phase === 'revealing') ? 'none' : 'auto' }}
          >
            <Shuffle className="w-5 h-5" />
            ⊗ SHUFFLE DECK ⊗
          </button>

          <button
            onClick={drawCard}
            disabled={deckPosition >= shuffledDeck.length || phase !== 'ready'}
            className="btn-primary" style={{ flex: 1, opacity: (deckPosition >= shuffledDeck.length || phase !== 'ready') ? 0.6 : 1, pointerEvents: (deckPosition >= shuffledDeck.length || phase !== 'ready') ? 'none' : 'auto', boxShadow: phase === 'ready' ? '0 0 12px rgba(255,255,255,0.2)' : 'none' }}
          >
            <Eye className="w-5 h-5" />
            👁 DRAW CARD ♢
          </button>

          <button
            onClick={resetDeck}
            disabled={phase !== 'revealed'}
            className="btn-ghost" style={{ flex: 1, opacity: (phase !== 'revealed') ? 0.6 : 1, pointerEvents: (phase !== 'revealed') ? 'none' : 'auto' }}
          >
            <Moon className="w-5 h-5" />
            ☽ RESET ♢
          </button>
        </div>

        {/* Card display area */}
        <div
          className={`tarot-card-frame${phase === 'revealed' ? ' no-frame-border' : ''}`}
          ref={containerRef}
          style={phase === 'revealed' ? { overflow: 'visible' } : undefined}
        >
          {/* Default / Idle state: single back art */}
          {phase === 'idle' && !drawnCard && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)' }}>
              <div ref={singleBackRef} className="card-back" style={{ width: '30%', height: '55%', transformOrigin: 'center center' }} />
            </div>
          )}

          {/* Shuffle/Ready grid */}
          {(phase === 'shuffling' || phase === 'ready' || phase === 'revealing') && !drawnCard && (
            <div className={`card-grid`}>
              {Array.from({ length: 9 }).map((_, i) => {
                const isSelected = phase !== 'shuffling' && selectedIndex === i;
                const fly = phase === 'revealing' && flyAway && !isSelected;
                const flip = phase === 'revealing' && flipping && isSelected;
                return (
                  <div
                    key={i}
                    ref={el => (gridRefs.current[i] = el)}
                    className={`card-back ${isSelected || (phase === 'ready' && hoveredIndex === i) ? 'highlight' : ''} ${fly ? 'fly-away' : ''} ${flip ? 'flip' : ''}`}
                    style={{ cursor: phase === 'ready' ? 'pointer' : 'default' }}
                    onMouseEnter={() => phase === 'ready' && setHoveredIndex(i)}
                    onMouseLeave={() => phase === 'ready' && setHoveredIndex(null)}
                    onClick={() => phase === 'ready' && startRevealWithIndex(i)}
                  />
                );
              })}
            </div>
          )}

          {/* Revealed content fills frame */}
          {phase === 'revealed' && drawnCard && (
            <div style={{ position: 'absolute', inset: 0 }}>
              {/* Electric border sits slightly outside the frame */}
              <div style={{ position: 'absolute', top: -16, left: -16, right: -16, bottom: -16, zIndex: 1, pointerEvents: 'none' }}>
                <ElectricBorder color="#6d28d9" speed={1} chaos={0.7} thickness={5} style={{ borderRadius: 18, width: '100%', height: '100%' }}>
                  <div style={{ width: '100%', height: '100%' }} />
                </ElectricBorder>
              </div>

              {/* Content above border */}
              <div className="absolute inset-0 p-5 flex flex-col" style={{ zIndex: 5 }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {typeof drawnCard.score === 'number' ? (
                      <>
                        <Star className={`w-5 h-5 ${getScoreColor(drawnCard.score)}`} />
                        <span className={`text-sm font-semibold ${getScoreColor(drawnCard.score)}`}>{drawnCard.score}</span>
                      </>
                    ) : (
                      <>
                        <Skull className="w-5 h-5 text-red-400" />
                        <span className="text-sm font-semibold text-red-400">{drawnCard.score}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-mono">{drawnCard.year}</span>
                  </div>
                </div>
                <h2 className="text-center text-xl md:text-2xl font-serif mb-2">{drawnCard.title}</h2>
                <div className="flex justify-center mb-3">
                  <span className="px-3 py-1 rounded-full border border-white/20 text-xs tracking-wide">
                    {drawnCard.type}
                  </span>
                </div>
                <div className="mt-1 text-sm leading-relaxed text-white/90 font-serif italic overflow-auto">
                  {drawnCard.blurb}
                </div>
                <div className="mt-auto flex justify-end">
                  {React.createElement(getRarityStyle(drawnCard.rarity).icon, {
                    className: `w-5 h-5 ${getRarityStyle(drawnCard.rarity).text}`,
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorrorMovieTarot;
