import React, { useState } from 'react';
import './TermsModal.css'; // Changed import to use its own CSS file
import PrivacyPolicyModal from './PrivacyPolicyModal'; // Import the new modal

function TermsModal({ isOpen, onClose }) {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false); // State for privacy modal

  if (!isOpen && !isPrivacyModalOpen) {
    return null;
  }

  const openPrivacyModal = (e) => {
    e.preventDefault();
    setIsPrivacyModalOpen(true);
  };

  const closePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
  };

  if (isOpen && !isPrivacyModalOpen) {
    return (
      <div className="terms-modal-overlay" onClick={onClose}>
        <div className="terms-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="terms-modal-close-btn" onClick={onClose}>
            &times;
          </div>
          <h2>Vuokraehdot</h2>

          <h3>1. VUOKRAAMINEN</h3>
          <p>
            Vuokratakseen tuotteita pesurivuokraus.fi -verkkokaupasta, asiakkaan (jäljempänä "Vuokraaja") 
            on hyväksyttävä nämä vuokraehdot.
          </p>
          <p>
            Vuokranantajana toimii <strong>LO&K Oy (Y-tunnus: 3522024-9)</strong>. Vuokraaja on osapuoli, 
            joka vuokraa tuotteet Vuokranantajalta. LO&K Oy vuokraa 
            tekstiilipesureita täysi-ikäisille yksityishenkilöille sekä yrityksille Suomessa. 
            Vuokranantaja omistaa vuokrattavat tuotteet.
          </p>
          <p>
            Tuotteet varataan ja maksetaan pesurivuokraus.fi-verkkopalvelussa. 
            Tuotteet noudetaan valitulta toimipisteeltä.
          </p>
          <h4>Vuokraajan vastuut ennen käyttöä:</h4>
          <ul>
            <li>
              <strong>Laitteen toiminnan tarkistus:</strong> Varmista laitteen moitteeton toiminta ennen käyttöönottoa. 
              Koska laitteessa käytetään vettä, testaa se tilassa, jossa mahdollinen vesivuoto ei aiheuta vahinkoa 
              (esim. kylpyhuone). Vuokranantaja ei korvaa vahinkoja, jos toimintatarkistusta ei ole tehty asianmukaisesti.
            </li>
            <li>
              <strong>Laitteen puhtauden tarkistus:</strong> Varmista laitteen puhtaus, jotta se ei vahingoita pestäviä pintoja. 
              Vuokranantaja ei korvaa vahinkoja, jos puhtaustarkistusta ei ole tehty asianmukaisesti.
            </li>
          </ul>
          <p>
            Tuotteiden lainaaminen kolmansille osapuolille on <strong>kielletty</strong>. 
            Tuotteita ei saa viedä Suomen rajojen ulkopuolelle.
          </p>

          <h3>2. VARAUKSEN PERUUTTAMINEN</h3>
          <ul>
            <li>Varaus voidaan perua <strong>veloituksetta viimeistään 24 tuntia</strong> ennen varausajan alkua.</li>
            <li>Oikea-aikaisesta peruutuksesta hyvitetään maksettu summa seuraavan varauksen yhteydessä.</li>
            <li>Myöhemmin tehdyistä peruutuksista tai käyttämättä jätetyistä varauksista ei myönnetä hyvitystä.</li>
          </ul>
          <p>
            Ilmoita peruutuksesta sähköpostitse (iisakintekstiilipesuri@gmail.com) tai tekstiviestillä (040 410 1920).
          </p>

          <h3>3. TUOTTEIDEN PALAUTTAMINEN</h3>
          <ul>
            <li>Tuotteet on palautettava noutopisteeseen varausajan päättymiseen mennessä.</li>
            <li>Palautusajan noudattamatta jättämisestä veloitetaan <strong>50 € myöhästymismaksu</strong>.</li>
            <li>Palautettavan tuotteen tulee sisältää kaikki noudettaessa mukana olleet osat.</li>
            <li>Tuote on puhdistettava huolellisesti käyttöohjeiden mukaisesti ennen palautusta.</li>
            <li>Puhdistuksen laiminlyönnistä veloitetaan <strong>50 € puhdistusmaksu</strong>.</li>
          </ul>
          <p>
             Varausaika on tyypillisesti vuorokausi (esim. klo 17.00 - seuraava päivä klo 17.00). 
             Tuotteen voi noutaa ja palauttaa joustavasti vuokra-ajan puitteissa. 
             Lyhyemmästä käyttöajasta ei myönnetä hyvitystä.
          </p>

          <h3>4. TUOTTEEN RIKKOUTUMINEN TAI KATOAMINEN</h3>
          <ul>
            <li><strong>Normaali kuluminen:</strong> Jos tuote rikkoutuu asianmukaisessa, käyttöohjeiden mukaisessa käytössä, Vuokranantaja vastaa korjauskustannuksista.</li>
            <li>
              <strong>Vuokraajan vastuu:</strong> Jos tuote rikkoutuu käyttöohjeiden vastaisen tai muuten virheellisen käytön seurauksena, 
              Vuokraaja on velvollinen korvaamaan Vuokranantajalle tuotteen uushankintahinnan.
            </li>
            <li>Vuokraaja on vastaavasti korvausvelvollinen myös kadonneesta tai varastetusta tuotteesta.</li>
            <li>Tuotteen vahingoittumisesta tai katoamisesta on ilmoitettava Vuokranantajalle <strong>välittömästi</strong>.</li>
          </ul>
          <p>
            Vuokraaja sitoutuu huolehtimaan tuotteesta parhaalla mahdollisella tavalla ja varmistamaan, 
            että hänellä on riittävät taidot laitteen turvalliseen käyttöön. 
            Vuokranantajalla on oikeus periä pantti vuokrattavista tuotteista.
          </p>

          <h3>5. HINNAT</h3>
          <p><strong>Perusvuokraus:</strong></p>
          <ul>
            <li>Tekstiilipesurin vuokra: 35 € / vuorokausi.</li>
            <li>Lisävuorokaudet: 10 € / vuorokausi.</li>
          </ul>
          <p><strong>Pesuaine:</strong></p>
          <ul>
            <li>Pesuainepaketti (4 tablettia, riittää 16 litraan vettä): 6 €.</li>
          </ul>
          <p>Kaikki ilmoitetut hinnat sisältävät arvonlisäveron (25,5 %).</p>
          <p>Tarkka vuokra-aika määritellään aina varauksen yhteydessä.</p>
          <p>Huomioithan, että noutamatta jätettyä tai kesken jäänyttä vuokra-aikaa ei hyvitetä.</p>

          <h3>6. MAKSUTAVAT</h3>
          <p>Vuokra maksetaan laskulla.</p>
          <p>Laskun eräpäivä on 7 päivää pesurin ensimmäisestä vuokrapäivästä.</p>
          <p>Maksu suoritetaan LO&K Oy:n tilille.</p>

          <h3>7. ONGELMATILANTEET</h3>
          <p>Vuokranantaja voi irtisanoa sopimuksen välittömästi ja vaatia tuotteen palauttamista, mikäli Vuokraaja:</p>
          <ul>
            <li>Antaa virheellisiä tietoja.</li>
            <li>Laiminlyö vuokranmaksun.</li>
            <li>Käsittelee tuotetta ehtojen vastaisesti.</li>
            <li>Rikkoo sopimusta muulla tavoin.</li>
          </ul>
          <p>
            Jos tuote vioittuu tai katoaa vuokra-aikana, Vuokraajan on ilmoitettava siitä välittömästi Vuokranantajalle. 
            Varkaustapauksissa Vuokraajan tulee tehdä rikosilmoitus poliisille ja toimittaa kopio ilmoituksesta Vuokranantajalle.
            Mahdollinen vakuutuskorvaus ohjataan ensisijaisesti Vuokranantajalle.
          </p>
          <p>
            Vuokranantajalla on oikeus periä Vuokraajalta kaikki kulut, jotka aiheutuvat 
            Vuokraajan aiheuttamista vahingoista, korvaavien tuotteiden hankinnasta tai saatavien perinnästä.
          </p>

          <h3>8. TIETOJEN KÄSITTELY</h3>
          <p>
            Vuokraaja hyväksyy henkilötietojensa käsittelyn Vuokranantajan <a href="#" onClick={openPrivacyModal} className="terms-link" style={{ color: '#ffbb00' }}>Rekisteri- ja tietosuojaselosteen</a> mukaisesti.
          </p>

          <h3>9. LISÄTIETOJA</h3>
          <p>
            Lisätietoja vuokraehdoista saat sähköpostitse (iisakintekstiilipesuri@gmail.com) 
            tai puhelimitse (040 410 1920).
          </p>
        </div>
      </div>
    );
  }

  if (isPrivacyModalOpen) {
    return <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={closePrivacyModal} />;
  }

  return null;
}

export default TermsModal; 