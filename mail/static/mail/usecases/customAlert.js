export const customAlert = ({ message, messageType }) => {
    const messageDiv = `
        <div class="alert alert-${ messageType } alert-dismissible fade show" role="alert">
          ${ message }
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    const alertDiv = document.querySelector('#alerts');
    alertDiv.innerHTML = messageDiv;
}