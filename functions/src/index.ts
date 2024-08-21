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
        const [result] = await client.analyzeSentiment({
          document: {
            content: text,
            type: "PLAIN_TEXT",
          },
          encodingType: "UTF8",
        });

        const sentiment = result.documentSentiment;
        const sentences = result.sentences?.map((sentence) => ({
          text: sentence.text?.content,
          sentiment: sentence.sentiment,
        }));

        res.json({
          sentiment: {
            score: sentiment?.score,
            magnitude: sentiment?.magnitude,
          },
          sentences: sentences || [],
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

// Syntactical analysis
export const analyzeSyntax = functions.https.onRequest(
  async (req: Request, res: Response) => {
    corsHandler(req, res, async () => {
      const text = req.query.text as string;

      if (!text) {
        res.status(400).send("Text is required");
        return;
      }

      try {
        // Perform syntactic analysis
        const [result] = await client.analyzeSyntax({
          document: {
            content: text,
            type: "PLAIN_TEXT",
          },
        });

        const tokens = result.tokens?.map((token) => ({
          text: token.text?.content,
          partOfSpeech: token.partOfSpeech?.tag,
          dependencyEdge: token.dependencyEdge?.label,
        }));

        res.json({tokens});
      } catch (error) {
        console.error("Error analyzing syntax:", error);
        res.status(500).send("Error analyzing syntax");
      }
    });
  }
);

// Entity sentiment analysis
export const analyzeEntitySentiment = functions.https.onRequest(
  async (req: Request, res: Response) => {
    corsHandler(req, res, async () => {
      const text = req.query.text as string;

      if (!text) {
        res.status(400).send("Text is required");
        return;
      }

      try {
        const [result] = await client.analyzeEntitySentiment({
          document: {
            content: text,
            type: "PLAIN_TEXT",
          },
        });

        const entities = result.entities?.map((entity) => ({
          name: entity.name,
          type: entity.type,
          salience: entity.salience,
          sentiment: {
            score: entity.sentiment?.score,
            magnitude: entity.sentiment?.magnitude,
          },
        }));

        res.json({entities});
      } catch (error) {
        console.error("Error analyzing entity sentiment:", error);
        res.status(500).send("Error analyzing entity sentiment");
      }
    });
  }
);

export const analyzeSentencesWithSalience = functions.https.onRequest(
  async (req: Request, res: Response) => {
    corsHandler(req, res, async () => {
      const text = req.query.text as string;

      if (!text) {
        res.status(400).send("Text is required");
        return;
      }

      try {
        // Perform both sentiment and entity analysis
        const [sentimentResult] = await client.analyzeSentiment({
          document: {
            content: text,
            type: "PLAIN_TEXT",
          },
          encodingType: "UTF8",
        });

        const [entityResult] = await client.analyzeEntities({
          document: {
            content: text,
            type: "PLAIN_TEXT",
          },
        });

        const sentences = sentimentResult.sentences?.map((sentence) => {
          const sentenceEntities = entityResult.entities?.filter((entity) =>
            sentence.text?.content?.includes(entity.name || "")
          );

          const aggregatedSalience = sentenceEntities?.reduce((acc, entity) => {
            return acc + (entity.salience || 0);
          }, 0);

          return {
            text: sentence.text?.content,
            sentiment: sentence.sentiment?.score,
            magnitude: sentence.sentiment?.magnitude,
            aggregatedSalience: aggregatedSalience || 0,
          };
        });

        res.json({sentences: sentences || []});
      } catch (error) {
        console.error("Error analyzing text:", error);
        res.status(500).send("Error analyzing text");
      }
    });
  }
);
