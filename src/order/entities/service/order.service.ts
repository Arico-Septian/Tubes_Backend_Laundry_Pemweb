import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from "src/order/entities/entities/order.entity"
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { PenilaianOrderDto } from '../dto/penilaian-order.dto';
import { where } from 'sequelize';


@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) { }

  async create(body: CreateOrderDto) {
    try {
      const order = this.orderRepository.create({
        kategori_laundry: body.kategori_laundry,
        jumlah_pakaian: body.jumlah_pakaian,
        berat_pakaian: body.berat_pakaian,
        userid: body.userid,
        metode_pembayaran: body.metode_pembayaran,
        jumlah_pembayaran: body.jumlah_pembayaran,
      })
      await this.orderRepository.save(order)

      return order

    } catch (error) {

      throw new UnprocessableEntityException('input data error')
    }

  }

  async update(orderid: string, body: UpdateOrderDto): Promise<Order> {
    try {
      const order = await this.orderRepository.findOneBy({ orderid })

      Object.assign(order, body)

      await this.orderRepository.save(order)

      return order;

    } catch (error) {
      console.log(error)
    }
  }

  async remove(orderid: string) {
    await this.orderRepository.delete(orderid)
    return `This action removes a #${orderid} order`;
  }

  async findAll(): Promise<Order[] | null> {
    const order = await this.orderRepository.find({ relations: ['userid'] })
    return order;
  }

  async findOne(userid: string): Promise<Order[] | null> {
    try {
      const order = await this.orderRepository.findBy({
        userid
      })

      return order;

    } catch (error) {
      console.log(error)
    }
  }

  async findOneOrder(orderid: string): Promise<Order | null> {
    try {
      return this.orderRepository.findOne(
        { where: { orderid } }
      )

    } catch (error) {
      console.log(error)
    }
  }

  async updatepenilaian(orderid: string, body: PenilaianOrderDto): Promise<Order> {
    try {
      const order = await this.orderRepository.findOneBy({ orderid })

      Object.assign(order, body)

      await this.orderRepository.save(order)

      return order;

    } catch (error) {
      console.log(error)
    }
  }
}