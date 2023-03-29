import axios from 'axios';

const updateUserDetails = async (userID, email, firstName, lastName, phone) => {
    try {
        const response = await axios.post('http://localhost:3001/auth/updateUserDetails', {
            id: userID,
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

export default updateUserDetails;
