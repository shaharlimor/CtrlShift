import axiosServices from './axios';

export async function getPermanentShifts() {
    const data = await axiosServices.get('/permanentShifts');
    return data;
}

export async function getMonthlyShifts(org) {
    const data = await axiosServices.get(`/monthlyShifts/${org}`);
    return data;
}

export async function addConstraint(body) {
    await axiosServices.post('/constraints', body);
}

export async function getConstraintsByShiftId(id) {
    const data = await axiosServices.get(`/constraints/byShift/${id}`);
    return data;
}

export async function employeeHasConstraintInShift(empId, shiftId) {
    const data = await axiosServices.get(`/constraints/userHasConstraint/${empId}/${shiftId}`);
    return data;
}

export async function getEmployeesByOrg(org) {
    const data = await axiosServices.get(`/user/users?organization=${org}`);
    return data;
}
