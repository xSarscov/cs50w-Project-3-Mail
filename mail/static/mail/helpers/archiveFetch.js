export const archiveFetch = async(id, isArchive) => {
    try {
        await fetch(`/emails/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                archived: !isArchive
            })
        });
        
    } catch (error) {
        throw new Error(error);
    }

}