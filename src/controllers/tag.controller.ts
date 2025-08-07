
import { Request, Response, NextFunction } from 'express';
import * as TagService from '../services/tag.service';

export const getTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {user} = req;
        console.log(user);
        const tags = await TagService.getTags({
            userId: user?.id,
        });
        res.json(tags);
    } catch (err) {
        next(err);
    }
};

export const getTagById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const {user} = req;
        const tag = await TagService.getTagById({
            userId: user?.id,
            tagId: id,
        });
        res.json(tag);
    } catch (err) {
        next(err);
    }
}

export const createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tagName } = req.body;
        const {user} = req;
        const tag = await TagService.createTag({
            tagName,
            userId: user?.id,
        });
        res.status(201).json(tag);
    } catch (err) {
        next(err);
    }
};

export const updateTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const { tagName } = req.body;
        const tag = await TagService.updateTag({
            tagId: id,
            tagName,
            userId: req.user?.id,
        });
        res.json(tag);
    } catch (err) {
        next(err);
    }
};

export const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const {user} = req;
        await TagService.deleteTag({
            tagId: id,
            userId: user?.id,
        });
        res.json({message: 'Tag deleted'});
    } catch (err) {
        next(err);
    }
};
