import { setForm } from "./index.js";

export const createReplyButton = ({ sender, recipients, subject, body, timestamp }, compose_email, mailbox) => {
    const replyButton = document.createElement('button');
    replyButton.classList.add('btn', 'btn-secondary', 'ms-2');
    replyButton.innerText = 'Reply';

    replyButton.addEventListener('click', () => {
        compose_email();
        setForm({
            initialRecipients: mailbox !== 'sent' ? sender : recipients, 
            initialSubject: subject.includes('Re: ') ? subject : `Re: ${subject}`,
            initialBody: `\nOn ${timestamp}, ${sender} wrote: "${body}"`
        });

    });

    return replyButton;
}