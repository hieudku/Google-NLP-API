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
import * as querystring from "querystring";
import axios from "axios";

// Reddit Authorization URL
const clientId = functions.config().reddit.client_id;
const clientSecret = functions.config().reddit.client_secret;

const redirectUri = "https://automatedcontenthub-hc.web.app/callback";
const state = "random_string";
const scope = "read";

export const getRedditAuthUrl = functions.https.onRequest((req, res) => {
  const authorizationUrl = `https://www.reddit.com/api/v1/authorize?${querystring.stringify({
    client_id: clientId,
    response_type: "code",
    state: state,
    redirect_uri: redirectUri,
    duration: "permanent",
    scope: scope,
  })}`;
  console.log("Authorization URL:", authorizationUrl);
  res.send({url: authorizationUrl});
});

export const redditAuthCallback = functions.https.onRequest(
  async (req, res) => {
    const {code, state} = req.query;
    if (state !== "random_string") {
      res.status(403).send("State does not match");
      return;
    }

    try {
      const tokenResponse = await axios.post("https://www.reddit.com/api/v1/access_token", querystring.stringify({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: redirectUri,
      }), {
        auth: {
          username: clientId,
          password: clientSecret,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const {accessToken, refreshToken} = tokenResponse.data;

      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);

      res.send("Authorization successful! You can close this window.");
    } catch (error) {
      console.error("Error fetching tokens: ", error);
      res.status(500).send("Error fetching tokens");
    }
  });

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
