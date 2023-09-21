import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@evtickets2/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

it('returns 404 if order doesnot exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asdf',
            orderId: new mongoose.Types.ObjectId().toHexString(),
        });
});
it('returns 401 when order doesnot belong to user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 0,
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asdf',
            orderId: order.id,
        })
        .expect(401);
});

it('returns 400 purchasing cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId,
        status: OrderStatus.Cancelled,
        price: 0,
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'asdf',
            orderId: order.id,
        })
        .expect(400);
});

// it('returns 204 with valid inputs', async () => {
//     const userId = new mongoose.Types.ObjectId().toHexString();
//     const orderId = new mongoose.Types.ObjectId().toHexString();

//     const order = Order.build({
//         id: orderId,
//         version: 0,
//         userId,
//         status: OrderStatus.Created,
//         price: 20,
//     });

//     await order.save();

//     const response = await request(app)
//         .post('/api/payments')
//         .set('Cookie', global.signin(userId))
//         .send({
//             token: 'tok_visa',
//             orderId,
//         });
//     console.log(response.body);

//     const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

//     expect(chargeOptions.source).toEqual('tok_visa');
//     expect(chargeOptions.amount).toEqual(20 * 100);
//     expect(chargeOptions.currency).toEqual('usd');
// });

it('returns a 204 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Created,
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id,
        })
        .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(20 * 100);
    expect(chargeOptions.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
    });

    console.log(payment);
});
