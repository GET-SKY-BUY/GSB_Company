

const { Categories } = require('../Models.js');

const Get_Categories = async ( next ) => {
    try {
        const Categories_List = await Categories.findById("GSB-Categories");
        return Categories_List.Categories;
    } catch (err) {
        next(err);
    };
};

const Get_Categories_Option = async ( next ) => {
    try {
        const Categories_List = await Categories.findById("GSB-Categories");
        let Sen = "";
        Categories_List.Categories.forEach(element => {
            Sen += `<option value="${element}">${element}</option>`;
        });
        return Sen;
    } catch (err) {
        next(err);
    };
};

module.exports = {
    Get_Categories,
    Get_Categories_Option,
};