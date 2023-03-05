import { useTheme } from '@mui/material/styles';
import { Chip } from '@mui/material';

import { IconUserCircle } from '@tabler/icons';

const ProfileSection = () => {
    const theme = useTheme();

    return (
        <>
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                label={<IconUserCircle stroke={2} size="26px" color={theme.palette.primary.main} />}
                variant="outlined"
                color="primary"
            />
        </>
    );
};

export default ProfileSection;
