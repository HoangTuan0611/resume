"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const adjustPercentage = (value: number) => {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
};

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;

      setScrollProgress(adjustPercentage(scrolled));

      // Show the indicator when scrolling
      setIsVisible(true);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Hide after 500ms of no scrolling
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 500);
    };

    window.addEventListener("scroll", updateScrollProgress);
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Determine gradient based on scroll percentage - matching resume blue theme
  const getGradient = () => {
    if (scrollProgress < 30) {
      // Light blue gradient
      return "linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)";
    } else if (scrollProgress < 60) {
      // Medium blue gradient
      return "linear-gradient(90deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)";
    } else {
      // Deep blue gradient
      return "linear-gradient(90deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)";
    }
  };

  const getTextColor = () => {
    if (scrollProgress < 30) return "#60a5fa";
    if (scrollProgress < 60) return "#3b82f6";
    return "#2563eb";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 pointer-events-none"
          id="scroll-progress-indicator"
          style={{ display: "block" }}
        >
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(12px)",
              borderRadius: "9999px",
              padding: "8px 16px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Start Label */}
            <span
              style={{
                fontSize: "10px",
                color: "#94a3b8",
                fontWeight: "500",
              }}
            >
              Start
            </span>

            {/* Progress Bar Container */}
            <div
              style={{
                position: "relative",
                width: "128px",
                height: "6px",
                backgroundColor: "rgba(148, 163, 184, 0.2)",
                borderRadius: "9999px",
                overflow: "hidden",
              }}
            >
              {/* Animated Progress Bar */}
              <motion.div
                style={{
                  height: "100%",
                  borderRadius: "9999px",
                  width: `${scrollProgress}%`,
                  background: getGradient(),
                  boxShadow:
                    scrollProgress < 30
                      ? "0 0 8px rgba(96, 165, 250, 0.6)"
                      : scrollProgress < 60
                      ? "0 0 8px rgba(59, 130, 246, 0.6)"
                      : "0 0 8px rgba(37, 99, 235, 0.6)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${scrollProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            {/* End Label */}
            <span
              style={{
                fontSize: "10px",
                color: "#94a3b8",
                fontWeight: "500",
              }}
            >
              End
            </span>

            {/* Percentage Badge */}
            <div style={{ marginLeft: "4px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: getTextColor(),
                }}
              >
                {Math.round(scrollProgress)}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
