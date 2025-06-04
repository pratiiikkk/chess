import Footer from "@/components/Footer";
import PlayPage from "@/components/pages/PlayPage";
import React from "react";

export const metadata = {
  title: "Play Chess Online",
  description:
    "Play chess online with friends for free. Join or create a game easily.",
};

export default function page() {
  return (
    <>
      <PlayPage />
              <Footer/>

      
    </>
  );
}
