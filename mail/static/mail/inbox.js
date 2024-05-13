import { readFetch, showMailboxFetch } from "./helpers/index.js";
import { setForm, sendEmail, createEmail, showEmailDetails } from "./usecases/index.js";

document.addEventListener('DOMContentLoaded', function () {

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

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    sendEmail();
    clearForm();

  });


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
    const emailDiv = createEmail(email);

    emailDiv.addEventListener('click', async() => {
      await readFetch(email.id);
      const emailDetailsDiv = await showEmailDetails(email.id, load_mailbox, compose_email);
      emailsContainer.innerHTML = '';
      emailsContainer.append(emailDetailsDiv);
    });

    emailsContainer.append(emailDiv);
  });

}

const clearForm = () => {
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}