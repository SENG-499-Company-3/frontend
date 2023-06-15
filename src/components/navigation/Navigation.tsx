
import { TopNavigation } from "./TopNavigation";
import { SideNavigation } from "./SideNavigation";
import { BottomNavigation } from "./BottomNavigation";

export const Navigation = ({switchTheme}) => {

    return (
        <>  
            <TopNavigation switchTheme={switchTheme} />
            <SideNavigation />
            <BottomNavigation />
        </>
    )
}