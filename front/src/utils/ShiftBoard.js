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
        const response = await axiosServices.post('/monthlyShifts/createMonthlyShiftBoard', { month, year });

        // Handle the response (e.g., show a success message)
        return response.data;
    } catch (error) {
        console.error('Error create the month: ', error);
        return error;
    }
};

export const generateScheduleMonthlyShifts = async (date) => {
    try {
        const response = await axiosServices.post(
            `/monthlyShifts/generateScheduleMonthlyShifts/${(date.getMonth() + 1) % 12}/${date.getYear() + 2000 - 100}`
        );

        // Handle the response (e.g., show a success message)
        return response.data;
    } catch (error) {
        console.error('Error create the month: ', error);
        return error;
    }
};

export default { ShiftBoardMonthsDoesntExist, ShiftBoardMonthsExist, CreateMonthShiftBoard, generateScheduleMonthlyShifts };
