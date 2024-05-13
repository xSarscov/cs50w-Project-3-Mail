import { createArchiveButton, createReplyButton } from "./index.js";

export const createEmailDetails = (email, load_mailbox, compose_email) => {
    const emailDiv = document.createElement('div');
    emailDiv.innerHTML = `

        <p><strong>From: </strong>${email.sender}</p>
        <p><strong>To:</strong> ${email.recipients}</p>
        <p><strong>Subject:</strong> ${email.subject}</p>
        <p><strong>Timestamp:</strong> ${email.timestamp}</p>
        <hr>

        <p>${email.body}</p>


    `;

    const archiveButton = createArchiveButton(email.id, email.archived, load_mailbox);
    const replyButton = createReplyButton(email, compose_email);
    emailDiv.append(archiveButton, replyButton);

    return emailDiv;
    

}