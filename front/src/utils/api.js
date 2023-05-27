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

export async function getShiftsByRoleType(roleType, startTime) {
    const data = await axiosServices.get(`/monthlyShifts/ShiftsByRoleType/${roleType}/${startTime}`);
    return data;
}

export async function getMonthlyShiftsPublished(org) {
    const data = await axiosServices.get(`/monthlyShifts/published/${org}`);
    return data;
}

export async function getUsersWithConstraintsInShift(id) {
    const data = await axiosServices.get(`/constraints/EmployeesWithConstraintInShift/${id}`);
    return data;
}

export async function getSpecificEmployeesDetails(body) {
    const data = await axiosServices.get(`/user/getEmployeesDetails/${body}`);
    return data;
}

export async function changeEmployeesInShift(id, body) {
    await axiosServices.patch(`/monthlyShifts/assingEmployees/${id}`, body);
}

export const employessGeneratedToMonths = async (date, org) => {
    const response = await axiosServices.get(`/schedule/employessAssigned/`, {
        params: {
            organization: org,
            month: (date.getMonth() + 1) % 12,
            year: date.getYear() + 2000 - 100
        }
    });
    return response;
};

export async function createSwapRequest(body) {
    const data = await axiosServices.get(`/swapRequests/create/`, body);
    return data;
}
