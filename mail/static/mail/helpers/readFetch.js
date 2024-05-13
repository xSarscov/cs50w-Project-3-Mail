export const readFetch = async(id) => {
    try {
        await fetch(`/emails/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                read: true
            })
        })
    } catch (error) {
        throw new Error(error);
    }
    
}