import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import ProfessorTable from '../../components/professors/ProfessorTable'
import AppPage from '../../components/layout/AppPage'
import PageHeader from '../../components/layout/PageHeader'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import PageHeaderActions from '../../components/layout/PageHeaderActions'
import PageContent from '../../components/layout/PageContent'
import useApi from '../../hooks/useApi';
import { IUser } from '../../hooks/api/useUserApi';
import LoadingSpinner from '../../components/layout/LoadingSpinner';

const HomePage = () => {
    const [professors, setProfessors] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const api = useApi();

    useEffect(() => {
        setLoading(true);
        api.user.listUsers()
            .then((users: IUser[]) => {
                setProfessors(users.filter((user) => user.role === 'TEACHER'));
            })
            .catch(() => {
                console.error("Failed to fetch professors.")
            })
            .finally(() => {
                setLoading(false);
            })
    }, [])

    return (
        <AppPage>
            <PageHeader>
                <Box display='flex'>
                    <Box flex='1'>
                        <Typography mb={1} variant='h4'>Professors</Typography>
                    </Box>
                    <PageHeaderActions>
                        <Button startIcon={<AddIcon />} variant='contained'>Add User</Button>
                    </PageHeaderActions>
                </Box>
            </PageHeader>
            <PageContent>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <ProfessorTable professors={professors} />
                )}
            </PageContent>
        </AppPage>
    )
}

export default HomePage
