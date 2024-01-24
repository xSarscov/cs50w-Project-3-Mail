document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  
  // Clear out composition fields
  clear();

  const emailForm = document.querySelector("#compose-form");
  const errorsContainer = document.querySelector('#compose-errors');
  const messagesContainer = document.querySelector('#messages');

  // Send email
  emailForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const recipients = document.querySelector('#compose-recipients').value;
    const subjectInput = document.querySelector('#compose-subject');
    const subject = subjectInput.value.length ? subjectInput.value : '(No subject)';
    const body = document.querySelector('#compose-body').value;
   
    fetch('/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {

      if (result.message) {
        clear();
        load_mailbox('sent');
        const message = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>${result.message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `;
        messagesContainer.innerHTML = message;
      }

      const error = `
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>${result.error}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
      
      errorsContainer.innerHTML = error;
    })
    .catch(error => {
      const errorMessage = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Bad request.</strong>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      `;
      
      errorsContainer.innerHTML = errorMessage;
    });

  });
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  const emailsDetailsView = document.querySelector('#email-view');
  const emailsView = document.querySelector('#emails-view');
  const errors = document.querySelector('#errors');

  emailsView.style.display = 'block';
  emailsDetailsView.style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  emailsView.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Show user emails
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      if (!emails.length) {
        emailsView.innerHTML = `<h2>No emails found :c</h2>`
      }
      else {
        emails.forEach(email => {
          
          if (email.error) {
            const errorMessage = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>${email.error}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `;
    
            errors.innerHTML = errorMessage;
          }
  
          const recipients = email.recipients;
          const isArchive = email.archived;
          const isRead = email.read;
          
          const recipientInfo = recipients.length === 1 ? recipients[0] : recipients[0] + ' ...';
          const archiveText = !isArchive ? 'Archive' : 'Unarchive';
          
          const emailCard = document.createElement('div');
          emailCard.classList.add('card', 'border', 'border-black');
  
          // If email is read, then change card background color
          if (isRead) {
            emailCard.classList.add('text-bg-light');
          }
  
          const cardBody = document.createElement('div');
          cardBody.classList.add('card-body');
          
          cardBody.innerHTML = `
          <h5 class="card-title mb-0">${email.subject}</h5>
          <h6 class="card-subtitle my-0 text-body-secondary"><strong>${email.sender}</strong></h6> 
          <p class="card-text">${email.timestamp}</p>
          `;
          
          emailCard.appendChild(cardBody);
          
          if (mailbox === 'inbox' || mailbox === 'archive') {
            const cardButton = document.createElement('div');
            cardButton.classList.add('position-absolute', 'bottom-0', 'end-0', 'p-3');
  
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-primary');
            button.textContent = archiveText;
            
            cardButton.appendChild(button);
            emailCard.appendChild(cardButton);
  
            button.addEventListener('click', () => {
              // Check if email is either archive or not and then mark it
              fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    archived: !email.archived ? true : false
                })
              })
              .then(() => {
                load_mailbox('inbox')
              })
            });
          }
  
          // if user clicks on emails, then show email details
          cardBody.addEventListener('click', () => {
            fetch(`/emails/${email.id}`)
            .then(response => response.json())
            .then(email => {
  
              const emailDetailsCard = `
              <div class="card">
                <h5 class="card-header">${email.subject}</h5>
                <div class="card-body">
                <p class="card-text mb-0"><strong> From: ${email.sender}</strong></p>
                <p class="card-text"><strong>To: ${email.recipients}</strong></p>
                <p class="card-text">${email.body}</p>
                <p class="card-text mb-2"><small>${email.timestamp}</small></p>
                <button class="btn btn-primary reply">Reply</button>
                <button type="button" class="btn btn-primary archive">${archiveText}</button>  
                </div>
              </div>
              `
  
              emailsDetailsView.innerHTML = emailDetailsCard;
  
              // Archive emails
              const archiveButton = document.querySelector('.archive');
          
              archiveButton.addEventListener('click', () => {
                // Check if email is either archive or not and then mark it
                fetch(`/emails/${email.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                      archived: !email.archived ? true : false
                  })
                })
                .then(() => {
                  load_mailbox('inbox')
                })
              });
  
              // Reply emails
              const replyButton = document.querySelector('.reply');
  
              replyButton.addEventListener('click', () => {
                compose_email();
  
                document.querySelector('#compose-recipients').value = mailbox === 'sent' ? email.recipients : email.sender;
                document.querySelector('#compose-subject').value = email.subject.includes('Re: ') ? email.subject : 'Re: ' + email.subject;
                document.querySelector('#compose-body').value = '\n\nOn ' + email.timestamp + ' ' +  email.sender + ' wrote: ' + '\n' + email.body;
              });
  
              emailsView.style.display = 'none';
              emailsDetailsView.style.display = 'block';
    
              // Check if email is read
              if (!email.read) {
                // Mark email as read
                return fetch(`/emails/${email.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                      read: true
                  })
                })
              }
  
              
              
            })
            .catch(error => {
              console.error('Error:', error);
              const errorMessage = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>Error: ${error.message}</strong>
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              `;
              errors.innerHTML = errorMessage;
            });
          });
    
          emailsView.appendChild(emailCard);
  
          
  
        });
      }
    });
    
}

function clear() {
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}