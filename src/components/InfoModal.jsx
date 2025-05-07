import React from 'react';
import './InfoModal.css'; // We'll create this CSS file next

const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <>
      <h2>Tekstiilipesurin nouto- ja palautusohjeet:</h2>
      <ul style={{ textAlign: 'left', color: '#fff' }}>
        <li >Pesuri sijaitsee Oulunkylässä osoitteessa Pellavapellontie 7A, 00650 Helsinki.</li>
        <li>Saat tarkemmat ohjeet sähköpostiisi varausvahvistuksen yhteydessä. Tarkistathan myös roskapostikansion.
            Mikäli haluat muokata varaustasi, ota yhteyttä sähköpostilla tai puhelimitse viestillä (iisakintekstiilipesuri@gmail.com, 040 410 1920).
        </li>
        <li>Pesurin mukana tulee paperinen eritelty lasku.</li>
        <li>Nouda pesuri klo 17 alkaen ja palauta palautuspäivänä kello 17 mennessä. Voit myös kysyä hakua aiemmin tarvittaessa.</li>
        <li>Palauta pesuri sovittuun aikaan mennessä siistissä kunnossa puhdistettuna ja kaikki osat tallella.</li>
        <li>Ohjeet pesurin käyttöön löydät laitteen mukana tai <a href="https://s1.kaercher-media.com/documents/manuals/html/BTA-5765075-000-04/FI.html#U_32580_1_2023918727127497" target="_blank" rel="noopener noreferrer" style={{color: '#ecb500'}}>ohjeet täältä</a>.</li>
        <li>Pesuaine on tablettimuotoinen ja 2 tablettia riittää täyteen astiaan. Jos ostat pesuaineen, se sisältää 4 tablettia.</li>
        <li>Ongelmatilanteissa ota yhteyttä: iisakintekstiilipesuri@gmail.com tai 040 410 1920.</li>
      </ul>
      <p>Kiitos varauksestasi!</p>
    </>
  );

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="info-modal-close-btn" onClick={onClose} aria-label="Sulje">
          &times;
        </button>
        {modalContent}
      </div>
    </div>
  );
};

export default InfoModal; 