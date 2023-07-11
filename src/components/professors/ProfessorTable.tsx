import React, { useState } from 'react';
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { professorListData } from '../common/sampleData/professorList';
import { Professor } from '../../types/professor';
import { Button, Paper } from '@mui/material';
import { useRouter } from 'next/router';

const initialRows: GridRowsProp = professorListData.map((professor: Professor) => ({
    id: professor.id,
    instructor: professor.Name,
    email: professor.Email,
    profile: professor.id,
    status: professor.IsMissingPreferenceSubmission,
}));
const ProfessorTable = () => {
    const [rows, setRows] = useState(initialRows);
    const columns: GridColDef[] = [
        { field: 'instructor', headerName: 'Instructor', width: 200 },
        { field: 'email', headerName: 'Email', width: 200 },
        {
            field: 'profile', headerName: 'Profile', width: 100,
           renderCell: (params) => <ProfileButton uid={params.toString()} />
        },
        { field: 'status', headerName: 'Status', width: 100 },
    ];

    const router = useRouter();
    const ProfileButton = (uid : any) => {
        const link = '/professors/'+ uid;
        return (
            <Button onClick={() => router.push(link)} variant="contained">Profile</Button>
        );
    };

    return (
        <Paper sx={{ p: 2 }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'status', sort: 'asc' }],
                    },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
            />
        </Paper>
    )
};


export default ProfessorTable;