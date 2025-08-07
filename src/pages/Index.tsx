import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Teach from "@/components/Teach";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import PostsList from "@/components/PostsList";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <PostsList />
        <Features />
        <Teach />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
