import { Outlet } from "react-router-dom"
import FooterComponent from "../../components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

function HomeLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <FooterComponent />
        </div>
    )
}

export default HomeLayout
