import { showEmailDetailsFetch } from "../helpers/showEmailDetailsFetch.js";
import { createArchiveButton, createReplyButton } from "./index.js";

export const createEmailDetails = async(id, load_mailbox, compose_email, mailbox) => {
    const email = await showEmailDetailsFetch(id);

    const emailDiv = document.createElement('div');
    emailDiv.innerHTML = `

        <p><strong>From: </strong>${email.sender}</p>
        <p><strong>To:</strong> ${email.recipients}</p>
        <p><strong>Subject:</strong> ${email.subject}</p>
        <p><strong>Timestamp:</strong> ${email.timestamp}</p>
        <hr>

        <p>${email.body}</p>


    `;

    if (mailbox !== 'sent') {
        const archiveButton = createArchiveButton(email.id, email.archived, load_mailbox);
        emailDiv.append(archiveButton);

    } 

    const replyButton = createReplyButton(email, compose_email, mailbox);
    emailDiv.append(replyButton);

    return emailDiv;
    

}