import { AuthContext } from "../contexts/AuthContext";
import { Navigation } from "./navigation/Navigation"
import { useContext } from "react";

export default function Layout({ children, switchTheme }) {
    const authContext = useContext(AuthContext);

    return (
        <>
            {authContext.isAuthenticated() ?
                <>
                    <Navigation switchTheme={switchTheme} />
                    <main className="flex w-full h-full justify-center items-center box-border pt-[4rem] pb-[4rem] md:pb-0 md:pl-[4.6rem] overflow-y-hidden">{children}</main>
                </>
                :
                <main className="flex w-full h-full justify-center items-center box-border overflow-y-hidden">{children}</main>
            }
        </>
    );
}