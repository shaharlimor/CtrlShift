import axiosServices from './axios';

export const updateUserDetails = async (email, firstName, lastName, phone) => {
    try {
        const response = await axiosServices.post('/auth/updateUserDetails', {
            email,
            firstName,
            lastName,
            phone
        });

        // Handle the response (e.g., show a success message)
        console.log(response.data.message);
    } catch (error) {
        // Handle the error (e.g., show an error message)
        console.error('Error updating user details:', error);
    }
};

export const deleteUser = async (id) => {
    const response = await axiosServices.post(`/user/delete/${id}`);
    return response;
};

export const createUser = async (user) => {
    const response = await axiosServices.post('/user/create', user);
    return response;
};

export default { updateUserDetails, deleteUser };
