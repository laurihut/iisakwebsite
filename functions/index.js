    // functions/index.js
    const functions = require("firebase-functions"); // For older syntax, keep for now
    const { onCall, HttpsOptions } = require("firebase-functions/v2/https"); // Import HttpsOptions
    const { defineString } = require("firebase-functions/params"); // Import for defining parameters
    const nodemailer = require("nodemailer");
    const admin = require("firebase-admin"); // Import Firebase Admin SDK

    // PDFMake setup
    const pdfMakeModule = require('pdfmake');
    const pdfMakeVfs = require('pdfmake/build/vfs_fonts.js');

    // Prepare font definitions for pdfMake using raw Buffer data from VFS
    const pdfMakeFonts = {
        Roboto: {
            normal: Buffer.from(pdfMakeVfs['Roboto-Regular.ttf'], 'base64'),
            bold: Buffer.from(pdfMakeVfs['Roboto-Medium.ttf'], 'base64'),
            italics: Buffer.from(pdfMakeVfs['Roboto-Italic.ttf'], 'base64'),
            bolditalics: Buffer.from(pdfMakeVfs['Roboto-MediumItalic.ttf'], 'base64')
        }
    };

    // Assign VFS and Fonts to the pdfMake instance. 
    if (pdfMakeModule.pdfMake) { 
        pdfMakeModule.pdfMake.vfs = pdfMakeVfs; // Keep VFS for other potential uses by pdfmake
        pdfMakeModule.pdfMake.fonts = pdfMakeFonts; // Assign fonts with raw buffers
    } else { 
        pdfMakeModule.vfs = pdfMakeVfs;
        pdfMakeModule.fonts = pdfMakeFonts;
    }

    const PdfPrinter = pdfMakeModule; 

    if (!admin.apps.length) {
        admin.initializeApp();
    }
    const db = admin.firestore(); 

    const EMAIL_USER_PARAM = defineString("EMAIL_USER");
    const ADMIN_EMAIL_PARAM = defineString("ADMIN_EMAIL");

    let confirmationTransporterInstance = null;

    async function generateInvoicePdf(bookingData, formattedStartDate, formattedReturnDate) {
        try {
            const {
                name, email, streetAddress, zipCode, phone, 
                numberOfDays, detergent, totalCost
            } = bookingData;

            const companyName = "Iisakin tekstiilipesuri";
            const companyAddress = "Pellavapellontie 7A, 00650 Helsinki";
            const companyEmail = EMAIL_USER_PARAM.value();
            const companyPhone = "040 410 1920";
            const companyVatId = "Y-tunnus: 3522024-9";
            const companyBankAccount = "FI45 7997 7995 5578 11";

            const invoiceNumber = `INV-${Date.now().toString().substring(4)}`;
            const referenceNumber = `RF${Math.floor(10000000 + Math.random() * 90000000)}`;
            
            const rentalCost = detergent ? totalCost - 6 : totalCost;
            const detergentCost = detergent ? 6 : 0;
            const vatRate = 25.5;
            const subtotal = (totalCost * 100) / (100 + vatRate);
            const vatAmount = totalCost - subtotal;
            
            const docDefinition = {
                content: [
                    {
                        columns: [
                            { width: '*', text: [{ text: companyName + '\n', style: 'companyName' }, { text: companyAddress + '\n', style: 'companyDetails' }, { text: companyPhone + '\n', style: 'companyDetails' }, { text: companyEmail + '\n', style: 'companyDetails' }, { text: companyVatId, style: 'companyDetails' }] },
                            { width: '*', text: [{ text: 'LASKU\n', style: 'invoiceTitle' }, { text: `Laskun numero: ${invoiceNumber}\n`, style: 'invoiceDetails' }, { text: `Laskun päivämäärä: ${new Date().toLocaleDateString('fi-FI')}\n`, style: 'invoiceDetails' }, { text: `Viitenumero: ${referenceNumber}`, style: 'invoiceDetails' }], alignment: 'right' }
                        ]
                    },
                    { text: '', margin: [0, 20, 0, 0] },
                    {
                        columns: [
                            { width: '*', text: [{ text: 'Laskutettava:\n', style: 'sectionHeader' }, { text: name + '\n', style: 'customerDetails' }, { text: streetAddress + '\n', style: 'customerDetails' }, { text: zipCode + '\n', style: 'customerDetails' }, { text: phone + '\n', style: 'customerDetails' }, { text: email, style: 'customerDetails' }] },
                            { width: '*', text: [{ text: 'Palvelun tiedot:\n', style: 'sectionHeader' }, { text: `Vuokrausaika: ${formattedStartDate} - ${formattedReturnDate}\n`, style: 'customerDetails' }, { text: `Vuokrauspäivät: ${numberOfDays} päivää`, style: 'customerDetails' }], alignment: 'right' }
                        ]
                    },
                    { text: '', margin: [0, 20, 0, 0] },
                    {
                        table: {
                            headerRows: 1, widths: ['*', 'auto', 'auto', 'auto'],
                            body: [
                                [{ text: 'Kuvaus', style: 'tableHeader' }, { text: 'Määrä', style: 'tableHeader', alignment: 'center' }, { text: 'Hinta (€)', style: 'tableHeader', alignment: 'right' }, { text: 'Yhteensä (€)', style: 'tableHeader', alignment: 'right' }],
                                [{ text: `Tekstiilipesurin vuokraus (${numberOfDays} päivää)` }, { text: '1', alignment: 'center' }, { text: rentalCost.toFixed(2), alignment: 'right' }, { text: rentalCost.toFixed(2), alignment: 'right' }],
                                ...(detergent ? [[{ text: 'Pesuaine' }, { text: '1', alignment: 'center' }, { text: detergentCost.toFixed(2), alignment: 'right' }, { text: detergentCost.toFixed(2), alignment: 'right' }]] : [])
                            ]
                        }
                    },
                    {
                        layout: 'noBorders', table: {
                            widths: ['*', 'auto', 'auto'],
                            body: [
                                [{}, { text: 'Välisumma:', style: 'tableFooter', alignment: 'right' }, { text: subtotal.toFixed(2) + ' €', style: 'tableFooter', alignment: 'right' }],
                                [{}, { text: `ALV (${vatRate}%):`, style: 'tableFooter', alignment: 'right' }, { text: vatAmount.toFixed(2) + ' €', style: 'tableFooter', alignment: 'right' }],
                                [{}, { text: 'Yhteensä:', style: 'totalAmount', alignment: 'right' }, { text: totalCost.toFixed(2) + ' €', style: 'totalAmount', alignment: 'right' }]
                            ]
                        }, margin: [0, 10, 0, 0]
                    },
                    { text: '', margin: [0, 20, 0, 0] },
                    {
                        text: [
                            { text: 'Maksutiedot:\n', style: 'sectionHeader' },
                            { text: 'Tilinumero: ', style: 'paymentDetailLabel' }, { text: companyBankAccount + '\n', style: 'paymentDetail' },
                            { text: 'Viitenumero: ', style: 'paymentDetailLabel' }, { text: referenceNumber + '\n', style: 'paymentDetail' },
                            { text: 'Summa: ', style: 'paymentDetailLabel' }, { text: totalCost.toFixed(2) + ' €\n', style: 'paymentDetail' },
                            { text: 'Eräpäivä: ', style: 'paymentDetailLabel' }, { text: new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString('fi-FI'), style: 'paymentDetail' }
                        ]
                    },
                    { text: 'Kiitos varauksestasi Iisakin tekstiilipesuriin!', style: 'thankYouNote', margin: [0, 30, 0, 0] }
                ],
                styles: {
                    companyName: { fontSize: 18, bold: true, margin: [0, 0, 0, 5] },
                    companyDetails: { fontSize: 10, color: '#666666' },
                    invoiceTitle: { fontSize: 24, bold: true, margin: [0, 0, 0, 10] },
                    invoiceDetails: { fontSize: 12 },
                    sectionHeader: { fontSize: 14, bold: true, margin: [0, 0, 0, 5] },
                    customerDetails: { fontSize: 12, margin: [0, 0, 0, 2] },
                    tableHeader: { fontSize: 12, bold: true, fillColor: '#eeeeee', margin: [0, 5, 0, 5] },
                    tableFooter: { fontSize: 12, margin: [0, 5, 0, 5] },
                    totalAmount: { fontSize: 14, bold: true, margin: [0, 5, 0, 5] },
                    paymentDetailLabel: { fontSize: 12, bold: true },
                    paymentDetail: { fontSize: 12 },
                    thankYouNote: { fontSize: 14, italics: true, alignment: 'center' }
                },
                defaultStyle: { font: 'Roboto' } 
            };
            
            // Printer is instantiated with font definitions that contain raw Buffer data
            const printer = new PdfPrinter(pdfMakeFonts); 

            // Assigning VFS to printer; vfs_fonts.js can contain more than just these specific fonts (e.g. standard symbols)
            printer.vfs = pdfMakeVfs; 

            // No need for diagnostic logs about VFS keys here as we are providing raw buffers for Roboto
            // console.log("VFS directly assigned to printer. Checking for Roboto-Medium.ttf key in printer.vfs:", typeof printer.vfs['Roboto-Medium.ttf']);
            // console.log("Source pdfMakeVfs check for Roboto-Medium.ttf:", typeof pdfMakeVfs['Roboto-Medium.ttf']);

            console.log("Creating PDF document with raw font buffers in font definitions...");
            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            
            return new Promise((resolve, reject) => {
                try {
                    const chunks = [];
                    pdfDoc.on('data', chunk => { chunks.push(chunk); });
                    pdfDoc.on('end', () => {
                        try {
                            if (typeof Buffer === 'undefined') {
                                console.error("Buffer is undefined. Cannot create PDF buffer.");
                                return reject(new Error("Buffer is not defined in the environment."));
                            }
                            const pdfBuffer = Buffer.concat(chunks);
                            console.log(`PDF buffer generated. Size: ${pdfBuffer.length} bytes`);
                            if (pdfBuffer.length === 0) console.warn("PDF buffer is empty after concatenation.");
                            resolve(pdfBuffer);
                        } catch (bufferError) {
                            console.error("Error creating buffer from chunks:", bufferError);
                            reject(bufferError);
                        }
                    });
                    pdfDoc.on('error', error => {
                        console.error("PDF generation stream error:", error);
                        reject(error);
                    });
                    pdfDoc.end();
                } catch (streamError) {
                    console.error("Error in PDF stream handling setup:", streamError);
                    reject(streamError);
                }
            });
        } catch (error) {
            console.error("Error in generateInvoicePdf function:", error);
            if (error.message && error.message.includes("Buffer is not defined")) throw error; 
            throw new Error(`PDF generation failed: ${error.message}`);
        }
    }

    // Access the actual values of the parameters
    // Note: .value() can only be called within a function context or at top level of index.js
    // For safety, let's initialize the transporter when the function is first called, or keep as is if values are available at init.
    // The safest approach is to initialize inside the function or ensure this top-level access is robust.

    // Attempt to create transporter
    // We need to access .value() to get the actual string values.
    // This top-level initialization can still be tricky if values aren't immediately resolvable.
    // Let's refine to initialize lazily or ensure robust error handling here.

    function getConfirmationTransporter() {
        if (confirmationTransporterInstance) return confirmationTransporterInstance;
        const gmailUser = EMAIL_USER_PARAM.value();
        const gmailPass = (typeof process !== 'undefined' && process.env) ? process.env.EMAIL_PASS : null;
        if (!gmailUser || !gmailPass) {
            console.error("Email user or password not configured.");
            return null;
        }
        try {
            confirmationTransporterInstance = nodemailer.createTransport({
                service: "gmail",
                auth: { user: gmailUser, pass: gmailPass },
            });
            console.log("Nodemailer (confirmation) transporter configured.");
            return confirmationTransporterInstance;
        } catch (error) {
            console.error("Failed to create Nodemailer (confirmation) transporter:", error);
            return null;
        }
    }

    // Use the v2 onCall handler
    exports.sendBookingConfirmationEmail = onCall(
        { secrets: ["EMAIL_PASS"], cors: true, region: "us-central1" },
        async (request) => {
            const transporter = getConfirmationTransporter();
            if (!transporter) return { error: { code: 'internal', message: 'Email service not configured.' } };
            
            const { name, email, streetAddress, zipCode, phone, extraInfo, selectedDateString, numberOfDays, detergent, totalCost } = request.data;
            if (!selectedDateString || !selectedDateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                console.error("Invalid selectedDateString:", selectedDateString);
                return { error: { code: 'invalid-argument', message: 'Valid date string (YYYY-MM-DD) required.' } };
            }

            const currentGmailUser = EMAIL_USER_PARAM.value();
            const currentAdminEmail = ADMIN_EMAIL_PARAM.value();
            let formattedStartDateForEmail = 'Päivämäärävirhe', formattedReturnDateForEmail = 'Päivämäärävirhe';

            try {
                const [year, monthNum, dayNum] = selectedDateString.split('-').map(Number);
                const startDateUtc = new Date(Date.UTC(year, monthNum - 1, dayNum));
                formattedStartDateForEmail = startDateUtc.toLocaleDateString('fi-FI', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
                const returnDateUtc = new Date(startDateUtc.getTime());
                returnDateUtc.setUTCDate(startDateUtc.getUTCDate() + numberOfDays - 1);
                formattedReturnDateForEmail = returnDateUtc.toLocaleDateString('fi-FI', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
            } catch (e) { console.error("Error formatting dates for email:", e); }

            const detergentText = detergent ? "Kyllä" : "Ei";
            let invoicePdfBuffer = null;

            try {
                console.log("Attempting PDF generation (raw font buffers) - for potential future use...");
                const bookingData = { name, email, streetAddress, zipCode, phone, numberOfDays, detergent, totalCost };
                invoicePdfBuffer = await generateInvoicePdf(bookingData, formattedStartDateForEmail, formattedReturnDateForEmail);
                if (invoicePdfBuffer && invoicePdfBuffer.length > 0) {
                    console.log(`PDF generated (raw font buffers) but NOT ATTACHING. Size: ${invoicePdfBuffer.length} bytes`);
                } else {
                    console.warn("PDF buffer null/empty (raw font buffers) - NOT ATTACHING.");
                }
            } catch (error) {
                console.error("Critical error PDF generation (raw font buffers) - NOT ATTACHING:", error);
            }

            const attachments = [];

            const mailOptionsToCustomer = {
                from: `"Iisakin tekstiilipesuri" <${currentGmailUser}>`,
                to: email,
                subject: "Vahvistus varauksestasi - Iisakin tekstiilipesuri",
                html: `
                  <p>Hei ${name},</p>
                  <p>Kiitos varauksestasi Iisakin Tekstiilipesurilta! Tämä on vahvistus tekstiilipesurin vuokrauksesta.</p>
                  <h3>Varaustiedot:</h3>
                  <ul>
                    <li><strong>Nimi:</strong> ${name}</li>
                    <li><strong>Sähköposti:</strong> ${email}</li>
                    <li><strong>Puhelin:</strong> ${phone}</li>
                    <li><strong>Katuosoite:</strong> ${streetAddress}</li>
                    <li><strong>Postinumero:</strong> ${zipCode}</li>
                    <li><strong>Valittu alkamispäivä:</strong> ${formattedStartDateForEmail} (nouto klo 17:00 alkaen)</li>
                    <li><strong>Viimeinen palautusaika:</strong> ${formattedReturnDateForEmail} klo 17:00 mennessä</li>
                    <li><strong>Pesuaine (6€):</strong> ${detergentText}</li>
                    <li><strong>Lisätiedot:</strong> ${extraInfo || 'Ei lisätietoja'}</li>
                    <li><strong>Kokonaishinta:</strong> ${totalCost} € (sis. ALV 25,5%)</li>
                  </ul>
                  <p>Alla näet varauksesi tiedot.</p>
                  <h3>Nouto- ja palautusohjeet:</h3>
                  <p>Pesuri sijaitsee Oulunkylässä osoitteessa: <strong>Pellavapellontie 7A, 00650 Helsinki</strong>.</p>
                  <p>Muistathan palauttaa pesurin sovittuun aikaan mennessä siistissä kunnossa, puhdistettuna ja kaikki osat tallella.</p>
                  <p>Ongelmatilanteissa tai jos haluat muokata varaustasi, ota yhteyttä sähköpostilla <a href="mailto:${currentGmailUser}">${currentGmailUser}</a> tai puhelimitse/tekstiviestillä numeroon 040 410 1920.</p>
                  <p>Ystävällisin terveisin,<br>Iisaki</p>
                `,
                attachments: attachments
            };

            if (currentAdminEmail) {
                const mailOptionsToAdmin = {
                    from: `"Varausjärjestelmä - Iisakin Tekstiilipesuri" <${currentGmailUser}>`,
                    to: currentAdminEmail,
                    subject: `Uusi tekstiilipesurivaraus: ${name} - ${formattedStartDateForEmail}`,
                    html: `
                      <h1>Uusi varaus vastaanotettu</h1>
                      <p>Asiakas: <strong>${name}</strong> (<a href="mailto:${email}">${email}</a>)</p>
                      <p>Puhelin: ${phone}</p><p>Osoite: ${streetAddress}, ${zipCode}</p>
                      <h3>Varaustiedot:</h3>
                      <ul>
                        <li><strong>Valittu alkamispäivä:</strong> ${formattedStartDateForEmail}</li>
                        <li><strong>Viimeinen palautusaika:</strong> ${formattedReturnDateForEmail} klo 17:00 mennessä</li>
                        <li><strong>Pesuaine:</strong> ${detergentText}</li>
                        <li><strong>Lisätiedot:</strong> ${extraInfo || 'Ei lisätietoja'}</li>
                        <li><strong>Kokonaishinta:</strong> ${totalCost} €</li>
                      </ul>
                      <hr><p>Tämä on automaattinen ilmoitus varausjärjestelmästä.</p>
                    `
                };
                try {
                    console.log("Sending notification email to admin...");
                    await transporter.sendMail(mailOptionsToAdmin);
                    console.log("Notification email sent to admin successfully.");
                } catch (adminEmailError) {
                    console.error("Error sending notification email to admin:", adminEmailError);
                }
            }

            try {
              console.log("Sending confirmation email to customer...");
              await transporter.sendMail(mailOptionsToCustomer);
              console.log("Confirmation email sent to customer successfully.");
              return { success: true, message: "Emails sent successfully, PDF attachment is now disabled." };
            } catch (customerEmailError) {
              console.error("Error sending confirmation email to customer:", customerEmailError);
              return { error: { code: 'internal', message: `Failed to send email to customer: ${customerEmailError.message}` } };
            }
        }
    );

    exports.getPublicBookedDatesInMonth = onCall(
        { cors: true, region: "us-central1" },
        async (request) => {
            const { year, month } = request.data;
            if (typeof year !== 'number' || typeof month !== 'number' || month < 0 || month > 11) {
                console.error("Invalid year/month provided:", request.data);
                return { error: { code: 'invalid-argument', message: 'Valid year and month (0-11) are required.' } };
            }
            const startDateOfMonthUTC = new Date(Date.UTC(year, month, 1));
            const endDateOfMonthUTC = new Date(Date.UTC(year, month + 1, 1));
            const startTimestamp = admin.firestore.Timestamp.fromDate(startDateOfMonthUTC);
            const endTimestamp = admin.firestore.Timestamp.fromDate(endDateOfMonthUTC);
            try {
                const bookingsQuery = db.collection('bookings')
                    .where('bookingDate', '>=', startTimestamp)
                    .where('bookingDate', '<', endTimestamp);
                const querySnapshot = await bookingsQuery.get();
                const bookedDates = new Set();
                querySnapshot.forEach(doc => {
                    const booking = doc.data();
                    if (booking.bookingDate && booking.bookingDate.toDate) {
                        const jsDate = booking.bookingDate.toDate();
                        const y = jsDate.getUTCFullYear();
                        const m = jsDate.getUTCMonth();
                        const d = jsDate.getUTCDate();
                        const dateString = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        bookedDates.add(dateString);
                    }
                });
                console.log(`Fetched ${bookedDates.size} unique booked dates for ${year}-${month + 1} (UTC).`);
                return { success: true, dates: Array.from(bookedDates) };
            } catch (error) {
                console.error("Error fetching booked dates in function:", error);
                return { error: { code: 'internal', message: 'Failed to retrieve booking availability.' } };
            }
        }
    );
    // --- End of getPublicBookedDatesInMonth ---