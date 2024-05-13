export const createEmail = ({ subject, sender, timestamp, read }) => {
    const emailDiv = document.createElement('div');

    emailDiv.classList.add('card', `${ (!read) ? 'text-bg-secondary' : 'text-bg-light' }`);

    emailDiv.innerHTML = `
    
        <div class="card-body">
            <h5 class="card-title">${sender}</h5>
            <p class="card-text">${subject}</p>
            <p class="card-text">${timestamp}</p>
        </div>

    `;

    return emailDiv;
}