const newOrderHTMLMarkup = (buyerName, message) => {
  return `
<div style="text-align: center">
  <div style="display: inline-block; vertical-align: middle">
    <a href="https://restil.ro" target="_blank">
      <img
        src="https://rfs-logo-images.s3.eu-west-1.amazonaws.com/restil-h_50_px.webp"
        style="height: 50px; margin: 20px 0"
      />
    </a>

    <h1 style="margin: 20px 0">Salut,</h1>

    <p>Ai primit o comandă nouă de la ${buyerName} cu următorul mesaj:</p>

    <p style="margin: 0 0 40px 0; font-style: italic">${message}</p>

    <a
      href="https://restil.ro/userpage/orders#received"
      style="
        text-decoration: none;
        color: #fff;
        background-color: #3cb371;
        padding: 10px 20px;
        border-radius: 5px;
      "
      target="_blank"
      >Verifică comanda</a
    >

    <p style="margin: 40px 0">
      P.S. Dacă ai întrebări, ne poți contacta la
      <a
        href="mailto:contact@restil.ro"
        style="text-decoration: none; color: #3cb371"
      >
        contact@restil.ro
      </a>
      .
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
        display: inline-block;
        line-height: 50px;
        padding-right: 0.5rem;
      "
    >
      <img
        src="https://rfs-logo-images.s3.eu-west-1.amazonaws.com/restil-h_50_px.webp"
        alt="Restil Logo"
        style="height: 25px"
      />
    </span>

    <span style="display: inline-block; line-height: 50px">© 2023</span>

    <span style="display: inline-block; line-height: 50px">
      Toate drepturile rezervate.
    </span>
  </footer>
</div>`;
};

export default newOrderHTMLMarkup;
