export const showMailboxFetch = async(mailbox) => {

    try {
        const response = await fetch(`/emails/${mailbox}`);
        const data = await response.json();
        
        return data;
        
    } catch (error) {
        throw new Error(error);
    }

}