/* eslint-diasble */
import axios from 'utils/axios';

export const ShiftBoardMonthsExist = async (organization) => {
    try {
        const response = await axios.get(`http://localhost:3001/manager/shiftMonthBoardExist?organization=${organization}`);

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
        const response = await axios.get(`http://localhost:3001/monthlyShifts/DoesntExistMonthAndYearList?organization=${organization}`);

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
        const response = await axios.post('http://localhost:3001/monthlyShifts/createMonthlyShiftBoard', { organization, month, year });

        // Handle the response (e.g., show a success message)
        return response.data;
    } catch (error) {
        // Handle the error (e.g., show an error message)
        console.error('Error create the month: ', error);
        return error;
    }
};

export default { ShiftBoardMonthsDoesntExist, ShiftBoardMonthsExist, CreateMonthShiftBoard };
