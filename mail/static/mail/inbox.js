import { clearForm, readFetch, showMailboxFetch } from "./helpers/index.js";
import { setForm, sendEmail, createEmail, createEmailDetails } from "./usecases/index.js";

document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

async function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  clearForm();

  const initialFormState = {
    initialRecipients: '',
    initialSubject: '',
    initialBody: '',
  }

  setForm(initialFormState);

  const form = document.querySelector('#compose-form');

  form.removeEventListener('submit', sendEmail);

  form.addEventListener('submit', sendEmail);
}

async function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  const emailsContainer = document.querySelector('#emails-view');


  const emails = await showMailboxFetch(mailbox);

  emails.forEach(email => {
    const emailDiv = createEmail(email, load_mailbox, mailbox);

    const emailBody = emailDiv.querySelector('.card-body');

    emailBody.addEventListener('click', async() => {
      await readFetch(email.id);
      const emailDetailsDiv = await createEmailDetails(email.id, load_mailbox, compose_email, mailbox);
      emailsContainer.innerHTML = '';
      emailsContainer.append(emailDetailsDiv);
    });

    emailsContainer.append(emailDiv);
  });

}

