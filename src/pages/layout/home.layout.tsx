import { Outlet } from "react-router-dom"
import FooterComponent from "../../components/footer/footer.components"
import HeaderComponent from "../../components/header/header.components"

function HomeLayout() {
    return (
        <>
            <HeaderComponent />
            <Outlet />
            <FooterComponent />

        </>
    )
}

export default HomeLayout
