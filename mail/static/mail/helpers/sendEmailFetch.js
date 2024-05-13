export const sendEmailFetch = async (newEmail) => {

    try {
        const response = await fetch('/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...newEmail
            })
        })
    
        const data = await response.json();
    
        return data;

    } catch (error) {
        throw new Error(error);
    }

}