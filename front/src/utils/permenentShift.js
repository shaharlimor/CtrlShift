import axiosServices from './axios';

export const savePermanentShift = async (body) => {
    await axiosServices.post('/permanentShifts/create', body);
};

export const deletePermanentShift = async (body) => {
    await axiosServices.post('/permanentShifts/delete', body);
};

export const updatePermanentShift = async (body) => {
    await axiosServices.post('/permanentShifts/update', body);
};

export async function getPermanentShifts(org) {
    const data = await axiosServices.get(`/permanentShifts/${org}`);
    return data;
}
