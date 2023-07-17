import CircularProgress from '@mui/material/CircularProgress'

const LoadingSpinner = () => {
    return (
        <CircularProgress
            size={64}
            sx={{
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        />
    )
}

export default LoadingSpinner
