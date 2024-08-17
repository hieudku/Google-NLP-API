/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as language from "@google-cloud/language";
import {Request, Response} from "express";
import * as cors from "cors";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Initialize the Google Cloud Natural Language client
const client = new language.LanguageServiceClient();

const corsHandler = cors({origin: true});

// Sentiment Analysis
export const analyzeText = functions.https.onRequest(
  async (req: Request, res: Response) => {
    corsHandler(req, res, async () => {
      const text = req.query.text as string;

      if (!text) {
        res.status(400).send("Text is required");
        return;
      }

      try {
        // Perform sentiment analysis
        const [result] = await client.analyzeSentiment({
          document: {
            content: text,
            type: "PLAIN_TEXT",
          },
        });
        const sentiment = result.documentSentiment;

        res.json({
          sentiment: {
            score: sentiment?.score,
            magnitude: sentiment?.magnitude,
          },
        });
      } catch (error) {
        console.error("Error analyzing text:", error);
        res.status(500).send("Error analyzing text");
      }
    });
  }
);

// Entity Analysis
export const analyzeEntities = functions.https.onRequest(
  async (req: Request, res: Response) => {
    corsHandler(req, res, async () => {
      const text = req.query.text as string;

      if (!text) {
        res.status(400).send("No text provided");
        return;
      }

      try {
        const [result] = await client.analyzeEntities({
          document: {
            content: text,
            type: "PLAIN_TEXT",
          },
        });

        const entities = result.entities?.map((entity) => ({
          name: entity.name,
          type: entity.type,
          salience: entity.salience,
        }));

        res.json({entities});
      } catch (error) {
        console.error("Error analyzing entities:", error);
        res.status(500).send("Error analyzing entities");
      }
    });
  }
);
