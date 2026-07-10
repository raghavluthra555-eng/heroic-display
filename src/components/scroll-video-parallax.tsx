import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

import videoAsset from "@/assets/parallax-scene.mp4.asset.json";

/**
 * Cinematic scroll-driven video parallax.
 * Uses a hidden <video> as a frame source and paints frames into a <canvas>
 * whose currentTime is driven by scroll progress (Apple-style).
 */
export function ScrollVideoParallax() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState(0);

  // Scroll progress across the entire pinned section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smoothed progress for buttery scrubbing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  // Foreground parallax layers
  const bgScale = useTransform(smoothProgress, [0, 0.5, 1], [1.15, 1.05, 1.2]);
  const bgY = useTransform(smoothProgress, [0, 1], ["-4%", "4%"]);
  const vignetteOpacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.85, 1],
    [1, 0.35, 0.35, 1],
  );
  const grainOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.25, 0.15, 0.25]);

  // Load & prepare video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setDuration(video.duration || 0);
      setReady(true);
      drawFrame();
    };
    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("loadeddata", handleLoaded);
    // iOS Safari nudge
    video.load();
    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("loadeddata", handleLoaded);
    };
  }, []);

  const drawFrame = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !video.videoWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    // cover-fit
    const vRatio = video.videoWidth / video.videoHeight;
    const cRatio = w / h;
    let dw = w;
    let dh = h;
    if (vRatio > cRatio) {
      dh = h;
      dw = h * vRatio;
    } else {
      dw = w;
      dh = w / vRatio;
    }
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(video, dx, dy, dw, dh);
  };

  // Subscribe to smoothed progress and update video currentTime + redraw
  useEffect(() => {
    if (!ready || !duration) return;
    const unsub = smoothProgress.on("change", (p) => {
      const video = videoRef.current;
      if (!video) return;
      const t = Math.max(0, Math.min(duration - 0.05, p * duration));
      // Some browsers throttle rapid currentTime writes; guard with rAF
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        try {
          video.currentTime = t;
        } catch {
          /* noop */
        }
        drawFrame();
      });
    });
    return () => {
      unsub();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, duration, smoothProgress]);

  // Redraw on seeked (frame actually available) and on resize
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onSeek = () => drawFrame();
    video.addEventListener("seeked", onSeek);
    const onResize = () => drawFrame();
    window.addEventListener("resize", onResize);
    return () => {
      video.removeEventListener("seeked", onSeek);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Cinematic scene"
      className="relative w-full"
      style={{ height: "300vh" }}
    >
      {/* Pinned viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Canvas video layer with parallax */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: bgScale, y: bgY }}
        >
          <canvas ref={canvasRef} className="h-full w-full" />
        </motion.div>

        {/* Hidden source video */}
        <video
          ref={videoRef}
          src={videoAsset.url}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="hidden"
        />

        {/* Cinematic vignette */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: vignetteOpacity,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.9) 100%)",
          }}
        />

        {/* Subtle grain */}
        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            opacity: grainOpacity,
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          }}
        />

        {/* Top & bottom fade for section blending */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent" />
      </div>
    </section>
  );
}