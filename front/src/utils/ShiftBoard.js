import axios from 'utils/axios';

export const ShiftBoardMonthsExist = async () => {
    try {
        const response = await axios.get('http://localhost:3001/manager/shiftMonthBoardExist');

        // Handle the response (e.g., show a success message)
        console.log(response.data);
        return response.data;
    } catch (error) {
        // Handle the error (e.g., show an error message)
        console.error('Error get the months: ', error);
        return null;
    }
};

export const ShiftBoardMonthsDoesntExist = async () => {
    try {
        const response = await axios.get('http://localhost:3001/monthlyShifts/DoesntExistMonthAndYearList');

        // Handle the response (e.g., show a success message)
        console.log(response.data);
        return response.data;
    } catch (error) {
        // Handle the error (e.g., show an error message)
        console.error('Error get the months: ', error);
        return null;
    }
};

export const CreateMonthShiftBoard = async (month, year) => {
    try {
        const response = await axios.post('http://localhost:3001/monthlyShifts/createMonthlyShiftBoard', { month, year });

        // Handle the response (e.g., show a success message)
        console.log('message: ', response.data);
        return response.data;
    } catch (error) {
        // Handle the error (e.g., show an error message)
        console.error('Error create the month: ', error);
        return error;
    }
};

export default { ShiftBoardMonthsDoesntExist, ShiftBoardMonthsExist, CreateMonthShiftBoard };
