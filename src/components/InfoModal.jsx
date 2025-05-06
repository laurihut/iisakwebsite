import React from 'react';
import './InfoModal.css'; // We'll create this CSS file next

const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <>
      <h2>Tekstiilipesurin nouto- ja palautusohjeet:</h2>
      <ul>
        <li>Pesuri sijaitsee osoitteessa [TÄYTÄ OSOITE TÄHÄN].</li>
        <li>Saat tarkemmat ohjeet ja avainboksin koodin sähköpostiisi varausvahvistuksen yhteydessä. Tarkistathan myös roskapostikansion.</li>
        <li>Avainboksi sijaitsee [AVAINBOKSIN SIJAINTI, esim. ulko-oven vieressä oikealla puolella].</li>
        <li>Nouda pesuri sovittuna ajankohtana (yleensä klo 17 alkaen).</li>
        <li>Palauta pesuri sovittuun aikaan mennessä siistissä kunnossa ja kaikki osat tallella.</li>
        <li>Ohjeet pesurin käyttöön löydät laitteen mukana tai [LINKKI OHJEISIIN/OHJESIVU].</li>
        <li>Ongelmatilanteissa ota yhteyttä: [PUHELINNUMERO] tai [SÄHKÖPOSTI].</li>
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