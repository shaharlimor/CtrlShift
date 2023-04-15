import axiosServices from '../utils/axios';

export const savePermentShift = async (body) => {
    await axiosServices.post('/permanentShifts/create', body);
};

export const deletePermentShift = async (body) => {
    await axiosServices.post('/permanentShifts/delete', body);
};

export const updatePermentShift = async (body) => {
    await axiosServices.post('/permanentShifts/update', body);
};

export async function getPermanentShifts(org) {
    const data = await axiosServices.get(`/permanentShifts/${org}`);
    return data;
}
