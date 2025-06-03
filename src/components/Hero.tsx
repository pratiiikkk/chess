"use client";

import React from "react";
import { motion } from "motion/react";
import BackgroundGradients from "./BackgroundGradients";
import { Button } from "./ui/button";
import Image from "next/image";
import {
  IconChessKing,
  IconChessKingFilled,
  IconChessKnightFilled,
  IconRobot,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <div className="relative mt-20 min-h-screen overflow-hidden">
      <BackgroundGradients />

      <div className="container mx-auto flex flex-col items-center justify-between gap-12 px-4 py-16">
        <motion.div
          className="z-10 text-center lg:text-left"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.h1
            className="mb-2 text-5xl leading-tight font-bold text-neutral-50 lg:text-7xl"
            initial={{ opacity: 0, y: 30,
              filter: "blur(10px)"
             }}
            animate={{ opacity: 1, y: 0,
              filter: "blur(0px)"
             }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Play Chess Online
          </motion.h1>

          <motion.h3
            className="mx-auto mb-8 text-center text-2xl text-neutral-300 lg:mx-0 lg:text-4xl"
            initial={{ opacity: 0, y: 20,
              filter: "blur(10px)"
             }}
            animate={{ opacity: 1, y: 0,
              filter: "blur(0px)"
             }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            On the #1 chess platform!
          </motion.h3>

          <motion.div
            className="flex flex-col justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 30 ,
              filter: "blur(10px)"
            }}
            animate={{ opacity: 1, y: 0,
              filter: "blur(0px)"
             }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={"outline"}
                className="rounded-lg py-6 text-lg shadow-lg transition-all duration-300"
                onClick={() => router.push("/play")}
              >
                <IconChessKingFilled className="size-6" />
                Play Online
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className=""
            >
              <Button
                variant="secondary"
                className="rounded-lg border-2 py-6 text-lg transition-all duration-300 hover:text-white"
              >
                <IconRobot className="size-6" />
                Play Bot
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="z-10 flex flex-1 justify-center lg:justify-end"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <Image
              src="/chess_hero.png"
              alt="Chess Hero Image"
              width={1000}
              height={1000}
              className="relative w-4xl rounded-lg"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
