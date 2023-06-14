
import { TopNavigation } from "./TopNavigation";
import { SideNavigation } from "./SideNavigation";
import { BottomNavigation } from "./BottomNavigation";
import { useState } from "react";
import { useRouter } from "next/router";

export const Navigation = ({switchTheme}) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(router.pathname);

    return (
        <>  
            <TopNavigation switchTheme={switchTheme} />
            <SideNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
    )
}