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
        <div className="mt-4"><LiveBets /></div>
        <div className="mt-3"><TopPreMatch /></div>
        <div className="mt-3"><TopTournaments /></div>
        <div className="mt-3"><TopProviders /></div>
        <div className="mt-3"><CasinoCategories /></div>
        <div className="mt-3"><InTheSpotlight /></div>
        <div className="mt-3"><SelectedForYou /></div>
        <div className="mt-3"><DailyWheel /></div>
        <div className="mt-3"><VirtualBets /></div>
      </main>
      <BottomNav />
    </div>
  )
}

export default App
