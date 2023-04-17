// material-ui
import { Grid, InputAdornment, OutlinedInput, Pagination, Typography } from '@mui/material';

// assets
import { IconSearch } from '@tabler/icons';

import React from 'react';

// material-ui
import useAuth from 'hooks/useAuth';

// project imports
import { gridSpacing } from 'store/constant';

// assets
import MainCard from 'components/cards/MainCard';
import UserList from 'components/manager/tabs/employees/UserList';
import { getEmployeesByOrg } from 'utils/api';

/* eslint-disable */
const EmployeeList = () => {
    const [data, setData] = React.useState([]);
    const [filteredUsers, setFilteredUsers] = React.useState([]);
    const [pageNum, setPageNum] = React.useState();
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        function getEmployees() {
            getEmployeesByOrg(user.organization).then(res => {
                const { users } = res.data;
                setData(users);
                setFilteredUsers(users);
                calcPageNum(users.length);
            });
        }
        getEmployees();
        
    }, []);

    const calcPageNum = (len) => {
        let num = Math.floor(len / 10);
        if (len % 10 != 0) {
            num += 1; 
        }
        setPageNum(num);
    }

    const inputHandler = (e) => {
        let lowerCase = e.target.value.toString().toLowerCase();
        const filteredData = data.filter((el) => {
            if (lowerCase === '') {
                return true;
            }
            else {
                return el.firstName?.toString().toLowerCase().includes(lowerCase) || 
                        el.lastName?.toString().toLowerCase().includes(lowerCase) ||
                        el.email?.toString().toLowerCase().includes(lowerCase) ||
                        el.phone?.toString().toLowerCase().includes(lowerCase);
            }
        })
        
        setFilteredUsers(filteredData);
        calcPageNum(filteredData.length);
        setCurrentPage(1);
      };

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="body">Employees</Typography>
                    </Grid>
                    <Grid item>
                        <OutlinedInput
                            id="input-search-list-style1"
                            placeholder="Search"
                            onChange={inputHandler}
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconSearch stroke={1.5} size="16px" />
                                </InputAdornment>
                            }
                            size="small"
                        />
                    </Grid>
                </Grid>
            }
            content={false}
        >
            <UserList users={filteredUsers} currentPage={currentPage} pageSize={10}/>
            <Grid item xs={12} sx={{ p: 3 }}>
                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Pagination count={pageNum} 
                        onChange={(event, page) => setCurrentPage(page)} color="primary" />
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>
    );
};
/* eslint-disable */
export default EmployeeList;
