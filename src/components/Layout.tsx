import { Navigation } from "./navigation/Navigation"

export default function Layout({ children, switchTheme }) {
    return (
        <>
            <Navigation switchTheme={switchTheme} />
            <main className="ml-[4.6rem]">{children}</main>
        </>
    );
}