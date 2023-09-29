const verifyEmailHtmlMarkup = function (session_id) {
  return `
  <div style="display: inline-block; vertical-align: middle">
  <a href="https://restil.ro" target="_blank">
    <img
      src="https://rfs-logo-images.s3.eu-west-1.amazonaws.com/restil-h_50_px.webp"
      alt="Restil Logo"
      style="height: 50px; margin: 20px 0"
    />
  </a>

  <h1 style="margin: 20px 0">Salut,</h1>

  <div style="margin: 50px 0">
    <p style="margin: 0 0 20px 0">
      Click pe butonul de mai jos pentru a confirma adresa de email:
    </p>

    <a
      href="https://restil.ro/confirmare-email/${session_id}"
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

  <p style="margin: 20px 0">
    P.S. Dacă ai întrebări, ne poți contacta la
    <a
      href="mailto: contact@restil.ro"
      style="text-decoration: none; color: #3cb371"
      >contact@restil</a
    >.
  </p>

  <p style="margin: 20px 0">Echipa Restil</p>
</div>

<footer
  style="
    height: auto;
    margin: 20px auto;
    column-gap: 0.5rem;
    text-align: center;
    display: table;
    width: auto;
  "
>
  <span
    style="
      display: table-cell;
      vertical-align: middle;
      padding-right: 0.5rem;
    "
  >
    <img
      src="https://rfs-logo-images.s3.eu-west-1.amazonaws.com/restil-h_50_px.webp"
      alt="Restil Logo"
      style="height: 25px"
    />
  </span>

  <span style="display: table-cell; vertical-align: middle">© 2023</span>

  <span style="display: table-cell; vertical-align: middle"
    >Toate drepturile rezervate.</span
  >
</footer>`;
};

export default verifyEmailHtmlMarkup;
