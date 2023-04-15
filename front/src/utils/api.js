import axiosServices from './axios';

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
