"use client";

import React, { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  AnimatePresence,
} from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Container from "../Container";

const navItems = [
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
  {
    name: "Blog",
    href: "/blog",
  },
];

export default function Navbar() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const router = useRouter();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 10) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });
  return (
    <Container>
      <div className="mt-5 flex w-full items-center justify-center">
        <motion.nav
          transition={{ duration: 0.3, ease: "easeInOut" }}
          animate={{
            boxShadow: scrolled ? "var(--shadow-nav)" : "none",
            opacity: scrolled ? 1 : 0.8,
          }}
          className="border-border/20 fixed inset-x-0 z-50 mx-auto mt-6 flex w-full items-center justify-between px-4 py-3 backdrop-blur-3xl sm:mt-8 sm:px-6 sm:py-4 md:mt-12 md:max-w-2xl md:rounded-lg md:border md:px-8 lg:mt-16 lg:max-w-3xl xl:max-w-4xl"
        >
          <div
            className="flex cursor-pointer items-center"
            onClick={() => router.push("/")}
          >
            <span className="from-primary to-primary-foreground/80 dark:from-primary dark:to-secondary-foreground/100 pointer-events-none bg-gradient-to-b bg-clip-text text-2xl leading-none font-bold tracking-wide whitespace-pre-wrap text-transparent sm:text-3xl lg:text-4xl">
              chess
            </span>
          </div>

          <motion.div className="hidden items-center justify-between text-sm md:flex lg:text-base">
            {navItems.map((item, idx) => (
              <Link
                href={item.href}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                key={idx}
                className={cn(
                  "relative px-3 py-2 font-medium tracking-wide text-neutral-300 transition-colors duration-200 lg:px-4",
                  hovered === idx && "text-primary",
                )}
              >
                {hovered === idx && (
                  <motion.span
                    layoutId="nav"
                    className="bg-secondary/50 dark:bg-secondary/30 absolute inset-0 -z-10 h-full w-full rounded-lg"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      duration: 0.3,
                    }}
                  />
                )}
                {item.name}
              </Link>
            ))}
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hover:text-primary relative p-2 text-neutral-300 transition-colors duration-200 md:hidden md:p-3"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </motion.div>
          </motion.button>
        </motion.nav>

        {/* Mobile Menu - Full Screen */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 z-40 md:hidden"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-background/98 absolute inset-0 backdrop-blur-3xl"
              />

              <div className="relative flex h-full flex-col items-center justify-center px-8 py-16">
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 60 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                  className="flex flex-col items-center space-y-12"
                >
                  {navItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.3 + idx * 0.15,
                        ease: "easeOut",
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group block text-center transition-all duration-300"
                      >
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          className="group-hover:text-primary relative block text-2xl font-light tracking-wide text-neutral-300 transition-colors duration-300 sm:text-5xl"
                        >
                          {item.name}
                          <motion.div
                            className="bg-primary absolute -bottom-2 left-0 h-0.5 origin-left"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: "100%" }}
                          />
                        </motion.span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Animated dots pattern */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="absolute top-1/4 right-8 flex flex-col space-y-2"
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                      className="bg-primary/40 h-1 w-1 rounded-full"
                    />
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="absolute bottom-1/4 left-8 flex flex-col space-y-2"
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.0 + i * 0.1, duration: 0.3 }}
                      className="bg-primary/30 h-1 w-1 rounded-full"
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}
