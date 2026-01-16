import Header from "../components/Header"
import Navbar from "../components/Navbar"

export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <Navbar />
      <Header />
    </div>
  )
}
