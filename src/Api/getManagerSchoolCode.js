import axios from 'axios';

export const getManagerSchoolCode = async (userId, token) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/Learning-App/School-Manager/get-school-code?userId=${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.data.success) {
            return response.data.errorCode;
        } else {
            throw new Error(response.data.errorCode || "Unknown error");
        }
    } catch (error) {
        console.error("Failed to get school code", error);
        throw error;
    }
};
