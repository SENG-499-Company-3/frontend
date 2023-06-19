import { Navigation } from "./navigation/Navigation"

export default function Layout({ children, switchTheme }) {
    return (
        <>
            <Navigation switchTheme={switchTheme} />
            <main className="flex w-full h-full justify-center items-center box-border pt-[4rem] pb-[4rem] md:pb-0 md:pl-[4.6rem] overflow-y-hidden">{children}</main>
        </>
    );
}