import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions'
import { NextFunction, Request, Response } from 'express';

/**
 * Creates a middleware function for use in Express-compatible web servers.
 *
 * @param clientPublicKey - The public key from the Discord developer dashboard
 * @returns The middleware function
 */
 export function verifyKeyMiddleware(clientPublicKey: string): (req: Request, res: Response, next: NextFunction) => void {
  if (!clientPublicKey) {
    throw new Error('You must specify a Discord client public key');
  }

  return function (req: Request, res: Response, next: NextFunction) {
    const timestamp = (req.header('X-Signature-Timestamp') || '') as string;
    const signature = (req.header('X-Signature-Ed25519') || '') as string;

    function onBodyComplete(rawBody: Buffer) {
      if (!verifyKey(rawBody, signature, timestamp, clientPublicKey)) {
        res.statusCode = 401;
        res.end('[discord-interactions] Invalid signature');
        return;
      }

      const body = JSON.parse(rawBody.toString('utf-8')) || {};
      if (body.type === InteractionType.PING) {
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            type: InteractionResponseType.PONG,
          }),
        );
        return;
      }

      req.body = body;
      next();
    }

    if (req.body) {
      if (Buffer.isBuffer(req.body)) {
        onBodyComplete(req.body);
      } else if (typeof req.body === 'string') {
        onBodyComplete(Buffer.from(req.body, 'utf-8'));
      } else {
        // console.warn(
        //   '[discord-interactions]: req.body was tampered with, probably by some other middleware. We recommend disabling middleware for interaction routes so that req.body is a raw buffer.',
        // );
        // Attempt to reconstruct the raw buffer. This works but is risky
        // because it depends on JSON.stringify matching the Discord backend's
        // JSON serialization.
        onBodyComplete(Buffer.from(JSON.stringify(req.body), 'utf-8'));
      }
    } else {
      const chunks: Array<Buffer> = [];
      req.on('data', (chunk) => {
        chunks.push(chunk);
      });
      req.on('end', () => {
        const rawBody = Buffer.concat(chunks);
        onBodyComplete(rawBody);
      });
    }
  };
}
