const getName = (category) => {
    var sub_name_array = getNameOfMultiSub(category.subcats);
    if (!sub_name_array.length) {
        return [category.name];
    }
    return sub_name_array.map(name => category.name + '/' + name);
};
const getNameOfMultiSub = (subcats) => {
    if (!subcats.length) {
        return [];
    }
    var name_array = [];
    for (var i in subcats) {
        name_array = name_array.concat(getName(subcats[i]));
    }
    return name_array;
};
export const getCategories = function(categories) {
    var category_array = [];
    for (var i in categories) {
        category_array = category_array.concat(getName(categories[i]));
    }

    return category_array.join('; ');
};