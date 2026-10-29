/**
 * ILMA — MY HEART, MY LOVE ❤️
 * Premium Romantic Surprise Experience
 * Vanilla JavaScript (ES6+)
 */

(() => {
  'use strict';

  // ==========================================================================
  // 1. DOM Elements & State
  // ==========================================================================
  const ambientCanvas = document.getElementById('ambientCanvas');
  const screenGlow = document.getElementById('screenGlow');
  const particleContainer = document.getElementById('particleContainer');
  const introSection = document.getElementById('introSection');
  const heartBtn = document.getElementById('heartBtn');
  const messageSection = document.getElementById('messageSection');
  const loveCard = document.getElementById('loveCard');
  const saveCardBtn = document.getElementById('saveCardBtn');
  const replayBtn = document.getElementById('replayBtn');

  let isAnimating = false;
  let isRevealed = false;
  let animFrameId = null;

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // 2. Ambient Canvas Animation (Stars, Floating Hearts & Luminous Dust)
  // ==========================================================================
  const ctx = ambientCanvas.getContext('2d');
  let width = (ambientCanvas.width = window.innerWidth);
  let height = (ambientCanvas.height = window.innerHeight);

  const stars = [];
  const ambientHearts = [];
  const TOTAL_STARS = prefersReducedMotion ? 30 : 65;
  const TOTAL_HEARTS = prefersReducedMotion ? 6 : 18;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    ambientCanvas.width = width * dpr;
    ambientCanvas.height = height * dpr;
    ambientCanvas.style.width = width + 'px';
    ambientCanvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  // Initialize Stars
  for (let i = 0; i < TOTAL_STARS; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
    });
  }

  // Initialize Ambient Floating Hearts
  for (let i = 0; i < TOTAL_HEARTS; i++) {
    ambientHearts.push({
      x: Math.random() * width,
      y: height + Math.random() * height,
      size: Math.random() * 14 + 8,
      speedY: Math.random() * 0.45 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.22 + 0.06,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
      wobbleOffset: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? '#FF174F' : '#FF91C8',
    });
  }

  // Draw Heart on Canvas
  function drawHeart(c, x, y, size, color, alpha) {
    c.save();
    c.globalAlpha = alpha;
    c.fillStyle = color;
    c.beginPath();
    const topCurveHeight = size * 0.3;
    c.moveTo(x, y + topCurveHeight);
    // Left curve
    c.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    // Bottom left curve
    c.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.3, x, y + size);
    // Bottom right curve
    c.bezierCurveTo(x, y + (size + topCurveHeight) / 1.3, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    // Right curve
    c.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    c.closePath();
    c.shadowColor = color;
    c.shadowBlur = size * 0.8;
    c.fill();
    c.restore();
  }

  // Main Canvas Render Loop
  let lastTime = performance.now();
  function renderCanvas(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      if (!prefersReducedMotion) {
        s.alpha += s.twinkleSpeed * s.direction;
        if (s.alpha >= 0.95) {
          s.alpha = 0.95;
          s.direction = -1;
        } else if (s.alpha <= 0.15) {
          s.alpha = 0.15;
          s.direction = 1;
        }
      }
      ctx.fillStyle = `rgba(255, 230, 245, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw Floating Hearts
    for (let i = 0; i < ambientHearts.length; i++) {
      const h = ambientHearts[i];
      if (!prefersReducedMotion) {
        h.y -= h.speedY * 60 * dt;
        h.x += Math.sin(now * 0.001 * h.wobbleSpeed * 60 + h.wobbleOffset) * 0.4;

        if (h.y < -30) {
          h.y = height + Math.random() * 40;
          h.x = Math.random() * width;
        }
      }
      drawHeart(ctx, h.x, h.y, h.size, h.color, h.alpha);
    }

    animFrameId = requestAnimationFrame(renderCanvas);
  }

  animFrameId = requestAnimationFrame(renderCanvas);

  // Pause canvas when user switches tab to save mobile battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    } else {
      lastTime = performance.now();
      animFrameId = requestAnimationFrame(renderCanvas);
    }
  });

  // ==========================================================================
  // 3. Heart Burst Particle System
  // ==========================================================================
  const BURST_COLORS = ['#FF174F', '#FF4071', '#FF91C8', '#FFE4EE', '#FFE5A3', '#FFFFFF'];
  const HEART_CHARS = ['❤️', '💖', '💕', '💗', '✨', '🌸'];

  function createHeartBurst(originX, originY, count = 55) {
    const actualCount = prefersReducedMotion ? 12 : count;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < actualCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'burst-particle';

      const isSymbol = Math.random() > 0.45;
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * (Math.min(width, height) * 0.45);
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - (Math.random() * 45); // slight upward bias
      const duration = (0.9 + Math.random() * 0.9).toFixed(2);
      const rot = (Math.random() * 360 - 180).toFixed(0);

      particle.style.left = `${originX}px`;
      particle.style.top = `${originY}px`;
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.setProperty('--rot', `${rot}deg`);
      particle.style.setProperty('--duration', `${duration}s`);

      if (isSymbol) {
        // Emoji Heart / Sparkle
        particle.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
        particle.style.fontSize = `${14 + Math.random() * 18}px`;
        particle.style.filter = 'drop-shadow(0 0 8px rgba(255, 23, 79, 0.8))';
      } else {
        // Glowing stardust orb
        const size = 5 + Math.random() * 8;
        const color = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)];
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 12px ${color}, 0 0 22px rgba(255, 23, 79, 0.6)`;
      }

      particle.addEventListener('animationend', () => {
        particle.remove();
      });

      fragment.appendChild(particle);
    }

    particleContainer.appendChild(fragment);
  }

  // ==========================================================================
  // 4. Heart Click Sequence & Reveal
  // ==========================================================================
  function onHeartClick() {
    if (isAnimating || isRevealed) return;
    isAnimating = true;

    // Center coordinates of the heart button
    const rect = heartBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 1. Immediate visual response & screen glow
    screenGlow.classList.add('active');

    if (prefersReducedMotion) {
      // Instant graceful reveal without violent kinetic motion
      createHeartBurst(centerX, centerY, 15);
      introSection.style.display = 'none';
      messageSection.hidden = false;
      messageSection.classList.add('revealed');
      isRevealed = true;
      isAnimating = false;
      return;
    }

    // 2. Accelerated heartbeat (rapid anticipation thump)
    heartBtn.classList.add('rapid-beat');

    // Initial subtle particle shimmer
    createHeartBurst(centerX, centerY, 20);

    // 3. Heart breaks into two glowing halves with massive burst
    setTimeout(() => {
      heartBtn.classList.remove('rapid-beat');
      heartBtn.classList.add('split-active');

      // Grand burst of glowing hearts & stars
      createHeartBurst(centerX, centerY, 65);

      // Secondary shockwave burst slightly delayed for depth
      setTimeout(() => {
        createHeartBurst(centerX, centerY, 35);
      }, 250);

      // 4. Fade out intro section smoothly
      setTimeout(() => {
        introSection.classList.add('fade-out');

        // 5. Reveal final love message
        setTimeout(() => {
          introSection.style.display = 'none';
          messageSection.hidden = false;

          // Force reflow for silky smooth CSS transition
          void messageSection.offsetWidth;

          messageSection.classList.add('revealed');
          isRevealed = true;
          isAnimating = false;

          // Gentle ambient shower of celebratory hearts around the card
          celebrationShower();
        }, 650);
      }, 950);
    }, 550);
  }

  // Extra celebratory floating particles once message is revealed
  function celebrationShower() {
    let count = 0;
    const interval = setInterval(() => {
      if (!isRevealed || count > 12) {
        clearInterval(interval);
        return;
      }
      count++;
      const randomX = width * (0.2 + Math.random() * 0.6);
      const randomY = height * (0.3 + Math.random() * 0.4);
      createHeartBurst(randomX, randomY, 4);
    }, 900);
  }

  // Keyboard accessibility (Enter or Space on heart)
  heartBtn.addEventListener('click', onHeartClick);
  heartBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onHeartClick();
    }
  });

  // ==========================================================================
  // 5. "Save Love Card" Feature (Client-Side High-Res Canvas Card)
  // ==========================================================================
  function generateLoveCardCanvas() {
    const cardCanvas = document.createElement('canvas');
    const cWidth = 1080;
    const cHeight = 1920;
    cardCanvas.width = cWidth;
    cardCanvas.height = cHeight;
    const ctxC = cardCanvas.getContext('2d');

    // 1. Rich dark romantic background gradient
    const bgGrad = ctxC.createRadialGradient(
      cWidth / 2, cHeight * 0.38, 50,
      cWidth / 2, cHeight * 0.5, cWidth * 0.8
    );
    bgGrad.addColorStop(0, '#40000C');
    bgGrad.addColorStop(0.5, '#220108');
    bgGrad.addColorStop(1, '#09030A');
    ctxC.fillStyle = bgGrad;
    ctxC.fillRect(0, 0, cWidth, cHeight);

    // 2. Ambient sparkling stars & glowing dust
    for (let i = 0; i < 90; i++) {
      const sx = Math.random() * cWidth;
      const sy = Math.random() * cHeight;
      const sr = Math.random() * 3 + 1;
      const sa = Math.random() * 0.8 + 0.2;
      ctxC.fillStyle = `rgba(255, 220, 240, ${sa})`;
      ctxC.beginPath();
      ctxC.arc(sx, sy, sr, 0, Math.PI * 2);
      ctxC.fill();
    }

    // 3. Central Love Card Container
    const cardX = 90;
    const cardY = 160;
    const cardW = cWidth - 180;
    const cardH = cHeight - 320;
    const radius = 48;

    ctxC.save();
    // Glass card shadow & background
    ctxC.shadowColor = 'rgba(255, 23, 79, 0.45)';
    ctxC.shadowBlur = 60;
    ctxC.fillStyle = 'rgba(24, 3, 10, 0.88)';

    ctxC.beginPath();
    ctxC.roundRect(cardX, cardY, cardW, cardH, radius);
    ctxC.fill();

    // Card border
    ctxC.strokeStyle = 'rgba(255, 145, 200, 0.4)';
    ctxC.lineWidth = 3;
    ctxC.stroke();
    ctxC.restore();

    // 4. Decorative Corner Flourishes
    ctxC.fillStyle = '#FF91C8';
    ctxC.font = '40px "Playfair Display", Georgia, serif';
    ctxC.textAlign = 'center';
    ctxC.fillText('❦', cardX + 50, cardY + 65);
    ctxC.fillText('❦', cardX + cardW - 50, cardY + 65);
    ctxC.fillText('❦', cardX + 50, cardY + cardH - 45);
    ctxC.fillText('❦', cardX + cardW - 50, cardY + cardH - 45);

    // 5. Glowing Heart Crest
    ctxC.save();
    ctxC.shadowColor = '#FF174F';
    ctxC.shadowBlur = 35;
    ctxC.font = '85px serif';
    ctxC.textAlign = 'center';
    ctxC.fillText('💖', cWidth / 2, cardY + 160);
    ctxC.restore();

    // 6. EXACT MESSAGE LINES AS REQUIRED
    const centerX = cWidth / 2;

    // Line 1: "Ilma, My Love ❤️"
    ctxC.save();
    ctxC.fillStyle = '#FFFFFF';
    ctxC.shadowColor = 'rgba(255, 23, 79, 0.8)';
    ctxC.shadowBlur = 25;
    ctxC.font = 'bold 88px "Great Vibes", "Brush Script MT", cursive';
    ctxC.textAlign = 'center';
    ctxC.fillText('Ilma, My Love ❤️', centerX, cardY + 310);
    ctxC.restore();

    // Line 2: "I Love You Always."
    ctxC.save();
    ctxC.fillStyle = '#FFE5A3';
    ctxC.shadowColor = 'rgba(255, 229, 163, 0.6)';
    ctxC.shadowBlur = 18;
    ctxC.font = 'italic 500 48px "Playfair Display", Georgia, serif';
    ctxC.textAlign = 'center';
    ctxC.fillText('I Love You Always.', centerX, cardY + 440);
    ctxC.restore();

    // Helper for wrapped text
    function drawCenteredWrappedText(text, y, maxWidth, lineHeight, font, fillStyle) {
      ctxC.save();
      ctxC.fillStyle = fillStyle;
      ctxC.shadowColor = 'rgba(255, 145, 200, 0.4)';
      ctxC.shadowBlur = 12;
      ctxC.font = font;
      ctxC.textAlign = 'center';

      const words = text.split(' ');
      let currentLine = '';
      const lines = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = currentLine + words[n] + ' ';
        const metrics = ctxC.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(currentLine.trim());
          currentLine = words[n] + ' ';
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine.trim());

      let startY = y;
      for (let k = 0; k < lines.length; k++) {
        ctxC.fillText(lines[k], centerX, startY);
        startY += lineHeight;
      }
      ctxC.restore();
      return startY;
    }

    const bodyFont = '400 42px "Playfair Display", Georgia, serif';
    const bodyColor = '#FFE4EE';

    // Line 3: "You Are Always In My Mind, In My Heart, And In My Life."
    let currentY = drawCenteredWrappedText(
      'You Are Always In My Mind, In My Heart, And In My Life.',
      cardY + 590,
      cardW - 140,
      60,
      bodyFont,
      bodyColor
    );

    // Line 4: "No Matter The Distance, No Matter The Time, My Heart Will Always Choose You."
    currentY = drawCenteredWrappedText(
      'No Matter The Distance, No Matter The Time, My Heart Will Always Choose You.',
      currentY + 60,
      cardW - 140,
      60,
      bodyFont,
      bodyColor
    );

    // Line 5: "You Are My Special Person, My Happiness, And My Forever Love."
    currentY = drawCenteredWrappedText(
      'You Are My Special Person, My Happiness, And My Forever Love.',
      currentY + 60,
      cardW - 140,
      60,
      bodyFont,
      bodyColor
    );

    // Line 6: "Forever Yours ❤️"
    ctxC.save();
    ctxC.fillStyle = '#FF91C8';
    ctxC.shadowColor = 'rgba(255, 23, 79, 0.7)';
    ctxC.shadowBlur = 24;
    ctxC.font = '78px "Great Vibes", "Brush Script MT", cursive';
    ctxC.textAlign = 'center';
    ctxC.fillText('Forever Yours ❤️', centerX, cardY + cardH - 140);
    ctxC.restore();

    return cardCanvas;
  }

  // Handle Save Card Button Click
  saveCardBtn.addEventListener('click', async () => {
    try {
      const originalText = saveCardBtn.querySelector('.action-text').textContent;
      saveCardBtn.querySelector('.action-text').textContent = 'Creating Card...';
      saveCardBtn.disabled = true;

      // Small delay to let font load/settle
      await new Promise((resolve) => setTimeout(resolve, 80));

      const canvas = generateLoveCardCanvas();

      // Check if Mobile Web Share API with Files is supported
      if (navigator.share && navigator.canShare) {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            downloadCanvasImage(canvas);
            resetSaveBtn(originalText);
            return;
          }

          const file = new File([blob], 'Ilma-Forever-In-My-Heart.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: 'Ilma — Forever In My Heart ❤️',
                text: 'A love note forever for Ilma ❤️',
                files: [file],
              });
              resetSaveBtn('Card Shared! 💖');
              return;
            } catch (err) {
              if (err.name !== 'AbortError') {
                downloadCanvasImage(canvas);
              }
            }
          } else {
            downloadCanvasImage(canvas);
          }
          resetSaveBtn('Saved with Love! 💖');
        }, 'image/png');
      } else {
        // Direct browser image download
        downloadCanvasImage(canvas);
        resetSaveBtn('Saved with Love! 💖');
      }
    } catch (e) {
      console.error('Error saving love card:', e);
      resetSaveBtn('Save Love Card');
    }
  });

  function downloadCanvasImage(canvas) {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'Ilma-Forever-In-My-Heart.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function resetSaveBtn(text) {
    setTimeout(() => {
      saveCardBtn.querySelector('.action-text').textContent = text;
      saveCardBtn.disabled = false;
      setTimeout(() => {
        saveCardBtn.querySelector('.action-text').textContent = 'Save Love Card';
      }, 2500);
    }, 400);
  }

  // ==========================================================================
  // 6. "Replay Magic" Feature
  // ==========================================================================
  replayBtn.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    // Fade out message section
    messageSection.classList.remove('revealed');

    setTimeout(() => {
      messageSection.hidden = true;

      // Reset heart button state
      heartBtn.classList.remove('split-active', 'rapid-beat');
      screenGlow.classList.remove('active');

      // Reset intro section
      introSection.style.display = 'flex';
      void introSection.offsetWidth; // Reflow
      introSection.classList.remove('fade-out');

      isRevealed = false;
      isAnimating = false;
    }, 700);
  });

})();
