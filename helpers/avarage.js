exports.avarage = function (data) {
    total_price = data.reduce(
        (previous, current) => previous + current["Precio por metro"],
        0
    );
    avarage_price_by_square_meter = total_price / data.length;
    if (!avarage_price_by_square_meter) {
        avarage_price_by_square_meter = 0;
    }
    return avarage_price_by_square_meter;
};
