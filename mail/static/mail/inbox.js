document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archived'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Buttons for mobile views
  document.querySelector('#inbox-mobile').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent-mobile').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived-mobile').addEventListener('click', () => load_mailbox('archived'));
  document.querySelector('#compose-mobile').addEventListener('click', compose_email);

  // Send email
  const emailForm = document.querySelector("#compose-form");
  emailForm.addEventListener('submit', sendEmail);


  // Create Sidebar animation expand event 
  const hamBurger = document.querySelector(".toggle-btn");

  hamBurger.addEventListener("click", function () {
    document.querySelector("#sidebar").classList.toggle("expand");
  });

  // By default, load the inbox
  load_mailbox('inbox');

  // Add inbox buttons active effect 
  document.querySelector('#inbox').classList.add('active');
  
  // Add bootstrap tooltips events
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  clear();

}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  const emailsView = document.querySelector('#emails-view');
  // Get email details view
  const emailsDetailsView = document.querySelector('#email-view');
  const errors = document.querySelector('#errors');

  emailsView.style.display = 'block';
  emailsDetailsView.style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Add sidebar buttons active effect 
  document.querySelectorAll('.sidebar-link').forEach(button => {
    button.classList.remove('active');
  });

  document.getElementById(mailbox).classList.add('active');

  // Show the mailbox name
  emailsView.innerHTML = `
  <h4 class="ms-2 p-3 d-flex gap-3 align-items-center">
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-inbox-fill align-self-end" viewBox="0 0 16 16">
      <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z"/>
  </svg>
  ${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}
  </h4>`;

  // Show user emails
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      if (!emails.length) {
        emailsView.innerHTML += `
        <div class="d-flex justify-content-center align-items-center">
        <h3 class="text-muted">Your mailbox is empty.</h3>
        
        </div>
        `;
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

          // Get email data
          const recipients = email.recipients;
          const isArchive = email.archived;
          const isRead = email.read;

          // Display Hours and Minutes of Email Timestamp
          const timestamp = new Date(email.timestamp);

          const options = { hour: 'numeric', minute: 'numeric', hour12: true };
          const formattedTime = timestamp.toLocaleString('en-US', options);

          // Check if email is archived, then set the button content
          const archiveText = !isArchive ? 'Archive' : 'Unarchive';

          // Create email box
          const emailCard = document.createElement('div');
          emailCard.classList.add('email-border');
          emailCard.setAttribute('role', 'button')


          // If email is read, then change email box background color
          if (isRead) {
            emailCard.classList.add('email-read');
          }

          // Create email box body
          const cardBody = document.createElement('div');
          cardBody.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'email-body');
          cardBody.setAttribute('data-bs-toggle', 'tooltip');
          cardBody.setAttribute('data-bs-title', 'hello');

          // Set email data
          cardBody.innerHTML = `
          <p class="ms-4 mb-0 ${isRead ? '' : `fw-bold`}">${email.sender}</p>
          <p class="mb-0 "> <span class="${isRead ? '' : `fw-bold`}">${email.subject}</span>  <span class="text-muted">- ${email.body.slice(0, 10) + '...'}</span></p>
          <p class="mb-0 ${isRead ? '' : `fw-bold`}" id="date"> <small>${formattedTime}</small></p>
          `;

          // Add the email body to the email box
          emailCard.appendChild(cardBody);

          // Check if the inbox or archived view was loaded and then create archive button
          if (mailbox === 'inbox' || mailbox === 'archive') {

            // Create archive button box
            const cardButton = document.createElement('div');
            cardButton.classList.add('position-absolute', 'top-50', 'start-95', 'translate-middle');

            // Create the button and set its properties
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-primary', 'd-none', 'inbox-archive-btn');
            button.setAttribute('data-bs-toggle', 'tooltip');
            button.setAttribute('data-bs-title', archiveText);

            button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16">
            <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
            </svg>
            `;

            // Add archive button to its box and then add it to the email box
            cardButton.appendChild(button);
            emailCard.appendChild(cardButton);

            // Get email timestamp span element
            const dateSpan = emailCard.querySelector('#date');
            const tooltip = new bootstrap.Tooltip(button);
            
            // Add hover event to the email box to display archive button
            function toggleHover() {
              button.classList.toggle('d-none');
              dateSpan.classList.toggle('invisible');
            }

            emailCard.addEventListener('mouseenter', toggleHover);
            emailCard.addEventListener('mouseleave', toggleHover);

            // Check if email is either archive or not and then mark it
            button.addEventListener('click', () => {
              changeArchivedStatus(email.id, email.archived);
              tooltip.dispose();
            });
          }

          // if user clicks on emails, then show email details
          cardBody.addEventListener('click', () => {
            showEmail(email.id, archiveText, mailbox)
          });

          // Add email to the page
          document.querySelector('#emails-view').appendChild(emailCard);

        });
      }
    });

}


function showEmail(id, archiveText, mailbox) {
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      // Create email detail box and set its data
      const emailDetailsCard = `
    <nav class="navbar mb-3">
            <div class="container-fluid justify-content-start gap-3">
              <div class="rounded-circle" id="back-button-container">
                  <button class="btn me-0 p-2" id="back-button" data-bs-toggle="tooltip" data-bs-title="Go back to ${mailbox != 'sent' ? 'inbox' : 'sent'}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
                      </svg>
                  </button>
              </div>
              <div class="rounded-circle" id="archive-button">
                  <button class="btn me-0 p-2 archive" data-bs-toggle="tooltip" data-bs-title="${archiveText}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" class="bi bi-archive " viewBox="0 0 16 16">
                       <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                      </svg>

                  </button>
                  
              </div>  

            </div>
    </nav>
    <div class="px-4 pb-5">
      <h3 class="ms-5">${email.subject}</h3>
      <div class="d-flex gap-3 align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-circle " viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
          <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
          </svg>
          <p class=" mb-0"><strong> ${email.sender}</strong></p>
          <p class="ms-auto mb-0"><small>${email.timestamp}</small></p>
      </div>
      <div class="ms-5">
      <p class="text-muted"><small>To ${email.recipients.join(', ')}</small></p>
      <p class="">${email.body}</p>
      <button class="btn btn-outline-secondary reply">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-90deg-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708z"/>
          </svg>
          Reply
      </button>
      </div>
    </div>
    `;

      document.querySelector('#email-view').innerHTML = emailDetailsCard;

      // Get back button element
      const backButton = document.querySelector('#email-view').querySelector('#back-button');
      const backButtonTooltip = new bootstrap.Tooltip(backButton);

      backButton.addEventListener('click', () => {
        mailbox === 'sent' ? load_mailbox('sent') : load_mailbox('inbox');
        backButtonTooltip.dispose()
      });


      // Archive emails
      const archiveButton = document.querySelector('.archive');
      const tooltip = new bootstrap.Tooltip(archiveButton);

      archiveButton.addEventListener('click', () => {
        // Check if email is either archive or not and then mark it
        changeArchivedStatus(email.id, email.archived);
        tooltip.dispose();
      });

      // Get reply button element
      const replyButton = document.querySelector('.reply');

      // Load compose email form and set its data
      replyButton.addEventListener('click', () => {
        compose_email();

        document.querySelector('#compose-recipients').value = mailbox === 'sent' ? email.recipients : email.sender;
        document.querySelector('#compose-subject').value = email.subject.includes('Re: ') ? email.subject : 'Re: ' + email.subject;
        document.querySelector('#compose-body').value = `\n\n\n <b> On ${email.timestamp} ${email.sender} wrote:</b> ${email.body}`;
      });

      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#email-view').style.display = 'block';

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

}

function changeArchivedStatus(id, status) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: !status ? true : false
    })
  })
    .then(() => {
      load_mailbox('inbox')
    })
}

function sendEmail(event) {
  event.preventDefault();
  const errorsContainer = document.querySelector('#compose-errors');
  const messagesContainer = document.querySelector('#messages');

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

      if (result.error) {
        const error = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>${result.error}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `;

        errorsContainer.innerHTML = error;
      }
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

};



function clear() {
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

