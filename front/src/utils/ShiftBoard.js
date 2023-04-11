/* eslint-diasble */
import axiosServices from './axios';

export const ShiftBoardMonthsExist = async (organization) => {
    try {
        const response = await axiosServices.get(`/monthlyShifts/monthOpendToAddShiftsList?organization=${organization}`);

        console.log(response.data);
        // Handle the response (e.g., show a success message)
        return response.data;
    } catch (error) {
        // Handle the error (e.g., show an error message)
        console.error('Error get the months: ', error);
        return null;
    }
};

export const ShiftBoardMonthsDoesntExist = async (organization) => {
    try {
        console.log('here 3');
        console.log(organization);
        const response = await axiosServices.get(`/monthlyShifts/DoesntExistMonthAndYearList?organization=${organization}`);

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
        // Handle the error (e.g., show an error message)
        console.error('Error create the month: ', error);
        return error;
    }
};

export default { ShiftBoardMonthsDoesntExist, ShiftBoardMonthsExist, CreateMonthShiftBoard };