import React from 'react';
import './TermsModal.css'; // Reusing TermsModal CSS for now

function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  // PLEASE REVIEW AND CUSTOMIZE THIS TEXT TO ACCURATELY REFLECT YOUR PRACTICES
  return (
    <div className="terms-modal-overlay" onClick={onClose}>
      <div className="terms-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="terms-modal-close-btn" onClick={onClose}>
          &times;
        </div>
        <h2>Rekisteri- ja tietosuojaseloste</h2>
        <p>
          Tämä on LO&K Oy:n EU:n yleisen tietosuoja-asetuksen (GDPR) mukainen 
          rekisteri- ja tietosuojaseloste. Laadittu 6.5.2025. 
          Viimeisin muutos 6.5.2025.
        </p>

        <h3>1. Rekisterinpitäjä</h3>
        <p>
          LO&K Oy<br />
          Y-tunnus: 3522024-9<br />
          {/* [Osoite, jos haluat mainita]<br /> */}
          {/* [Puhelinnumero, jos haluat mainita]<br /> */}
          Sähköposti: huttulajo@gmail.com
        </p>

        <h3>2. Rekisteristä vastaava yhteyshenkilö</h3>
        <p>
          Lauri Huttunen<br />
          huttulajo@gmail.com
        </p>

        <h3>3. Rekisterin nimi</h3>
        <p>iisakintekstiilipesuri.fi-palvelun asiakasrekisteri</p>

        <h3>4. Oikeusperuste ja henkilötietojen käsittelyn tarkoitus</h3>
        <p>
          Henkilötietojen käsittelyn perusteena on asiakassuhde, sopimuksen 
          täytäntöönpano (pesurin vuokrauspalvelu) ja lakisääteiset velvoitteet 
          (esim. kirjanpito).
        </p>
        <p>Henkilötietojen käsittelyn tarkoitus on:</p>
        <ul>
          <li>Asiakassuhteen hoitaminen ja ylläpito</li>
          <li>Tilausten käsittely, toimitus ja arkistointi</li>
          <li>Palvelun kehittäminen</li>
          <li>Laskutus ja perintä</li>
          <li>Lakisääteisten velvoitteiden noudattaminen</li>
        </ul>

        <h3>5. Rekisterin tietosisältö</h3>
        <p>Rekisteriin tallennettavia tietoja voivat olla:</p>
        <ul>
          <li>Henkilön nimi</li>
          <li>Yhteystiedot (puhelinnumero, sähköpostiosoite, katuosoite, postinumero, postitoimipaikka)</li>
          <li>Tiedot tilatuista palveluista ja niiden muutoksista</li>
          <li>Muut asiakassuhteen hoitamiseen ja/tai tilattuihin palveluihin liittyvät tiedot (esim. vuokra-aika, lisätiedot)</li>
          <li>Yritysasiakkailta: Yrityksen nimi, Y-tunnus</li>
        </ul>

        <h3>6. Säännönmukaiset tietolähteet</h3>
        <p>
          Rekisteriin tallennettavat tiedot saadaan asiakkaalta itseltään mm. 
          verkkosivujen varauslomakkeen kautta, sähköpostitse, puhelimitse tai 
          muilla vastaavilla tavoilla.
        </p>

        <h3>7. Tietojen säännönmukaiset luovutukset ja tietojen siirto EU:n tai ETA:n ulkopuolelle</h3>
        <p>
          Tietoja ei luovuteta säännönmukaisesti muille tahoille. Tietoja voidaan 
          julkaista siltä osin kuin niin on sovittu asiakkaan kanssa.
        </p>
        <p>
          Tietoja voidaan siirtää rekisterinpitäjän toimesta myös EU:n tai ETA:n 
          ulkopuolelle, jos se on palvelun teknisen toteuttamisen kannalta tarpeellista 
          (esim. palvelin sijaitsee EU/ETA-alueen ulkopuolella), varmistaen riittävän 
          tietosuojan tason.
        </p>
        <p>
          Maksutapahtumien yhteydessä tietoja voidaan luovuttaa maksunvälityspalvelun 
          tarjoajalle.
        </p>

        <h3>8. Rekisterin suojauksen periaatteet</h3>
        <p>
          Rekisterin käsittelyssä noudatetaan huolellisuutta ja tietojärjestelmien 
          avulla käsiteltävät tiedot suojataan asianmukaisesti. Kun rekisteritietoja 
          säilytetään Internet-palvelimilla, niiden laitteiston fyysisestä ja 
          digitaalisesta tietoturvasta huolehditaan asiaankuuluvasti. Rekisterinpitäjä 
          huolehtii siitä, että tallennettuja tietoja sekä palvelimien käyttöoikeuksia ja 
          muita henkilötietojen turvallisuuden kannalta kriittisiä tietoja käsitellään 
          luottamuksellisesti ja vain niiden työntekijöiden toimesta, joiden työnkuvaan 
          se kuuluu.
        </p>
        <p>Manuaalinen aineisto säilytetään lukitussa tilassa ja hävitetään tietoturvallisesti.</p>

        <h3>9. Tarkastusoikeus ja oikeus vaatia tiedon korjaamista</h3>
        <p>
          Jokaisella rekisterissä olevalla henkilöllä on oikeus tarkistaa rekisteriin 
          tallennetut tietonsa ja vaatia mahdollisen virheellisen tiedon korjaamista 
          tai puutteellisen tiedon täydentämistä. Mikäli henkilö haluaa tarkistaa 
          hänestä tallennetut tiedot tai vaatia niihin oikaisua, pyyntö tulee 
          lähettää kirjallisesti rekisterinpitäjälle. Rekisterinpitäjä voi pyytää 
          tarvittaessa pyynnön esittäjää todistamaan henkilöllisyytensä. 
          Rekisterinpitäjä vastaa asiakkaalle EU:n tietosuoja-asetuksessa säädetyssä 
          ajassa.
        </p>

        <h3>10. Muut henkilötietojen käsittelyyn liittyvät oikeudet</h3>
        <p>
          Rekisterissä olevalla henkilöllä on oikeus pyytää häntä koskevien 
          henkilötietojen poistamiseen rekisteristä ("oikeus tulla unohdetuksi"). 
          Niin ikään rekisteröidyillä on muut EU:n yleisen tietosuoja-asetuksen 
          mukaiset oikeudet kuten henkilötietojen käsittelyn rajoittaminen tietyissä 
          tilanteissa. Pyynnöt tulee lähettää kirjallisesti rekisterinpitäjälle. 
          Rekisterinpitäjä voi pyytää tarvittaessa pyynnön esittäjää todistamaan 
          henkilöllisyytensä. Rekisterinpitäjä vastaa asiakkaalle EU:n 
          tietosuoja-asetuksessa säädetyssä ajassa (pääsääntöisesti kuukauden kuluessa).
        </p>
        <p>
          Oikeutta tietojen poistamiseen ei ole, jos käsittely on tarpeen 
          lakisääteisen velvoitteen noudattamiseksi (esim. kirjanpitolaki) tai 
          sopimukseen perustuvien velvoitteiden hoitamiseksi.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicyModal; 