import Hero from "../components/home/Hero";
import StatsBar from "../components/home/StatsBar";
import RecentSeason from "../components/home/RecentSeason";
import TopRecruiters from "../components/home/TopRecruiters";
import BlogsPreview from "../components/home/BlogsPreview";
import Footer from "../components/home/Footer";
import EventsSection from "../components/EventsSection";
function Home() {
  return (
    <div>
      <Hero />
      <StatsBar />
      <RecentSeason />
      <TopRecruiters />
      <BlogsPreview />
      <EventsSection previewMode={true} />
      <Footer />
    </div>
  )
}

export default Home;