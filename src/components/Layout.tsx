import { Navigation } from "./navigation/Navigation"

export default function Layout({ children }) {
    return (
        <>
            <Navigation />
            <main>{children}</main>
        </>
    );
}