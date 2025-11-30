"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDto = void 0;
class ProductDto {
    id;
    name;
    model;
    display;
    description;
    price;
    stock;
    category;
    userId;
    createdAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.ProductDto = ProductDto;
//# sourceMappingURL=ProductDto.js.map