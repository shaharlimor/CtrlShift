import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const OrganizationManager = () => {
    const theme = useTheme();

    return (
        <Typography color={theme.palette.secondary.main} gutterBottom variant={'h3'}>
            Organization Manager page
        </Typography>
    );
};

export default OrganizationManager;
