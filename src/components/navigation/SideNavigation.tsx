import { Box, MenuItem, List, ListItemText, ListItemIcon } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Link from "next/link";
import { useRouter } from "next/router";

export const SideNavigation = ({ onClose }) => {
    const router = useRouter();

    const handleClickLink = (link: string) => {
        router.push(link);
        onClose();
    }

    return (
        <List sx={{ p: 2 }}>
            <MenuItem onClick={() => handleClickLink('/')}>
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText>
                    Dashboard
                </ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleClickLink('/professors')}>
                <ListItemIcon><AccountBoxIcon /></ListItemIcon>
                <ListItemText>
                    Professors
                </ListItemText>
            </MenuItem>
        </List>
    )
}
