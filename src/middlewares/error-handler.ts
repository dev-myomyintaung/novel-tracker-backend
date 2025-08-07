import {NextFunction, Request, Response} from "express";
import {HttpError} from "http-errors";

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    // Determine HTTP status code
    const status =
        err instanceof HttpError
            ? err.status           // http-errors sets .status
            : typeof (err as any).statusCode === 'number'
                ? (err as any).statusCode
                : 500;               // default to 500 :contentReference[oaicite:4]{index=4}

    // Determine a message
    const message =
        err instanceof Error
            ? err.message
            : typeof err === 'string'
                ? err
                : 'Internal Server Error';


    // Log full error for debugging/monitoring
    console.error(err);

    res.status(status).json({error: message});
};

export default errorHandler;
