import { createArchiveButton } from "./createArchiveButton.js";

export const createEmail = ({ id, subject, sender, timestamp, read, archived }, load_mailbox, mailbox) => {
    const emailDiv = document.createElement('div');

    emailDiv.classList.add('p-3', 'rounded-3', 'border', 'mb-2', `${ (!read) ? 'text-bg-secondary' : 'text-bg-light' }`);

    emailDiv.innerHTML = `
    
        <div class="card-body mb-2">
            <h5 class="card-title">${sender}</h5>
            <p class="card-text">${subject}</p>
            <p class="card-text">${timestamp}</p>
        </div>

    `;

    if (mailbox !== 'sent') {
        const archiveButton = createArchiveButton(id, archived, load_mailbox);
        emailDiv.append(archiveButton);
    }


    return emailDiv;
}