// ==============================================================================
// SUPABASE EDGE FUNCTION: send-email
// Framework: Deno (TypeScript)
// Description: Reçoit les notifications d'événements (avis, cartes Hanafuda, inscriptions)
//              et expédie un e-mail au format Wabi-Sabi/Edo à biitsumajin@gmail.com via l'API Resend.
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_RECIPIENT = "biitsumajin@gmail.com";
const SENDER_NAME = "Le Fardeau et le Chemin";
const SENDER_EMAIL = "notifications@lefardeauetlechemin.fr"; // Ou onboarding@resend.dev en test

interface EmailPayload {
  type: "new_review" | "new_hanafuda" | "new_member" | "editorial_inquiry";
  record?: any;
  customData?: {
    display_name?: string;
    email?: string;
    chapter_number?: number;
    chapter_title?: string;
    rating?: number;
    comment?: string;
    card_title?: string;
    kanji?: string;
    symbol?: string;
    description?: string;
    image_url?: string;
    inquiryType?: string;
    publisherName?: string;
    contactPerson?: string;
    message?: string;
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // Gestion du preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("ERREUR : La variable d'environnement RESEND_API_KEY n'est pas définie.");
      return new Response(
        JSON.stringify({ error: "Configuration manquante : RESEND_API_KEY non fournie." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: EmailPayload = await req.json();
    console.log("Événement de notification reçu:", payload.type);

    let subject = "";
    let htmlContent = "";

    // 1. NOTIFICATION : NOUVEL AVIS SUR UN CHAPITRE
    if (payload.type === "new_review") {
      const data = payload.customData || payload.record || {};
      const chapterNum = data.chapter_number || 1;
      const author = data.display_name || "Un lecteur du Tōkaidō";
      const rating = data.rating || 5;
      const comment = data.comment || "";
      const stars = "★".repeat(rating) + "☆".repeat(Math.max(0, 5 - rating));

      subject = `[Tōkaidō] Nouvel avis publié sur le Chapitre ${chapterNum} par ${author}`;

      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Georgia', serif; background-color: #141210; color: #FAF4EB; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: auto; background-color: #1A1613; border: 2px solid #C5A880; border-radius: 12px; padding: 30px; }
            .header { text-align: center; border-bottom: 1px solid #C5A880; padding-bottom: 15px; margin-bottom: 25px; }
            .badge { background-color: #963532; color: #FAF4EB; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .stars { color: #D4AF37; font-size: 18px; margin: 10px 0; }
            .quote { background-color: #221B17; border-left: 4px solid #963532; padding: 15px; font-style: italic; margin: 20px 0; border-radius: 4px; }
            .footer { font-size: 11px; color: #C5A880; text-align: center; margin-top: 30px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="badge">荷と道 • REGISTRE DE LECTURE</span>
              <h2 style="color: #FAF4EB; margin: 10px 0 5px;">Nouvel Avis sur le Chapitre ${chapterNum}</h2>
              <div style="color: #C5A880; font-size: 13px;">Roman « Le Fardeau et le Chemin »</div>
            </div>

            <p><strong>Voyageur :</strong> ${author}</p>
            <p><strong>Chapitre :</strong> Chapitre ${chapterNum}</p>
            <div class="stars"><strong>Appréciation :</strong> ${stars} (${rating}/5)</div>

            <div class="quote">
              "${comment.replace(/\n/g, "<br/>")}"
            </div>

            <div style="margin-top: 25px; text-align: center;">
              <a href="https://lefardeauetlechemin.fr" style="background-color: #963532; color: #FAF4EB; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: bold; display: inline-block;">
                Consulter dans la Liseuse
              </a>
            </div>

            <div class="footer">
              Notification automatique générée par le système d'Edo • Sceau Shogunal
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // 2. NOTIFICATION : NOUVELLE CARTE HANAFUDA
    else if (payload.type === "new_hanafuda") {
      const data = payload.customData || payload.record || {};
      const chapterNum = data.chapter_number || 1;
      const author = data.display_name || "Un membre du Tōkaidō";
      const cardTitle = data.card_title || "Motif Hanafuda";
      const kanji = data.kanji || "花";
      const symbol = data.symbol || "";
      const description = data.description || "";
      const imageUrl = data.image_url || "";

      subject = `[Tōkaidō] Nouvelle carte Hanafuda proposée pour le Chapitre ${chapterNum}`;

      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Georgia', serif; background-color: #141210; color: #FAF4EB; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: auto; background-color: #1A1613; border: 2px solid #D4AF37; border-radius: 12px; padding: 30px; }
            .header { text-align: center; border-bottom: 1px solid #D4AF37; padding-bottom: 15px; margin-bottom: 25px; }
            .badge { background-color: #963532; color: #FAF4EB; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .kanji-box { display: inline-block; background-color: #963532; color: #FAF4EB; padding: 10px 18px; border-radius: 8px; font-size: 28px; border: 1px solid #D4AF37; margin-bottom: 15px; }
            .card-preview { text-align: center; margin: 20px 0; }
            .card-img { max-width: 200px; border-radius: 8px; border: 2px solid #D4AF37; }
            .desc-box { background-color: #221B17; padding: 15px; border-radius: 6px; font-size: 13px; line-height: 1.6; }
            .footer { font-size: 11px; color: #C5A880; text-align: center; margin-top: 30px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="badge">花札 • GALERIE PARTICIPATIVE</span>
              <h2 style="color: #FAF4EB; margin: 10px 0 5px;">Proposition de Carte Hanafuda</h2>
              <div style="color: #C5A880; font-size: 13px;">Chapitre ${chapterNum} • En attente de validation</div>
            </div>

            <div style="text-align: center;">
              <div class="kanji-box">${kanji}</div>
              <h3 style="color: #D4AF37; margin: 0 0 5px;">${cardTitle}</h3>
              <p style="color: #C5A880; font-size: 13px; margin: 0;">Symbole : ${symbol}</p>
              <p style="font-size: 12px; color: #FAF4EB; opacity: 0.8;">Auteur : ${author}</p>
            </div>

            ${imageUrl ? `
              <div class="card-preview">
                <img src="${imageUrl}" alt="${cardTitle}" class="card-img" />
              </div>
            ` : ""}

            <div class="desc-box">
              <strong>Allégorie & Résonance littéraire :</strong><br/>
              ${description.replace(/\n/g, "<br/>")}
            </div>

            <div style="margin-top: 25px; text-align: center;">
              <a href="https://lefardeauetlechemin.fr" style="background-color: #963532; color: #FAF4EB; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: bold; display: inline-block; border: 1px solid #D4AF37;">
                Ouvrir la Chambre de Modération Shogunale
              </a>
            </div>

            <div class="footer">
              Action requise : Modérer cette carte dans l'Espace Administrateur.
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // 3. NOTIFICATION : NOUVELLE INSCRIPTION MEMBRE
    else if (payload.type === "new_member") {
      const data = payload.customData || payload.record || {};
      const displayName = data.display_name || "Nouveau Voyageur";
      const email = data.email || "Non communiqué";

      subject = `[Tōkaidō] Nouveau membre inscrit : ${displayName}`;

      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Georgia', serif; background-color: #141210; color: #FAF4EB; padding: 20px; }
            .container { max-width: 550px; margin: auto; background-color: #1A1613; border: 1px solid #C5A880; border-radius: 10px; padding: 25px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h3 style="color: #D4AF37; margin-top: 0;">Nouveau Voyageur sur la Route d'Edo</h3>
            <p>Un nouveau lecteur vient de forger son sceau Hanko sur la plateforme :</p>
            <ul>
              <li><strong>Pseudo / Nom :</strong> ${displayName}</li>
              <li><strong>E-mail :</strong> ${email}</li>
            </ul>
            <p style="font-size: 12px; color: #C5A880;">Le compte est initialisé avec les droits de lecteur.</p>
          </div>
        </body>
        </html>
      `;
    }

    // 4. NOTIFICATION : DEMANDE ÉDITORIALE
    else if (payload.type === "editorial_inquiry") {
      const data = payload.customData || {};
      subject = `[Tōkaidō Édition] Nouvelle sollicitation de ${data.publisherName || "Maison d'édition"}`;

      htmlContent = `
        <div style="font-family: Georgia, serif; background-color: #141210; color: #FAF4EB; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: #1A1613; border: 2px solid #963532; padding: 25px; border-radius: 8px;">
            <h2 style="color: #D4AF37;">Nouvelle Demande Éditoriale</h2>
            <p><strong>Maison d'édition :</strong> ${data.publisherName}</p>
            <p><strong>Interlocuteur :</strong> ${data.contactPerson}</p>
            <p><strong>E-mail :</strong> ${data.email}</p>
            <p><strong>Type :</strong> ${data.inquiryType}</p>
            <div style="background-color: #221B17; padding: 15px; border-left: 4px solid #D4AF37; margin: 15px 0;">
              ${(data.message || "").replace(/\n/g, "<br/>")}
            </div>
          </div>
        </div>
      `;
    }

    else {
      return new Response(
        JSON.stringify({ error: "Type d'événement non reconnu." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Appel à l'API RESEND
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: [ADMIN_RECIPIENT],
        subject: subject,
        html: htmlContent,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Erreur renvoyée par l'API Resend:", resendData);
      return new Response(
        JSON.stringify({ error: "Échec de l'envoi de l'e-mail via Resend", details: resendData }),
        { status: resendResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("E-mail envoyé avec succès à", ADMIN_RECIPIENT, "ID Resend:", resendData.id);

    return new Response(
      JSON.stringify({ success: true, messageId: resendData.id, to: ADMIN_RECIPIENT, subject }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Exception dans send-email Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
