import axiosServices from './axios';

export const updateUserDetails = async (email, firstName, lastName, phone) => {
    const response = await axiosServices.post('/auth/updateUserDetails', {
        email,
        firstName,
        lastName,
        phone
    });

    return response;
};

export const deleteUser = async (id) => {
    const response = await axiosServices.post(`/user/delete/${id}`);
    return response;
};

export const createUser = async (user) => {
    const response = await axiosServices.post('/user/create', user);
    return response;
};

export const updateUser = async (user) => {
    const response = await axiosServices.post('/user/update', user);
    return response;
};
export default { updateUserDetails, deleteUser, updateUser };
