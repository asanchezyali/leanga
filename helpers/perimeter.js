const haversine = require("haversine");

exports.perimeter = function (house, center) {
    const house_position = {
        latitude: house.Latitud,
        longitude: house.Longitud,
    };

    const center_position = {
        latitude: center.Latitud,
        longitude: center.Longitud,
    };

    return haversine(house_position, center_position, { unit: "km" });
};
