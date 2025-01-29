const movieService = require('../services/movieService');
const User = require('../models/User');
const validator = require('../utils/validator');


class movieController {
    async getAll(req, res) {
        try {
            // await validator.isUserRegisterd(req);
            const userId = req.headers.userid; // Getting userId from headers

            const movies = await movieService.getAll(userId); // Passing userId to service
            res.json({ movies });
        } catch (error) {
            if (error.message == 'Missing userId header - Only an existing user can perform this action') {
                res.status(400).send(error.message);
            }
            else if (error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')) {
                res.status(404).send('User not registerd');
            }
            else {
                res.status(500).send(error.message);
            }
        }
    }

    async getById(req, res) {
        try {
            // await validator.isUserRegisterd(req);
            const movie = await movieService.getById(req.params.id);
            res.json(movie);
        } catch (error) {
            if (error.message === 'Id is required' || error.message === 'Invalid id format') {
                res.status(400).json({ error: error.message });
            }
            else if (error.message == 'Missing userId header - Only an existing user can perform this action') {
                res.status(400).send(error.message);
            }
            else if (error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')) {
                res.status(404).send('User not registerd');
            }
            else {
                res.status(404).json({ error: error.message });
            }
        }
    }

    async create(req, res) {
        try {
            // await validator.isUserRegisterd(req);
            await validator.validMovie(req.body);
            const movie = await movieService.create({
                title: req.body.title,
                description: req.body.description,
                releaseYear: req.body.releaseYear,
                duration: req.body.duration,
                categories: req.body.categories,
                cast: req.body.cast,
                director: req.body.director,
                movieFile: req.body.movieFile,
            });
            res.status(201).json({ movie });
        } catch (error) {
            if (error.message.includes('E11000 duplicate')) {
                res.status(400).json({ error: 'Movie title must be unique' });
            } else if (error.message.includes('is required')) {
                res.status(400).json({ error: error.message });
            } else if (error.message.includes('Invalid category ID') || error.message.includes('Category not found')) {
                res.status(400).json({ error: error.message });
            } else if (error.message == 'Missing userId header - Only an existing user can perform this action') {
                res.status(400).send(error.message);
            }
            else if (error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')) {
                res.status(404).send('User not registerd');
            }
            else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async update(req, res) {
        try {
            // await validator.isUserRegisterd(req);
            await validator.validMovie(req.body);
            await movieService.update(req.params.id, req.body);

            res.status(204).send();
        }
        catch (error) {
            if (error.message == 'Missing userId header - Only an existing user can perform this action') {
                res.status(400).send(error.message);
            }
            else if (error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')) {
                res.status(404).send('User not registerd');
            }
            else {
                res.status(404).json({ error: error.message });
            }
        }
    }
    async delete(req, res) {
        try {
            // await validator.isUserRegisterd(req);
            await movieService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            // res.status(500).send(error.message);
            if (error.message == 'Missing userId header - Only an existing user can perform this action') {
                res.status(400).send(error.message);
            }
            else if (error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')) {
                res.status(404).send('User not registerd');
            }
            else {
                res.status(404).json({ error: error.message });
            }
        }
    }
    async search(req, res) {
        try {
            console.log('search');
            // await validator.isUserRegisterd(req);
            const query = req.params.query;
            console.log(query); // Getting query from URL
            const movies = await movieService.search(query);
            res.json({ movies });
        } catch (error) {
            // res.status(500).send(error.message);
            if (error.message == 'Missing userId header - Only an existing user can perform this action') {
                res.status(400).send(error.message);
            }
            else if (error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')) {
                res.status(404).send('User not registerd');
            }
            else {
                res.status(404).send('No movies found');
            }
            res.status(500).send(error.message);
        }
    }
}
module.exports = new movieController();

