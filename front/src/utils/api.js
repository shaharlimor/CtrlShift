import axiosServices from './axios';

export async function getPermanentShifts() {
    const data = await axiosServices.get('/permanentShifts');
    return data;
}
