import { useContext, useEffect } from "react";
import { Navigation } from "./navigation/Navigation"
import { AuthContext } from "../contexts/AuthContext";
import { useRouter } from "next/router";

export default function Layout({ children, switchTheme }) {
    const authContext = useContext(AuthContext);
    const router = useRouter();

	useEffect(() => {
		if (!authContext.isAuthenticated() && router.route !== '/register') {
			router.push('/login')
		}
	}, [AuthContext]);

    return (
        <>
                { authContext.isAuthenticated() ?
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