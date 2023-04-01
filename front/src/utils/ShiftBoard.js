import axios from 'utils/axios';

export const ShiftBoardMonthsExist = async () => {
    try {
        const response = await axios.get('http://localhost:3001/manager/shiftMonthBoardExist');

        // Handle the response (e.g., show a success message)
        console.log(response.data.message);
    } catch (error) {
        // Handle the error (e.g., show an error message)
        console.error('Error get the months: ', error);
    }
};

export const ShiftBoardMonthsDoesntExist = async () => {
    try {
        const response = await axios.get('http://localhost:3001/monthlyShifts/DoesntExistMonthAndYearList');

        // Handle the response (e.g., show a success message)
        console.log(response.data.message);
    } catch (error) {
        // Handle the error (e.g., show an error message)
        console.error('Error get the months: ', error);
    }
};

export const CreateMonthShiftBoard = async (month, year) => {
    try {
        const response = await axios.post('http://localhost:3001/monthlyShifts/createMonthBoard');

        // Handle the response (e.g., show a success message)
        console.log(response.data.message);
    } catch (error) {
        // Handle the error (e.g., show an error message)
        console.error('Error get the months: ', error);
    }
};

export default { ShiftBoardMonthsDoesntExist, ShiftBoardMonthsExist, CreateMonthShiftBoard };
