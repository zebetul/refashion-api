const verifyEmailHtmlMarkup = `
<div style="text-align: center">
  <a href="https://restil.ro" target="_blank">
    <img
      src="https://rfs-logo-images.s3.eu-west-1.amazonaws.com/restil-h_50_px.webp"
      alt="Restil Logo"
      style="height: 50px; margin: 20px 0"
    />
  </a>

  <h1 style="margin: 20px 0">Salut Dorin!</h1>

  <p>Verifică-ți adresa de email pentru a putea folosi aplicația Restil.</p>

  <div style="margin: 50px 0">
    <p style="margin: 0 0 20px 0">
      Click pe butonul de mai jos pentru a confirma adresa de email:
    </p>

    <a
      href="https://restil.ro/email-confirmation/session_id"
      style="
        text-decoration: none;
        color: #fff;
        background-color: #3cb371;
        padding: 10px 20px;
        border-radius: 5px;
      "
      target="_blank"
      >Confirmare email</a
    >
  </div>

  <p style="margin: 20px 0">
    Dacă nu ai făcut tu această cerere, ignoră acest email.
  </p>

  <p style="margin: 20px 0">Echipa Restil</p>

  <p style="margin: 20px 0">
    P.S. Dacă ai întrebări, ne poți contacta la
    <a
      href="mailto: contact@restil.ro"
      style="text-decoration: none; color: #3cb371"
      >contact@restil</a
    >.
  </p>

  <footer style="margin: 20px 0">
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
      "
    >
      <div>
        <img
          src="https://rfs-logo-images.s3.eu-west-1.amazonaws.com/restil-h_50_px.webp"
          alt="Restil Logo"
          style="height: 28px"
        />
      </div>

      <p>© 2023</p>

      <p>Toate drepturile rezervate.</p>
    </div>
  </footer>
</div>`;

export default verifyEmailHtmlMarkup;
