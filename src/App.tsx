import Header from './components/Header'
import CategoryTabs from './components/CategoryTabs'
import QuickFilters from './components/QuickFilters'
import LiveBets from './components/LiveBets'
import TopPreMatch from './components/TopPreMatch'
import TopTournaments from './components/TopTournaments'
import TopProviders from './components/TopProviders'
import CasinoCategories from './components/CasinoCategories'
import InTheSpotlight from './components/InTheSpotlight'
import SelectedForYou from './components/SelectedForYou'
import DailyWheel from './components/DailyWheel'
import VirtualBets from './components/VirtualBets'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <div className="max-w-[430px] mx-auto bg-bg min-h-screen relative" style={{ overflowX: 'clip' }}>
      <div className="sticky top-0 z-50">
        <Header />
        <div className="bg-white"><CategoryTabs /></div>
      </div>
      <main className="px-4 pb-24">
        <div className="mt-2"><QuickFilters /></div>
        <div className="mt-6"><LiveBets /></div>
        <div className="mt-6"><TopPreMatch /></div>
        <div className="mt-6"><TopTournaments /></div>
        <div className="mt-6"><TopProviders /></div>
        <div className="mt-6"><CasinoCategories /></div>
        <div className="mt-6"><InTheSpotlight /></div>
        <div className="mt-6"><SelectedForYou /></div>
        <div className="mt-6"><DailyWheel /></div>
        <div className="mt-6"><VirtualBets /></div>
      </main>
      <BottomNav />
    </div>
  )
}

export default App
