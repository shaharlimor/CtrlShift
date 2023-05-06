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

export async function getConstraintsByUserId(id) {
    const data = await axiosServices.get(`/constraints/byEmployee/${id}`);
    return data;
}

export async function getEmployeesByOrg(org) {
    const data = await axiosServices.get(`/user/users?organization=${org}`);
    return data;
}

export async function addMonthlyShift(body) {
    await axiosServices.post('/monthlyShifts', body);
}

export async function getMonthOpendToAddShifts(org) {
    const data = await axiosServices.get(`/monthlyShifts/monthOpendToAddShiftsList/${org}`);
    return data;
}

export async function deleteMonthlyShift(id) {
    await axiosServices.delete(`/monthlyShifts/${id}`);
}

export async function publishSchdule(body) {
    await axiosServices.patch(`/schedule/publishBoard/`, body);
}

export async function startInsertConstraints(body) {
    await axiosServices.patch(`/schedule/startInsertConstraints/`, body);
}

export async function getMonthlyShiftsOpenToConstraints(org) {
    const data = await axiosServices.get(`/monthlyShifts/openToConstraints/${org}`);
    return data;
}

export async function getMonthlyShiftsOpenToConstraintsByRoles(org, roleTypes) {
    const data = await axiosServices.get(`/monthlyShifts/openToConstraintsByRoles/${org}/${roleTypes}`);
    return data;
}

export async function getMonthlyShiftsPublished(org) {
    const data = await axiosServices.get(`/monthlyShifts/published/${org}`);
    return data;
}
