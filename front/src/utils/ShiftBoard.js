import axiosServices from './axios';

export const ShiftBoardMonthsExist = async (organization) => {
    try {
        const response = await axiosServices.get(`/monthlyShifts/shiftMonthBoardExist/${organization}`);

        // Handle the response (e.g., show a success message)
        return response.data;
    } catch (error) {
        // Handle the error (e.g., show an error message)
        console.error('Error get the months: ', error);
        return null;
    }
};

export const ShiftBoardMonthsDoesntExist = async () => {
    try {
        const response = await axiosServices.get(`/monthlyShifts/DoesntExist`);
        console.log(response.data);
        // Handle the response (e.g., show a success message)
        return response.data;
    } catch (error) {
        // Handle the error (e.g., show an error message)
        console.error('Error get the months: ', error);
        return null;
    }
};

export const CreateMonthShiftBoard = async (organization, month, year) => {
    try {
        const response = await axiosServices.post('/monthlyShifts/createMonthlyShiftBoard', { organization, month, year });

        // Handle the response (e.g., show a success message)
        return response.data;
    } catch (error) {
        console.error('Error create the month: ', error);
        return error;
    }
};

export default { ShiftBoardMonthsDoesntExist, ShiftBoardMonthsExist, CreateMonthShiftBoard };
