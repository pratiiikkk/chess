import Hero from "@/components/Hero";
import Container from "../components/Container";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Container className="md:p-10">
        <Hero />
      </Container>
    </>
  );
}
