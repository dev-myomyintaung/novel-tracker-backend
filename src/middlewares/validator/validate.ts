import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { BadRequest } from 'http-errors';

export const validate = (rules: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for (const rule of rules) {
            await rule.run(req);
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMsg = errors.array().map(err => err.msg).join(', ');
            return next(new BadRequest(errorMsg));
        }

        next();
    };
};
