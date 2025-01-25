const Category = require('../models/Category');

class categoryRepository {
    async getAll() {
        return await Category.find();
    }

    async getById(id) {
        try {
            console.log('Trying to find category with id:', id);
            const category = await Category.findById(id).exec();
            console.log('Found category:', category);
            return category;
        } catch (error) {
            console.error('Error in getById:', error);
            throw error;
        }
    }
    async create(categoryData) {
        const category = new Category(categoryData);
        return await category.save();
    }

    async update(id, categoryData) {
        const category = await Category.findById(id);
        if(!category) {
            return null;
        }
        Object.assign(category, categoryData);
        return await category.save();
    }

    async delete(id) {
        return await Category.findByIdAndDelete(id);
    }
}

module.exports = new categoryRepository();