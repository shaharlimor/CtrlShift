import axios from 'utils/axios';

export const ShiftBoardMonthsExist = async (email, firstName, lastName, phone) => {
    try {
        const response = await axios.get('http://localhost:3001/manager/shiftMonthBoardExist');

        // Handle the response (e.g., show a success message)
        console.log(response.data.message);
    } catch (error) {
        // Handle the error (e.g., show an error message)
        console.error('Error get the months: ', error);
    }
};

export const ShiftBoardMonthsDoesntExist = async (email, firstName, lastName, phone) => {
    try {
        const response = await axios.get('http://localhost:3001/manager/shiftMonthBoardDoesntExist');

        // Handle the response (e.g., show a success message)
        console.log(response.data.message);
    } catch (error) {
        // Handle the error (e.g., show an error message)
        console.error('Error get the months: ', error);
    }
};

export default { ShiftBoardMonthsDoesntExist, ShiftBoardMonthsExist };
