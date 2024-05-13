export const setForm = (initialFormState) => {

    const { initialRecipients, initialSubject, initialBody } = initialFormState;

    document.querySelector('#compose-recipients').value = initialRecipients;
    document.querySelector('#compose-subject').value = initialSubject;
    document.querySelector('#compose-body').value = initialBody;

}