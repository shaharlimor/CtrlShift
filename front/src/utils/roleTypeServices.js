import axiosServices from './axios';

export const saveRoleType = async (body) => {
    await axiosServices.post('/roleTypes/create', body);
};

export const deleteRoleType = async (body) => {
    await axiosServices.post('/roleTypes/delete', body);
};

export const updateRoleType = async (body) => {
    await axiosServices.post('/roleTypes/update', body);
};

export async function getRoleTypes(org) {
    const data = await axiosServices.get(`/roleTypes/${org}`);
    return data;
}
