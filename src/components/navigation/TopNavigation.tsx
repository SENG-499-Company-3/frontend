import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import useApi from '../../hooks/useApi';
import { AppBar, Avatar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import MenuIcon from '@mui/icons-material/Menu';
import Link from "next/link";

interface ITopNavigationProps {
    onToggleThemeMode: () => void
    onToggleSideNav: () => void
}

export const TopNavigation = (props: ITopNavigationProps) => {
    // TODO: Add useContext for user data
    const authContext = useContext(AuthContext);
    const api = useApi();

    const signOut = async () => {
        await api.auth.logout();
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    {authContext.isAuthenticated() && authContext.isAdmin() && (
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={props.onToggleSideNav}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <div>
                        <Typography
                            component={Link}
                            href='/'
                            sx={{ color: 'white' }}
                            style={{ textDecoration: 'none' }}
                        ><strong>UVic Scheduler</strong></Typography>
                    </div>
                </Box>

                <Box gap={2} flex={'test'} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => props.onToggleThemeMode()} size='large' color='inherit'>
                        <Brightness4Icon />
                    </IconButton>

                    {authContext.isAuthenticated() ? (
                        <>
                            <Avatar>{authContext.avatarInitials()}</Avatar>
                            <Typography variant='h6'>{authContext.currentUser().name}</Typography>
                            <Button variant='contained' disabled onClick={() => void signOut()}><strong>Sign Out</strong></Button>
                        </>
                    ) : (
                        <>
                            <Button component={Link} variant='contained' color="secondary" href='/login'><strong>Sign In</strong></Button>
                            <Button className="text-primary-content" component={Link} variant='text' href='/register'><strong>Register</strong></Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}