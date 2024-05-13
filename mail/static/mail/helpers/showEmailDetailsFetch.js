export const showEmailDetailsFetch = async(id) => {
    
    try {
        const response = await fetch(`/emails/${id}`);
        const data = await response.json();
    
        return data;
        
    } catch (error) {
        throw new Error(error);
    }

}