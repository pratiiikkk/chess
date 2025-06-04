"use client";

import { useRouter } from "next/navigation";
import Container from "./Container";
import Link from "next/link";
import { IconBrandGithub, IconBrandTwitter, IconBrandX, IconWorld } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const socialLinks = [
  {
    id: 1,
    href: "https://github.com/pratiiikkk",
    icon: IconBrandGithub,
    tooltip: "My GitHub"
  },
  {
    id: 2,
    href: "https://neexzz.me",
    icon: IconWorld,
    tooltip: "My Website"
  },
  {
    id: 3,
    href: "https://x.com/neexzz_tw",
    icon: IconBrandX,
    tooltip: "Twitter"
  }
];

export default function Footer() {
  const router = useRouter();
  return (
    <>
      <Container>
        <footer className="border-border/20 my-3 rounded-lg border-t bg-neutral-800/30 px-10 lg:max-w-3xl xl:max-w-4xl mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <TooltipProvider key={link.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="hover:text-neutral-400 transition-all duration-200 cursor-pointer">
                          <Link href={link.href}>
                            <IconComponent />
                          </Link>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{link.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>

            <div>
              <p>made with pain &lt;3</p>
            </div>
          </div>
        </footer>
      </Container>
    </>
  );
}