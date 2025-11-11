"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const OrderResponseDto_1 = require("./dto/OrderResponseDto");
const ApiResponseDto_1 = require("../common/dto/response/ApiResponseDto");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(dto, userId) {
        return this.prisma.$transaction(async (tx) => {
            let totalPrice = 0;
            const orderItemsData = await Promise.all(dto.items.map(async (item) => {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product) {
                    throw new common_1.NotFoundException(`Product not found: ${item.productId}`);
                }
                if (product.stock < item.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for product: ${product.name}`);
                }
                totalPrice += product.price * item.quantity;
                await tx.product.update({
                    where: { id: product.id },
                    data: { stock: product.stock - item.quantity },
                });
                return {
                    productId: product.id,
                    quantity: item.quantity,
                };
            }));
            const order = await tx.order.create({
                data: {
                    userId,
                    totalPrice,
                    description: dto.description || 'No description',
                    status: 'pending',
                    orderItems: {
                        create: orderItemsData,
                    },
                },
                include: {
                    orderItems: true,
                },
            });
            const orderResponse = new OrderResponseDto_1.OrderResponseDto({
                id: order.id,
                userId: order.userId,
                totalAmount: order.totalPrice,
                status: order.status,
                items: order.orderItems.map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                })),
                createdAt: order.createdAt,
            });
            return new ApiResponseDto_1.ApiResponseDto(true, 'Order placed successfully', orderResponse);
        });
    }
    async getUserOrders(userId) {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                status: true,
                totalPrice: true,
                createdAt: true,
                orderItems: {
                    select: {
                        productId: true,
                        quantity: true,
                    },
                },
            },
        });
        return new ApiResponseDto_1.ApiResponseDto(true, 'Orders retrieved successfully', orders);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=Orders.service.js.map