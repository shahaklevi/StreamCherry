const categoryService = require('../services/categoryService');
const User = require('../models/User');
const validator = require('../utils/validator');




class CategoryController {
    async getAll(req, res) {
        try {
            // //only registerd user can use the function
            // await validator.isUserRegisterd(req);

            const categories = await categoryService.getAll();
            res.json(categories);
        } catch (error) {
            if(error.message == 'Missing userId header - Only an existing user can perform this action'){
                res.status(400).send(error.message);
            }
            else if(error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')){
                res.status(404).send('User not registerd');
            }
            else{
            res.status(404).send(error.message);
            }
        }
    }
    async getById(req, res) {
        try {
            // await validator.isUserRegisterd(req);
            const category = await categoryService.getById(req.params.id);
            res.json(category);
        } catch (error) {
            if (error.message === 'Id is required' || error.message === 'Invalid id format') {
                res.status(400).json({ error: error.message });
            }
            else if(error.message == 'Missing userId header - Only an existing user can perform this action'){
                res.status(400).send(error.message);
            }
            else if(error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')){
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

            const category = await categoryService.create(req.body);
            res.status(201).json({category});
        } catch (error) {
            if (error.message.includes('E11000 duplicate')) {
                res.status(400).json({ error: 'Name must be unique' });
            } else if (error.message.includes('is required')) {
                res.status(400).json({ error: error.message });
            } 
            else if(error.message == 'Missing userId header - Only an existing user can perform this action'){
                res.status(400).send(error.message);
            }
            else if(error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')){
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
            await categoryService.update(req.params.id, req.body);
            res.status(204).send();
        } catch (error) {
            if (error.message === 'Category not found') {
                res.status(404).json({ error: error.message });
            } else if (error.message.includes('E11000 duplicate')) {
                res.status(400).json({ error: 'Name must be unique' });
            } else if (error.message.includes('is required')) {
                res.status(400).json({ error: error.message });
            }
            else if(error.message == 'Missing userId header - Only an existing user can perform this action'){
                res.status(400).send(error.message);
            }
            else if(error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')){
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
            await categoryService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            if (error.message === 'Id is required' || error.message === 'Invalid id format') {
                res.status(400).json({ error: error.message });
            } 
            else if(error.message == 'Missing userId header - Only an existing user can perform this action'){
                res.status(400).send(error.message);
            }
            else if(error.message == 'User not registerd' || error.message.includes('Cast to ObjectId failed for value')){
                res.status(404).send('User not registerd');
            } 
            else {
                res.status(404).json({ error: error.message });
            }
        }
    }
}
module.exports = new CategoryController();

