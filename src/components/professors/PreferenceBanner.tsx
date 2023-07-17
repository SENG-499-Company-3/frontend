import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

const PreferenceBanner = (userBanner: boolean) => {
    const [showBanner, setShowBanner] = useState<boolean>(userBanner);
    return (
        {
            if(showbanner) {
                <Box sx={{
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33587A' : '#69B4FA'),
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div className="flex content-center ml-2 gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <Typography variant="body1" gutterBottom>You haven't filled out your annual survey yet.</Typography>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outlined" color="inherit">FILL SURVEY</Button>
                        <button className={`btn btn-ghost p-1`} onClick={() => { setShowBanner(false); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        </button>
                    </div>
                </Box>
            }
        }
    )
}

export default PreferenceBanner;