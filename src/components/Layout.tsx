import { Navigation } from "./navigation/Navigation"

export default function Layout({ children }) {
    return (
        <>
            <Navigation />
            <main className="ml-[4.6rem]">{children}</main>
        </>
    );
}