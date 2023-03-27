import axiosServices from './axios';

export async function getPermanentShifts() {
    const data = await axiosServices.get('/permanentShifts');
    return data;
}

export async function getMonthlyShifts() {
    const data = await axiosServices.get('/monthlyShifts');
    return data;
}

export async function addConstraint(body) {
    await axiosServices.post('/constraints', body);
}
// export async function getConstraintsByShiftId(id) {
//     const route = '/byShift/' + id;
//     const data = await axiosServices.get(route);
//     return data;
// }
